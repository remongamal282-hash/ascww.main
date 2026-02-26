import Footer from '../components/Footer';
import Header from '../components/Header';

const contractsPdfUrl = new URL('../../standard-contracts-and-procurement-regulation.pdf', import.meta.url).href;

function ContractsRegulationPage() {
  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_15%_20%,_rgba(17,112,176,0.16),_transparent_42%),radial-gradient(circle_at_85%_10%,_rgba(215,176,90,0.2),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4fa_100%)]"
        dir="rtl"
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                عن الشركة
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                اللائحة الموحدة للعقود والمشتريات
              </h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                عرض تفاعلي لملف اللائحة داخل الموقع بأسلوب مشابه لعارض الكتب الرقمية.
              </p>
            </div>

            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-l from-[#08253c] via-[#0f3b5e] to-[#0a3555] p-1">
                <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#0b2a44_0%,#08223a_42%,#061a2e_100%)] p-4 sm:p-6 lg:p-8">
                  <div className="pointer-events-none absolute -right-20 top-8 h-48 w-48 rounded-full bg-[#d7b05a]/15 blur-3xl" />
                  <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#1170b0]/25 blur-3xl" />

                  <div className="relative z-10 flex flex-wrap items-center justify-end gap-3 pb-4">
                    <div className="flex items-center gap-2">
                      <a
                        className="inline-flex items-center rounded-xl bg-[#d7b05a] px-4 py-2 text-sm font-bold text-[#0a3555] transition hover:bg-[#c79d41]"
                        download
                        href={contractsPdfUrl}
                      >
                        تحميل PDF
                      </a>
                    </div>
                  </div>

                  <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-white/25 bg-white shadow-[0_25px_80px_rgba(2,6,23,0.45)]">
                    <div className="aspect-[16/10] w-full">
                      <iframe
                        className="h-full w-full"
                        src={`${contractsPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                        title="اللائحة الموحدة للعقود والمشتريات"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-800/25" />
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-20 -translate-x-1/2 bg-gradient-to-r from-black/5 via-white/45 to-black/5" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContractsRegulationPage;
