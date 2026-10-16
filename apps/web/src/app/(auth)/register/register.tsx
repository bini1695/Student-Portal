"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, USE_MOCKS } from "@/lib/api";

// --- IMPORT THE LOGO HERE (Exact path from your folder structure) ---
import inuLogo from "@/asstes/icons/logo.jpg"; 

// --- Icons ---
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);
const EyeIcon = ({ show }: { show: boolean }) => (
  show ? 
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg> :
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
);

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onSubmit({ name, email, password }: Form) {
    try {
      if (!USE_MOCKS) await api.post("/auth/register", { fullName: name, email, password });
      toast.success("Account created. Sign in to continue.");
      router.push("/login");
    } catch (e) { toast.error(errorMessage(e)); }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4 sm:p-8">
      
      {/* Simple, clean white card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 transition-all duration-300">
        
        {/* Header with Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          
          <div className="w-20 h-20 mb-4 bg-white rounded-full p-1 border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
            <img 
              src={inuLogo.src} 
              alt="Injibara University Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join the Injibara University Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          {/* Full Name Input */}
          <div className="space-y-1.5 group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1B7F4B] transition-colors">
                <UserIcon />
              </div>
              <input 
                id="name" 
                type="text" 
                autoComplete="name"
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#1B7F4B] focus:ring-4 focus:ring-[#1B7F4B]/10" 
                {...register("name")} 
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5 group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">University Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1B7F4B] transition-colors">
                <MailIcon />
              </div>
              <input 
                id="email" 
                type="email" 
                autoComplete="username"
                placeholder="you@inu.edu.et"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#1B7F4B] focus:ring-4 focus:ring-[#1B7F4B]/10" 
                {...register("email")} 
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1B7F4B] transition-colors">
                <LockIcon />
              </div>
              <input 
                id="password" 
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#1B7F4B] focus:ring-4 focus:ring-[#1B7F4B]/10" 
                {...register("password")} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5 group">
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1B7F4B] transition-colors">
                <LockIcon />
              </div>
              <input 
                id="confirm" 
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#1B7F4B] focus:ring-4 focus:ring-[#1B7F4B]/10" 
                {...register("confirm")} 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon show={showConfirm} />
              </button>
            </div>
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center rounded-xl bg-[#1B7F4B] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#15663C] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[#1B7F4B] hover:underline underline-offset-4 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}