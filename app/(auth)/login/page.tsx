"use client";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      toast.success("Already logged in! Redirecting...");
      router.replace("/dashboard"); // ✅ Immediate redirect
    }
  }, [status, router]);  

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
  
    setLoading(true);
  
    const res = await signIn("credentials", { 
      email, 
      password, 
      redirect: false // 🚀 Prevent automatic redirection
    });
  
    if (!res || res.error) {
      toast.error(res?.error || "Invalid email or password.");
      setLoading(false);
      return;
    }
  
    // 🚀 Wait for session update before redirecting
    setTimeout(async () => {
      await fetch("/api/auth/session"); // Force session refresh
      toast.success("Login successful! Redirecting...");
      router.replace("/dashboard"); // ✅ Redirect after session refresh
    }, 1500);
  };

  const handleLogout = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully!");
    setLoading(false);
  };

  if (status === "authenticated") {
    return (
      <div className="w-[40%] flex flex-col items-center justify-center gap-8 shadow-lg p-8 rounded-xl">
        <Toaster position="top-center" richColors />
        <h1 className="text-[24px] font-semibold">Welcome, {session?.user?.name}!</h1>
        <p className="text-[16px] text-muted-foreground">You are already logged in.</p>
        <Button onClick={handleLogout} className="w-full">Logout</Button>
        <Button variant="link" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className='w-[40%] flex flex-col items-center justify-center gap-8 shadow-lg p-8 rounded-xl'>
      <Toaster position="top-center" richColors />

      <div className='flex flex-col items-center gap-2 w-full'>
        <Image
          src="/Evoletech-Innovations-Logo.svg"
          alt="logo"
          width={150}
          height={150}
          quality={100}
        />
        <h1 className='text-center text-[30px] font-semibold font-mono'>Login to your account</h1>
        <p className='text-[16px] font-manrope font-normal text-muted-foreground'>Hello, welcome back to your account</p>
      </div>
      <div className='w-full'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <Label htmlFor="email" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>Email</Label>
            <Input
              id='email'
              type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
            />
          </div>

          <div className='relative'>
          <Label htmlFor="password" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>Password</Label>
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
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

          <div className='flex items-center justify-between gap-4'>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
              />
              <Label htmlFor="terms" className='text-[14px] font-manrope font-normal'>Remember Me</Label>
            </div>

            <div>
              <Link href="/forgot-password" className='text-[14px] font-manrope font-normal text-primary hover:text-muted-foreground hover:underline'>Forgot Password?</Link>
            </div>
          </div>

          <div className='flex items-center justify-center w-full'>
            <Button type="submit" className='w-full text-[18px] py-6 bg-primary' disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Logging In...
                </span>
              ) : (
                "Login Now"
              )}
            </Button>
          </div>

          <div className='flex flex-row items-center justify-center gap-1'>
              <p className='text-[14px] font-manrope font-normal'>Don&apos;t have an account?</p>
              <Link href="/signup" className='text-[14px] font-manrope font-normal text-primary hover:text-muted-foreground hover:underline'>Signup Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}