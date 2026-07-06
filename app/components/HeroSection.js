export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fdf7e9] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(255,204,58,0.22),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_40%)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              منصة جديدة لطلاب الثانوية العامة
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
            </div>
            <div className="space-y-6">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                منصة جديدة لطلاب الثانوية العامة{" "}
                <span className="inline-block">🔥</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-700">
                شرح ذكي – تدريب عملي – منافسة حقيقية. سجل الآن وكن من أوائل
                الطلاب اللي هيبدأوا الرحلة.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
              <a
                href="https://forms.gle/tidDTjtAbQtxYjzZA"
                className="inline-flex items-center justify-center rounded-2xl bg-[#FFCC3A] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#ffcc3a]/20 transition hover:-translate-y-0.5 hover:bg-[#f9c423]"
              >
                احجز مكانك الآن
              </a>
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  سجل من دلوقتي
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  هتوصلك أول دعوة تجربة وأفضل المحتويات عند الإطلاق.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">
                  دخول حصري مبكر
                </p>
              </div>
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">
                  خصم خاص لأول المشتركين
                </p>
              </div>
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">
                  محتوى مجاني عند الإطلاق
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              draggable="false"
              src="/goglishWelcomeCharacter.svg"
              alt="Hero Section"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
