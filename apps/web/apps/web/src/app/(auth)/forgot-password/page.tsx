'use client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-500 mb-6">
          Contact the administrator to reset your password.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}