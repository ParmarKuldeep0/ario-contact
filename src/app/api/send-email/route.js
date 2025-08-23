import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,   // your Gmail address
        pass: process.env.EMAIL_PASS,   // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ dev only
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact form: ${name}`,
      text: `From: ${name} (${email}, ${phone})\n\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
