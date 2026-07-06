export default function FooterSection() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-950">Goglish</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            منصة تعليمية ثانوية عامة مصممة لمساعدة الطلاب المصريين على تجربة
            أفضل قبل وأثناء الامتحانات.
          </p>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <p>تواصل معنا: goglish.mail@gmail.com</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="font-semibold text-slate-900 hover:text-[#FFCC3A]"
            >
              Privacy policy
            </a>
            <span className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-3 text-slate-500">
              <a href="https://www.facebook.com/profile.php?id=61591573683214" className="rounded-full bg-slate-100 px-3 py-1">
                فيسبوك
              </a>
              <a  href="https://www.tiktok.com/@goglish0" className="rounded-full bg-slate-100 px-3 py-1">
                تيك توك
              </a>
              <a  href="https://web.telegram.org/k/#-5462585712" className="rounded-full bg-slate-100 px-3 py-1">
                تليجرام
              </a>
              <a  href="https://www.youtube.com/@goglish-tv" className="rounded-full bg-slate-100 px-3 py-1">
                يوتيوب
              </a>
              <a  href="https://www.instagram.com/goglish_official/" className="rounded-full bg-slate-100 px-3 py-1">
                انستاجرام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
