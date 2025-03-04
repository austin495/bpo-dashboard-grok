import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM users WHERE email = $1 AND otp = $2", [email, otp]);
  client.release();

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  return NextResponse.json({ message: "OTP verified" }, { status: 200 });
}