export default function WhyGoglishSection() {
  const items = [
    {
      title: "دخول حصري مبكر",
      desc: "تكون من أوائل الطلاب اللي يجربوا المنصة قبل الكل.",
    },
    {
      title: "خصم خاص لأول المشتركين",
      desc: "خصومات حصرية على باقات المحتوى عند الإطلاق.",
    },
    {
      title: "محتوى مجاني عند الإطلاق",
      desc: "محتوى تأسيسي مجاني يدعم بداية قوية.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[28px] bg-white px-6 py-10 shadow-[0_30px_60px_rgba(15,23,42,0.06)] ring-1 ring-slate-200 sm:px-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97706]">
              ليه تسجل من دلوقتي؟
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
              ٣ أسباب تخليك ما تفوتش الفرصة
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            سجل في Goglish مبكرًا واستعد لمحتوى مصمم لكل طالب ثانوية عامة، مع
            فرص حصرية وتجربة أذكى.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <p className="text-lg font-semibold text-slate-950">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
