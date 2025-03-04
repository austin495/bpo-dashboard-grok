import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

export async function POST(req: Request) {
  try {
    console.log("Received signup request");

    const bodyText = await req.text();
    console.log("Raw request body:", bodyText); // <-- Log raw body

    if (!bodyText) {
      console.error("Empty request body");
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    let data;
    try {
      data = JSON.parse(bodyText);
      console.log("Parsed JSON data:", data); // <-- Log parsed JSON
    } catch (error) {
      console.error("Invalid JSON format in request body", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { name, phone, email, traffic_source, password } = data;

    console.log("Signup attempt:", { name, phone, email, traffic_source });

    if (!name || !phone || !email || !traffic_source || !password) {
      console.error("Missing required fields");
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      console.log("Connected to database");
      
      const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      console.log("Existing user check result:", existingUser.rows);

      if (existingUser.rows.length > 0) {
        console.error("Email already exists");
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");

      const avatarUrl = `https://api.multiavatar.com/${encodeURIComponent(name)}.png`;

      await client.query(
        'INSERT INTO users (name, phone, email, traffic_source, password, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, phone, email, traffic_source, hashedPassword, avatarUrl]
      );
      
      console.log("User created successfully");
      return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database error", details: (dbError as Error).message }, { status: 500 });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}
