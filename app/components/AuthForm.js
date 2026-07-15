"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "ثانية ثانوي",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? {
              name: form.name,
              email: form.email,
              phone: form.phone,
              grade: form.grade,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ ما");
      }

      // On login, redirect to dashboard. On register, redirect to login page.
      if (mode === "login") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-md rounded-4xl bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97706]">
        {mode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
      </p>
      <h3 className="mt-4 text-2xl font-bold text-slate-950">
        {mode === "register" ? "أهلاً بك في رحلتك للتفوق" : "أهلاً بك مجدداً"}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {mode === "register"
          ? "أدخل بياناتك لإنشاء حساب والبدء في المذاكرة"
          : "أدخل بريدك الإلكتروني وكلمة المرور لمتابعة دروسك"}
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {mode === "register" && (
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              الاسم بالكامل <span className="text-[#c2410c]">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="اكتب اسمك ثلاثياً"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            البريد الإلكتروني <span className="text-[#c2410c]">*</span>
          </label>
          <input
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="example@mail.com"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
          />
        </div>

        {mode === "register" && (
          <>
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                رقم الهاتف <span className="text-[#c2410c]">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="01012345678"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
              />
            </div>
            <div>
              <label htmlFor="grade" className="text-sm font-medium text-slate-700">
                الصف الدراسي <span className="text-[#c2410c]">*</span>
              </label>
              <div className="relative mt-3">
                <select
                  id="grade"
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 pr-4 pl-12 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
                >
                  <option value="أولى ثانوي">الصف الأول الثانوي</option>
                  <option value="ثانية ثانوي">الصف الثاني الثانوي</option>
                  <option value="ثالع ثانوي">الصف الثالث الثانوي</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            كلمة المرور <span className="text-[#c2410c]">*</span>
          </label>
          <input
            id="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
          />
        </div>

        {mode === "register" && (
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              تأكيد كلمة المرور <span className="text-[#c2410c]">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
            />
          </div>
        )}

        {error && (
          <p className="text-center text-sm leading-6 text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-[#FFCC3A] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#ffcc3a]/20 transition hover:-translate-y-0.5 hover:bg-[#f9c423] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "جاري التحميل..." : mode === "register" ? "إنشاء حساب مجاناً" : "تسجيل الدخول"}
        </button>

        <p className="text-center text-sm leading-6 text-slate-500">
          {mode === "register" ? (
            <>
              عندك حساب بالفعل؟{" "}
              <Link href="/login" className="font-semibold text-[#d97706] hover:underline">
                سجل دخولك هنا
              </Link>
            </>
          ) : (
            <>
              ما عندكش حساب؟{" "}
              <Link href="/register" className="font-semibold text-[#d97706] hover:underline">
                أنشئ حساباً جديداً
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
