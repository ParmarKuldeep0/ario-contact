import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const position = formData.get("position");
    const experience = formData.get("experience");
    const message = formData.get("message");
    const resume = formData.get("resume"); // File object

    let attachment = null;
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachment = {
        filename: resume.name,
        content: buffer,
        contentType: resume.type,
      };
    }

    // ✅ Nodemailer transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
       rejectUnauthorized: false, // <-- accept self-signed
      }
    });

    // ✅ Send email
    await transporter.sendMail({
      from: `"Career Portal" <${process.env.EMAIL_USER}>`,
      to: "dev1.bcsgroup@gmail.com",
      subject: `New Career Application: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Position: ${position}
        Experience: ${experience}
        Message: ${message}
      `,
      attachments: attachment ? [attachment] : [],
    });

    return NextResponse.json({ success: true, message: "Application sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}
