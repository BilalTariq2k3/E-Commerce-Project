import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.ts";
import connectDB from "../../../lib/mongodb";
import User from "../../../model/user";
import { uploadFile } from "../../utilis/helpers.js";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("-password");

  return NextResponse.json(user);
}

export async function PUT(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const formData = await req.formData();

    const fname = formData.get("fname");
    const lname = formData.get("lname");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const dob = formData.get("dob");

    const file = formData.get("profileImage");
    let profileImageUrl;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      profileImageUrl = await uploadFile(buffer, file.name);
    }

    console.log("file", file);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fname,
        lname,
        phone,
        address,
        dob,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      },
      { new: true },
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
