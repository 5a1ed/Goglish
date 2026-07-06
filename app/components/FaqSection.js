const faqs = [
  {
    question: "متى سيتم إطلاق المنصة؟",
    answer:
      "Goglish حاليًا في مرحلة ما قبل الإطلاق. هيبدأ التسجيل الرسمي قريبًا وهنبعت أول إشعار للمشتركين اللي سجّلوا دلوقتي.",
  },
  {
    question: "هل التسجيل مجاني؟",
    answer:
      "نعم، التسجيل في القائمة المبكرة مجاني. هيكون في عروض خاصة وأولوية وصول عند الإطلاق.",
  },
  {
    question: "هل البيانات آمنة؟",
    answer:
      "طبعًا. بنحافظ على بياناتك ولا نشاركها مع أي طرف خارجي. الخصوصية أولوية عندنا.",
  },
  {
    question: "هل سيكون هناك محتوى مجاني؟",
    answer:
      "نعم، عند الإطلاق هنقدّم محتوى مجاني حصري للمشتركين الأوائل بالإضافة إلى تجربة تعليمية مدفوعة متميزة.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-[#f8fafc] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <h2 className="text-3xl font-bold text-slate-950">الأسئلة الشائعة</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-slate-950">
                  {faq.question}
                  <span className="text-slate-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
