import { transporter } from "../../../lib/email";

export async function POST(req) {
  try {
    const { email, name, phone, address, totalbill, paymentmethod } =
      await req.json();

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(273deg, #cc61eb 0%, #9e3ffe 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0;">E-Commerce Store</h1>
      </div>

      <!-- Body -->
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="margin-top: 0;">Order Confirmation</h2>
        
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your order has been successfully placed. 🎉</p>

        <div style="background: #fff; border: 2px solid #9e3ffe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>📞 Phone:</strong> ${phone}</p>
          <p><strong>📍 Address:</strong> ${address}</p>
          <p><strong>💳 Payment Method:</strong> ${paymentmethod}</p>
          <p><strong>💰 Total Bill:</strong> Rs. ${totalbill}</p>
        </div>

        <p style="color: #666; font-size: 14px;">
          We’ll contact you soon regarding your order.
        </p>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't place this order, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} EZXchange. All rights reserved.</p>
      </div>

    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmed",
      html: htmlContent,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}