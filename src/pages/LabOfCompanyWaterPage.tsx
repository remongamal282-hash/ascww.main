import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const labImages = [
  { src: '/images/Labofcompany/lab-1.webp', alt: 'صور المعمل المركزي - 1' },
  { src: '/images/Labofcompany/lab-2.webp', alt: 'صور المعمل المركزي - 2' },
  { src: '/images/Labofcompany/lab-3.webp', alt: 'صور المعمل المركزي - 3' },
  { src: '/images/Labofcompany/lab-4.webp', alt: 'صور المعمل المركزي - 4' },
];
const slideLabImage = '/images/Labofcompany/slide-lab.webp';

function LabOfCompanyWaterPage() {
  const [selectedLabImage, setSelectedLabImage] = useState(labImages[0]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
              <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                <h1 className="text-2xl font-extrabold sm:text-3xl">المعمل المركزي</h1>
                <p className="mt-2 text-sm font-semibold text-white/90 sm:text-base">
                  شركه مياه الشرب والصرف الصحي بأسيوط و الوادي الجديد / المعمل
                </p>
              </div>

	              <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
	                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
	                  <img
	                    src={slideLabImage}
	                    alt="المعمل المركزي لمياه الشركة"
	                    loading="lazy"
	                    className="h-full w-full object-cover"
	                  />
	                </section>

	                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
	                  <h2 className="text-xl font-extrabold text-[#0a3555]">تحليل العينات</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    يتم متابعة جودة المياه المنتجة من المحطات بكافة انواعها (مرشحة ونقالى و زلطية وجوفية ومعالجة
                    حديد ومنجنيز ) بأخذ عينات دورية من تلك المحطات وتحليلها بمعامل الشركة وذلك للوقوف على جودة المياه
                    المنتجة و التأكد من مدى مطابقتها للمواصفات و المعايير الواردة بقرار وزارة الصحة رقم 458 لسنة 2007
                    وانواع التحاليل كالتالى :
                  </p>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">
                      تحاليل فيزيائية : الرقم الهيدروجينى : العكارة , اللون , الطعم ,الرائحة
                    </li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">
                      تحاليل كيميائية : حديد ، منجيز ، امونيا , عسر كلى ، عسر كالسيوم , عسر ماغنسيوم , القلوية الكلية
                      , الاملاح الذائبة الكلية
                    </li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">تحاليل ميكروبيولوجية</li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">فحص ميكروسكوبى</li>
                  </ul>
                </article>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                      <img
                        src={selectedLabImage.src}
                        alt={selectedLabImage.alt}
                        loading="lazy"
                        className="h-full min-h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/65 to-transparent px-4 py-3">
                        <p className="text-sm font-bold text-white">{selectedLabImage.alt}</p>
                      </div>
                    </article>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {labImages.map((image) => (
                        <button
                          key={image.src}
                          type="button"
                          onClick={() => setSelectedLabImage(image)}
                          className={`group relative overflow-hidden rounded-xl border bg-white text-right shadow-sm transition ${
                            selectedLabImage.src === image.src
                              ? 'border-[#0a3555] ring-2 ring-[#0a3555]/25'
                              : 'border-slate-200 hover:border-[#0a3555]/45'
                          }`}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-32"
                          />
                          <div className="px-3 py-2">
                            <p className="text-xs font-bold text-slate-700">{image.alt}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LabOfCompanyWaterPage;
