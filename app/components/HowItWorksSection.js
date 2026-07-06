export default function HowItWorksSection() {
  const steps = [
    { title: "سجل بياناتك", desc: "اكتب اسمك وبريدك ورقمك والصف الدراسي." },
    {
      title: "هنبعتلك رسالة أول ما نفتح",
      desc: "توصلك إشعار مباشر عند بداية التسجيل الرسمي.",
    },
    {
      title: "تبدأ رحلتك نحو التفوق",
      desc: "تدخل على محتوى مصمم مخصوص لك وتبدأ تذاكر بذكاء.",
    },
  ];

  return (
    <section className="bg-[#111827]/5 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97706]">
              ازاي تمشي معاها
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              خطوات بسيطة للانضمام
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              العملية سهلة وسريعة. سجل بياناتك، وهنتواصل معاك على طول، وتبدأ
              الرحلة التعليمية على Goglish.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FFCC3A]/10 text-xl font-bold text-[#B45309]">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-slate-950">
                    {step.title}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
