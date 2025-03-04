import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  await client.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);
  client.release();

  return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
}