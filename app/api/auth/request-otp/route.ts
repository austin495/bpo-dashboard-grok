import { NextResponse } from "next/server";
import { Pool } from "pg";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const client = await pool.connect();
  try {
    await client.query("UPDATE users SET otp = $1 WHERE email = $2", [otp, email]);

    await resend.emails.send({
      from: "support@ihealthinsurances.com",
      to: email,
      subject: "Your OTP Code | Evolve Tech Innovations",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`,
    });

    console.log(`OTP Sent: ${otp} to ${email}`);
    return NextResponse.json({ message: "OTP sent to your email!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP. Try again later." }, { status: 500 });
  } finally {
    client.release();
  }
}