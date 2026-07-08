"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EarlyAccessSection() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "أولى",
  });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "" });

    if (!form.name || !form.email || !form.grade) {
      setStatus({
        loading: false,
        error: "الاسم والبريد الإلكتروني والصف الدراسي مطلوبين.",
      });
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "حدث خطأ أثناء إرسال الطلب.");
      }

      router.push("/thank-you");
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "حدث خطأ أثناء الإرسال.",
      });
    }
  };

  return (
    <section
      id="early-access"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97706]">
            احجز مكانك الآن 🚀
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            سجل بياناتك قبل الإطلاق
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            محتوى Goglish مبني مخصوص للطالب المصري. سجل دلوقتي وخليك جاهز لأقوى
            بداية في الثانوية العامة.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-semibold text-slate-950">
                خبرة تعليمية قوية
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                فريق متخصص في شرح مناهج الثانوية العامة.
              </p>
            </div>
            <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-semibold text-slate-950">
                منصة للمصريين
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                محتوى وسياق مناسب للمذاكرة في مصر.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97706]">
            سجل الآن
          </p>
          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            احجز مكانك قبل أي حد
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            البيانات تساعدنا نجهز لك تجربة تعليمية مخصصة وسريعة عند الإطلاق.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                الاسم <span className="text-[#c2410c]">*</span>
              </label>
              <input
                id="name"
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="اكتب اسمك"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-slate-700"
              >
                رقم الهاتف <span className="text-[#c2410c]">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="number"
                placeholder="01012345678"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                البريد الإلكتروني{" "}
                <span className="text-slate-500">(اختياري ولكن يفضل)</span>
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="example@mail.com"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="grade"
                className="text-sm font-medium text-slate-700"
              >
                الصف الدراسي
              </label>
              <div className="relative mt-3">
                <select
                  id="grade"
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-slate-900 outline-none transition focus:border-[#FFCC3A] focus:ring-2 focus:ring-[#FFCC3A]/20"
                >
                  <option>أولى</option>
                  <option>ثانية</option>
                  <option>ثالثة</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-3xl bg-[#FFCC3A] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#ffcc3a]/20 transition hover:-translate-y-0.5 hover:bg-[#f9c423] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.loading ? "جاري الإرسال..." : "سجل الآن"}
            </button>
            {status.error ? (
              <p className="text-center text-sm leading-6 text-red-600">
                {status.error}
              </p>
            ) : null}
            <p className="text-center text-sm leading-6 text-slate-500">
              لن نشارك بياناتك مع أي طرف آخر.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
