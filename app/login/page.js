import Navbar from "../components/Navbar";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
