export default function CredibilitySection() {
  const points = [
    {
      title: "خبرة تعليمية قوية",
      desc: "محتوى مصمم من مدرسين فاهمين طبيعة الثانوية العامة ومتطلباتها.",
    },
    {
      title: "فريق متخصص في شرح مناهج الثانوية العامة",
      desc: "شرح واضح، تدريبات محترفة، وتوجيه يركز على النتائج.",
    },
    {
      title: "منصة مبنية خصيصًا للطلاب المصريين",
      desc: "منهج، أسلوب، ودعم مناسب للطالب المصري وسوق التعليم في مصر.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[28px] bg-slate-950 px-8 py-12 text-white shadow-[0_30px_70px_rgba(15,23,42,0.16)] sm:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {points.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20 ring-1 ring-white/10"
            >
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
