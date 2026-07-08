export default function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[32px] bg-[#FFCC3A] p-10 text-slate-950 shadow-[0_30px_60px_rgba(255,204,58,0.25)] sm:p-14">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              مستني إيه؟
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              كن من أوائل طلاب Goglish 🎓
            </h2>
          </div>
          <a
            href="#early-access"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-3xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5"
          >
            احجز مكانك الآن
          </a>
        </div>
      </div>
    </section>
  );
}
