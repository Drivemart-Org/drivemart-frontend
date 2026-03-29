import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginForm from "./login-form";

export const metadata = {
  title: "Log in or sign up | DriveMart",
  description: "Log in or create a DriveMart account.",
};

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy"}>
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <LoginForm />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
