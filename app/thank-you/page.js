import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950"
    >
      <section className="mx-auto max-w-3xl mt-10 rounded-[32px] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F0AF] text-4xl shadow-inner shadow-slate-200">
          ✅
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          تم تسجيلك بنجاح 🎉
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          استعد… مفاجآت قوية جاية قريب 🔥
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-3xl bg-[#FFCC3A] px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-[#FFCC3A]/20 transition hover:-translate-y-0.5"
        >
          العودة للرئيسية
        </Link>
      </section>
    </main>
  );
}
