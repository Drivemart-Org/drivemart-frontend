"use client";

import React, { useState } from "react";
import { X, ArrowLeft, Mail, Navigation, Check, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { storeToken } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";


type AuthView = "options" | "email-login" | "email-register" | "email-otp";

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/v1/auth`;

export default function LoginForm() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [view, setView] = useState<AuthView>("options");

  const [password, setPassword] = useState("");

  const pwdChecks = {
    length: password.length >= 7,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    noName: true,
  };

  const handleBack = () => {
    if (view === "options") router.push("/");
    else setView("options");
  };

  return (
    <div className="relative flex flex-col items-center bg-white min-h-[500px] w-full pt-10 pb-8 px-6 sm:px-12">
      <button
        onClick={handleBack}
        className="absolute left-6 top-6 text-gray-500 hover:text-black transition-colors"
      >
        {view === "options" ? <X size={24} /> : <ArrowLeft size={24} />}
      </button>

      {view === "options" && <OptionsView setView={setView} refreshAuth={refreshAuth} />}
      {view === "email-login" && <LoginView setView={setView} refreshAuth={refreshAuth} />}
      {view === "email-register" && (
        <RegisterView password={password} setPassword={setPassword} pwdChecks={pwdChecks} setView={setView} refreshAuth={refreshAuth} />
      )}
      {view === "email-otp" && <OtpView setView={setView} />}

    </div>
  );
}

function OptionsView({ setView, refreshAuth }: { setView: (v: AuthView) => void, refreshAuth: () => Promise<void> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: tokenResponse.access_token }),
        });
        if (res.ok) {
          const data = await res.json();
          await storeToken(data.access_token);
          await refreshAuth();
          router.push("/dashboard");
        } else {
          setError("Google login failed on backend.");
        }
      } catch (err) {
        setError("Network error.");
      }
      setLoading(false);
    },
    onError: () => setError("Google login failed."),
  });

  return (
    <div className="flex flex-col w-full items-center mt-4">
      <div className="mb-6 rounded-xl bg-blue-50 p-4">
        <Navigation size={48} className="text-red-500 mx-auto" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Log in to place an ad</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4 w-full">
        <AuthButton
          icon={<GoogleIcon />}
          text={loading ? "Connecting..." : "Continue with Google"}
          onClick={() => loginWithGoogle()}
        />
        <AuthButton
          icon={<Mail className="w-5 h-5 text-red-600" />}
          text="Continue with Email"
          onClick={() => setView("email-login")}
        />
      </div>

      <p className="mt-8 text-sm text-red-600 font-medium cursor-pointer hover:underline" onClick={() => setView("email-register")}>
        Don't have an account? Create one
      </p>

      <p className="mt-8 text-xs text-gray-400 text-center px-4 leading-relaxed">
        By signing up I agree to the <span className="text-blue-600 cursor-pointer">Terms and Conditions</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
}

function LoginView({ setView, refreshAuth }: { setView: (v: AuthView) => void, refreshAuth: () => Promise<void> }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        await storeToken(data.access_token);
        await refreshAuth();
        router.push("/dashboard");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full mt-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 self-center">Welcome Back</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-shadow text-black" />
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-shadow text-black" />
      </div>

      <button disabled={loading} type="submit" className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-300">
        {loading ? "Logging In..." : "Log In"}
      </button>

      <p className="mt-6 text-sm text-center text-blue-600 cursor-pointer font-medium hover:underline" onClick={() => setView("email-otp")}>
        Login with OTP instead
      </p>
    </form>
  );
}

function RegisterView({ password, setPassword, pwdChecks, setView, refreshAuth }: any) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = Object.values(pwdChecks).every(Boolean);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        await storeToken(data.access_token);
        await refreshAuth();
        router.push("/dashboard");
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 self-center">Create an account</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 text-black" />
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 text-black" />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 text-black"
        />
      </div>

      <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
        <CheckItem text="At least 7 characters long" valid={pwdChecks.length} />
        <CheckItem text="One upper and one lower case letter" valid={pwdChecks.upperLower} />
        <CheckItem text="Must contain a number" valid={pwdChecks.number} />
        <CheckItem text="At least one special character" valid={pwdChecks.special} />
        <CheckItem text="Must not include your name" valid={pwdChecks.noName} />
      </div>

      <button disabled={!isValid || loading} type="submit" className={`w-full mt-6 text-white font-bold py-3 rounded-lg shadow-md transition-colors duration-300 ${isValid ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}

function OtpView({ setView }: { setView: (v: AuthView) => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Backend currently ignores body but we send it
      });
      if (res.ok) {
        setMessage("OTP sent to your email! (Simulated backend success)");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="flex flex-col w-full mt-4 items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign in with OTP</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">We'll send a 6-digit code to your email.</p>

      {message && <p className="text-green-600 text-sm mb-4 font-medium">{message}</p>}

      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 mb-6 text-black" />

      <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md">
        {loading ? "Sending..." : "Send Code"}
      </button>
    </form>
  );
}

function CheckItem({ text, valid }: { text: string; valid: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {valid ? <Check size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
      <span className={`text-sm ${valid ? 'text-gray-900' : 'text-gray-500'}`}>{text}</span>
    </div>
  );
}

function AuthButton({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center justify-center w-full py-3.5 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 relative"
    >
      <span className="absolute left-4">{icon}</span>
      <span className="font-semibold text-gray-700 text-[15px]">{text}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 384 512" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.8 0-46.6-21-73-20.1-42.6.9-83.6 28.1-102.6 68.8-38.2 81.3-15 204.4 20.6 257.6 17.6 25.1 39.5 53 67.5 52.1 26.5-.9 35.8-17.1 68.1-17.1 32.3 0 41.2 17.1 68.1 17.1 28.5-.9 47.9-25.1 65-50.6 19.4-28.5 27.4-56.1 28.2-57.5-1.2-.6-39.7-15.6-40.3-58.4zM266.1 76.5c14.7-18.2 24.7-43.5 22-69.5-22.3 1-49.1 14.4-64.4 32.6-13.8 15.6-25 41.5-21.7 66.8 24.7 1.8 49.4-11.7 64.1-29.9z" />
    </svg>
  );
}
