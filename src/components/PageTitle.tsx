import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_TITLE = 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد';

const routeTitles: Record<string, string> = {
  '/': SITE_TITLE,
  '/an-elsherka': 'نبذه عن الشركة',
  '/branch-of-company': 'فروع الشركه',
  '/vision-and-message': 'الرؤيه والرساله',
  '/organization-structure': 'الهيكل التنظيمي',
  '/contract-and-sell': 'اللائحة الموحدة للعقود والمشتريات',
  '/company-achivement': 'إنجازات الشركة',
  '/adviceAndContact': 'التوعية والأتصال',
  '/forKidsAndWomen': 'ركن الأطفال ولكِ سيدتي',
  '/forKids': 'ركن الأطفال ولكِ سيدتي',
  '/toWomen': 'ركن الأطفال ولكِ سيدتي',
  '/water-quality': 'جودة المياه',
  '/refining-water': 'تنقية مياه الشرب',
  '/lab-of-company-water': 'المعمل المركزي لمياه الشرب',
  '/sewage-treatment': 'معالجه الصرف الصحي',
  '/Riddence-waste-water': 'أهمية التخلص الآمن من الصرف الصحى',
  '/save-web-waste-water': 'أهمية الحفاظ على شبكة الصرف الصحى',
  '/manufactring-waste': 'الصرف الصناعي',
  '/waste-water-in-manufactring': 'دور إداره الصرف الصناعي',
  '/news-company': 'أرشيف الأخبار',
  '/projects': 'أرشيف المشروعات',
  '/projects-company': 'أرشيف المشروعات',
  '/allTenders': 'المناقصات',
  '/alltenders': 'المناقصات',
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
      || (normalizedPath.startsWith('/news/') || normalizedPath.startsWith('/news-company/') ? 'أرشيف الأخبار' : '')
      || (normalizedPath.startsWith('/projects/') || normalizedPath.startsWith('/projects-company/') ? 'أرشيف المشروعات' : '')
      || (normalizedPath.startsWith('/allTenders/') || normalizedPath.startsWith('/alltenders/') ? 'المناقصات' : '');
    if (!pageTitle) return;

    document.title = pageTitle === SITE_TITLE ? SITE_TITLE : `${pageTitle} | ${SITE_TITLE}`;
  }, [pathname]);

  return null;
}

export default PageTitle;
