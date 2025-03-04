import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  // Add your authentication logic here
  console.log(`Creating user with email: ${email} and password: ${password}`);
  return NextResponse.json({ message: 'Login successful' });
}