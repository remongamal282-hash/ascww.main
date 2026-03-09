import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const SITE_TITLE = 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد';

const routeTitles: Record<string, string> = {
  [ROUTES.home]: SITE_TITLE,
  [ROUTES.aboutCompany]: 'نبذه عن الشركة',
  [ROUTES.branches]: 'فروع الشركه',
  [ROUTES.visionAndMessage]: 'الرؤيه والرساله',
  [ROUTES.organizationStructure]: 'الهيكل التنظيمي',
  [ROUTES.contractsRegulation]: 'اللائحة الموحدة للعقود والمشتريات',
  [ROUTES.companyAchievements]: 'إنجازات الشركة',
  [ROUTES.adviceAndContact]: 'التوعية والأتصال',
  [ROUTES.forKidsAndWomen]: 'ركن الأطفال ولكِ سيدتي',
  '/forKids': 'ركن الأطفال ولكِ سيدتي',
  '/toWomen': 'ركن الأطفال ولكِ سيدتي',
  [ROUTES.waterQuality]: 'جودة المياه',
  [ROUTES.refiningWater]: 'تنقية مياه الشرب',
  [ROUTES.labOfCompanyWater]: 'المعمل المركزي لمياه الشرب',
  [ROUTES.sewageTreatment]: 'معالجه الصرف الصحي',
  [ROUTES.safeSewageDisposal]: 'أهمية التخلص الآمن من الصرف الصحى',
  [ROUTES.saveSewageNetwork]: 'أهمية الحفاظ على شبكة الصرف الصحى',
  [ROUTES.industrialWaste]: 'الصرف الصناعي',
  [ROUTES.industrialWasteRole]: 'دور إداره الصرف الصناعي',
  [ROUTES.newsArchive]: 'أرشيف الأخبار',
  '/projects': 'أرشيف المشروعات',
  [ROUTES.projectsArchive]: 'أرشيف المشروعات',
  [ROUTES.tendersArchive]: 'المناقصات',
  '/general-admin-training': 'الإدارة العامة للتدريب',
  '/Result-of-school': 'نتائج المدرسه',
  '/jobs-and-competition': 'مسابقات و وظائف',
  '/result_of_worker': 'نتائج المسابقات',
  '/inquire-your-bill': 'استعلم عن فاتورتك',
  '/call-center': 'خدمه العملاء',
  '/Customer-Charter': 'ميثاق المتعاملين',
  '/Services-Evidance': 'دليل الخدمات',
  '/Contract-On-Service': 'رحلة المتعامل للتعاقد على طلب خدمة',
  '/provide-request': 'تقديم طلب',
  '/provide-complaine': 'تقديم شكوي',
  '/nabza-an-daam-elnazaha': 'نبذه عن إداره دعم النزاهة',
  '/abrz-amaal-daam-elnazaha': 'أبرز أعمال دعم النزاهة',
  '/elslookElwazefy': 'السلوك الوظيفي',
  '/trips-the-boss': 'جولات رئيس مجلس الإداره',
  '/lab-of-company': 'معامل الشركه',
  '/waste-of-company': 'محطات الصرف',
  '/traning-of-company': 'مركز التدريب',
  '/information-technology-of-company': 'قطاع تكنولوجيا المعلومات',
  '/school-new-assuit': 'المدرسه الفنيه',
  '/sport-of-company': 'النشاط الرياضي',
  '/enter-reading': 'إدخل قراءه عدادك',
  '/hotline-app': 'تطبيق الخط الساخن',
  '/my-reading-app': 'تطبيق قرائتي',
  '/hotline125': 'تطبيق الخط الساخن',
  '/readme': 'تطبيق قرائتي',
  '/send-your-reader': 'استعلم عن فاتورتك',
  '/under-build': 'الخدمة قيد التطوير',
};

const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  return pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePathname(pathname);
    const pageTitle =
      routeTitles[normalizedPath]
      || (normalizedPath.startsWith('/news/') || normalizedPath.startsWith(`${ROUTES.newsArchive}/`) || normalizedPath.startsWith('/news-company/') ? 'أرشيف الأخبار' : '')
      || (normalizedPath.startsWith('/projects/') || normalizedPath.startsWith(`${ROUTES.projectsArchive}/`) || normalizedPath.startsWith('/projects-company/') ? 'أرشيف المشروعات' : '')
      || (normalizedPath.startsWith('/tenders/') || normalizedPath.startsWith(`${ROUTES.tendersArchive}/`) || normalizedPath.startsWith('/allTenders/') || normalizedPath.startsWith('/alltenders/') ? 'المناقصات' : '');
    if (!pageTitle) return;

    document.title = pageTitle === SITE_TITLE ? SITE_TITLE : `${pageTitle} | ${SITE_TITLE}`;
  }, [pathname]);

  return null;
}

export default PageTitle;
