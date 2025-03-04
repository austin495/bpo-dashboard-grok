"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔹 Request OTP
    const handleRequestOTP = async () => {
        if (!email) {
            toast.error("Email is required.");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/auth/request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.error || "Failed to send OTP.");
            return;
        }

        toast.success("OTP sent to your email!");
        setStep(2); // Move to OTP verification step
    };

    // 🔹 Verify OTP
    const handleVerifyOTP = async () => {
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.error || "Invalid OTP.");
            return;
        }

        toast.success("OTP verified! You can reset your password.");
        setStep(3); // Move to password reset step
    };

    // 🔹 Reset Password
    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.error || "Failed to reset password.");
            return;
        }

        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
    };

    return (
        <div className="w-[40%] flex flex-col items-center justify-center gap-5 shadow-lg p-8 rounded-xl">
            <Toaster position="top-center" richColors />
            <div className="text-center">
                <h1 className="text-[24px] font-semibold">Forgot Password</h1>
                <p className="text-[16px] text-muted-foreground">Enter your email to reset your password.</p>
            </div>

            {step === 1 && (
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <Label htmlFor="email" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>Email</Label>
                        <Input
                            id='email'
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
                        />
                    </div>
                    <Button onClick={handleRequestOTP} disabled={loading} className="w-full text-[18px] py-6 bg-primary">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Sending OTP...
                            </span>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <Label htmlFor="otp" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>Enter OTP</Label>
                        <Input
                            id='otp'
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="example@email.com"
                            className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
                        />
                    </div>
                    <Button onClick={handleVerifyOTP} disabled={loading} className="w-full text-[18px] py-6 bg-primary">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Verifying...
                            </span>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>
                </div>
            )}

            {step === 3 && (
                <div className="w-full flex flex-col gap-4">
                    <div className='relative'>
                        <Label htmlFor="password" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>New Password</Label>
                        <Input
                            id='password'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='py-6 px-4 rounded-md mt-[-12px] font-manrope focus-visible:ring-1 focus-visible:ring-primary'
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-[18px]"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                    </div>
                    <div className='relative'>
                        <Label htmlFor="confirmPassword" className='ml-4 text-[16px] font-manrope font-medium bg-white px-2'>Confirm Password</Label>
                        <Input
                            id='confirmPassword'
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
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
                    <Button onClick={handleResetPassword} disabled={loading} className="w-full text-[18px] py-6 bg-primary">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Resetting...
                            </span>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
