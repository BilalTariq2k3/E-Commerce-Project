import path from 'path'
import { writeFile, mkdir, access } from 'fs/promises'
import { constants } from 'fs'
import { fileTypeFromBuffer } from 'file-type'
import sanitize from 'sanitize-filename'

export const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

export const uploadFile = async (buffer, originalFilename) => {
  // Ensure directory exists
  try {
    await access(uploadsDir, constants.F_OK)
  } catch {
    await mkdir(uploadsDir, { recursive: true })
  }

  // Validate buffer
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Invalid file buffer')
  }

  // Validate size (max 2MB)
  const maxFileSizeBytes = 2 * 1024 * 1024
  if (buffer.length > maxFileSizeBytes) {
    throw new Error('File too large. Max size is 2MB.')
  }

  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  const type = await fileTypeFromBuffer(buffer)
  if (!type || !allowedMimeTypes.includes(type.mime)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WEBP allowed.')
  }

  // Generate safe filename
  const safeBase = sanitize(
    path.basename(originalFilename, path.extname(originalFilename))
  ).replace(/[^a-zA-Z0-9-_]/g, '')
  const timestamp = Date.now()
  const safeFilename = `${safeBase}-${timestamp}.${type.ext}`

  // Save file
  const filePath = path.join(uploadsDir, safeFilename)
  await writeFile(filePath, buffer)

  // Return relative path for database
  return `/uploads/${safeFilename}`
}