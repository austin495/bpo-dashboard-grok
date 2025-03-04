"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [traffic_source, setTrafficSource] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isValidPhone = (phone: string) => /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Field Validation
    if (!name || !phone || !email || !traffic_source || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!isValidPassword(password)) {
      toast.error("Password must be 8+ chars, include an uppercase letter & number.");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Invalid phone number format.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    // 🔹 API Request
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, traffic_source, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed.");
        return;
      }

      // ✅ Success: Show Toast & Redirect
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error("An error occurred. Try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className='w-[50%] flex flex-col items-center justify-center gap-8 shadow-lg p-8 rounded-xl'>
      <Toaster position="top-center" richColors />

      <div className='flex flex-col items-center gap-2 w-full'>
        <Image
          src="/Evoletech-Innovations-Logo.svg"
          alt="logo"
          width={150}
          height={150}
          quality={100}
        />
        <h1 className='text-center text-[30px] font-semibold font-mono'>Create your account</h1>
        <p className='text-[16px] font-manrope font-normal text-muted-foreground'>Let&apos;s get your account set up.</p>
      </div>
      <div className='w-full'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <Label
              htmlFor="name"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Full Name
            </Label>
            <Input
              id='name'
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
          </div>

          <div>
            <Label
              htmlFor="phone"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Phone Number
            </Label>
            <Input
              id='phone'
              type="text"
              placeholder="(234) 123-4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Email
            </Label>
            <Input
              id='email'
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
          </div>

          <div>
            <Label
              htmlFor="traffic-source"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Traffic Source ID
            </Label>
            <Input
              id='traffic-source'
              type="text"
              placeholder="Your Traffic Source ID"
              value={traffic_source}
              onChange={e => setTrafficSource(e.target.value)}
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
          </div>

          <div className='relative'>
            <Label
              htmlFor="password"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Password
            </Label>
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-[18px]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          <div className="relative">
            <Label
              htmlFor="confirm-password"
              className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>
              Confirm Password
            </Label>
            <Input
              id='confirm-password'
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Your Password"
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-[18px]"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          <div className='flex flex-row items-center justify-center gap-1'>
            <p className='text-[14px] font-manrope font-normal'>Already have an account?</p>
            <Link href="/login" className='text-[14px] font-manrope font-normal text-primary hover:text-muted-foreground hover:underline'>Log In</Link>
          </div>

          <div className='flex flex-col gap-4 items-center justify-center w-full'>
            <Button type="submit" className='w-full text-[18px] py-6 bg-primary' disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Signing Up...
                </span>
              ) : (
                "Signup Now"
              )}
            </Button>
            <p className='text-[14px] text-center font-manrope font-normal text-muted-foreground'>By signing up to create an account, you are accepting our terms & conditions and privacy policy</p>
          </div>
        </form>
      </div>
    </div>
  );
}