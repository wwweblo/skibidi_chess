import { NextResponse } from "next/server";
import EmailService from "@/utils/EmailService";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ message: "Recipient email is required" }, { status: 400 });
    }

    const info = await EmailService.sendEmail(
      to,
      "Test Email",
      "This is a test email sent from Next.js!",
      "<h1>This is a test email sent from Next.js!</h1>"
    );

    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send email", error }, { status: 500 });
  }
}
