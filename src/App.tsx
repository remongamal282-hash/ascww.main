import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
<<<<<<< HEAD
=======
import NewsArchive from './pages/NewsArchive';
import NewsDetails from './pages/NewsDetails';
import ProjectsArchive from './pages/ProjectsArchive';
import ProjectDetails from './pages/ProjectDetails';
import AboutCompanyPage from './pages/AboutCompanyPage';
import BranchesPage from './pages/BranchesPage';
import VisionAndMessagePage from './pages/VisionAndMessagePage';
import OrganizationStructurePage from './pages/OrganizationStructurePage';
import ContractsRegulationPage from './pages/ContractsRegulationPage';
import CompanyAchievementsPage from './pages/CompanyAchievementsPage';
import AdviceAndContactPage from './pages/AdviceAndContactPage';
import ForKidsAndWomenPage from './pages/ForKidsAndWomenPage';
import WaterQualityPage from './pages/WaterQualityPage';
import RefiningWaterPage from './pages/RefiningWaterPage';
import LabOfCompanyWaterPage from './pages/LabOfCompanyWaterPage';
import SewageTreatmentPage from './pages/SewageTreatmentPage';
import SafeSewageDisposalPage from './pages/SafeSewageDisposalPage';
import SaveSewageNetworkPage from './pages/SaveSewageNetworkPage';
import IndustrialWastePage from './pages/IndustrialWastePage';
import IndustrialWasteRolePage from './pages/IndustrialWasteRolePage';
import CustomerCharterPage from './pages/CustomerCharterPage';
import TendersArchive from './pages/TendersArchive';
import TenderDetails from './pages/TenderDetails';
import GeneralAdminTrainingPage from './pages/GeneralAdminTrainingPage';
import CallCenterPage from './pages/CallCenterPage';
>>>>>>> 9a151bc150d4800399fb2d69533981c12c23f7c1
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from './constants/routes';

const NewsArchive = lazy(() => import('./pages/NewsArchive'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const ProjectsArchive = lazy(() => import('./pages/ProjectsArchive'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const VisionAndMessagePage = lazy(() => import('./pages/VisionAndMessagePage'));
const OrganizationStructurePage = lazy(() => import('./pages/OrganizationStructurePage'));
const ContractsRegulationPage = lazy(() => import('./pages/ContractsRegulationPage'));
const CompanyAchievementsPage = lazy(() => import('./pages/CompanyAchievementsPage'));
const AdviceAndContactPage = lazy(() => import('./pages/AdviceAndContactPage'));
const ForKidsAndWomenPage = lazy(() => import('./pages/ForKidsAndWomenPage'));
const WaterQualityPage = lazy(() => import('./pages/WaterQualityPage'));
const RefiningWaterPage = lazy(() => import('./pages/RefiningWaterPage'));
const LabOfCompanyWaterPage = lazy(() => import('./pages/LabOfCompanyWaterPage'));
const SewageTreatmentPage = lazy(() => import('./pages/SewageTreatmentPage'));
const SafeSewageDisposalPage = lazy(() => import('./pages/SafeSewageDisposalPage'));
const SaveSewageNetworkPage = lazy(() => import('./pages/SaveSewageNetworkPage'));
const IndustrialWastePage = lazy(() => import('./pages/IndustrialWastePage'));
const IndustrialWasteRolePage = lazy(() => import('./pages/IndustrialWasteRolePage'));
const TendersArchive = lazy(() => import('./pages/TendersArchive'));
const TenderDetails = lazy(() => import('./pages/TenderDetails'));
const GeneralAdminTrainingPage = lazy(() => import('./pages/GeneralAdminTrainingPage'));
const CallCenterPage = lazy(() => import('./pages/CallCenterPage'));

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
<<<<<<< HEAD
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 text-sm font-semibold text-slate-500">
            جاري تحميل الصفحة...
          </div>
        }
      >
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.aboutCompany} element={<AboutCompanyPage />} />
          <Route path={ROUTES.branches} element={<BranchesPage />} />
          <Route path={ROUTES.visionAndMessage} element={<VisionAndMessagePage />} />
          <Route path={ROUTES.organizationStructure} element={<OrganizationStructurePage />} />
          <Route path={ROUTES.contractsRegulation} element={<ContractsRegulationPage />} />
          <Route path={ROUTES.companyAchievements} element={<CompanyAchievementsPage />} />
          <Route path={ROUTES.adviceAndContact} element={<AdviceAndContactPage />} />
          <Route path={ROUTES.forKidsAndWomen} element={<ForKidsAndWomenPage />} />
          <Route path={ROUTES.waterQuality} element={<WaterQualityPage />} />
          <Route path={ROUTES.refiningWater} element={<RefiningWaterPage />} />
          <Route path={ROUTES.labOfCompanyWater} element={<LabOfCompanyWaterPage />} />
          <Route path={ROUTES.sewageTreatment} element={<SewageTreatmentPage />} />
          <Route path={ROUTES.safeSewageDisposal} element={<SafeSewageDisposalPage />} />
          <Route path={ROUTES.saveSewageNetwork} element={<SaveSewageNetworkPage />} />
          <Route path={ROUTES.industrialWaste} element={<IndustrialWastePage />} />
          <Route path={ROUTES.industrialWasteRole} element={<IndustrialWasteRolePage />} />
          <Route path={ROUTES.newsArchive} element={<NewsArchive />} />
          <Route path={ROUTES.newsDetails} element={<NewsDetails />} />
          <Route path={ROUTES.projectsArchive} element={<ProjectsArchive />} />
          <Route path={ROUTES.projectDetails} element={<ProjectDetails />} />
          <Route path={ROUTES.tendersArchive} element={<TendersArchive />} />
          <Route path={ROUTES.tenderDetails} element={<TenderDetails />} />
          <Route path={ROUTES.generalAdminTraining} element={<GeneralAdminTrainingPage />} />
          <Route path={ROUTES.callCenter} element={<CallCenterPage />} />
          <Route path="/news-company/:id" element={<NewsDetails />} />
          <Route path="/projects-company/:id" element={<ProjectDetails />} />
          <Route path="/allTenders/:id" element={<TenderDetails />} />
          <Route path="/alltenders/:id" element={<TenderDetails />} />
          {LEGACY_ROUTE_REDIRECTS.map((legacyRoute) => (
            <Route
              key={legacyRoute.from}
              path={legacyRoute.from}
              element={<Navigate to={legacyRoute.to} replace />}
            />
          ))}
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Suspense>
=======
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.aboutCompany} element={<AboutCompanyPage />} />
        <Route path={ROUTES.branches} element={<BranchesPage />} />
        <Route path={ROUTES.visionAndMessage} element={<VisionAndMessagePage />} />
        <Route path={ROUTES.organizationStructure} element={<OrganizationStructurePage />} />
        <Route path={ROUTES.contractsRegulation} element={<ContractsRegulationPage />} />
        <Route path={ROUTES.companyAchievements} element={<CompanyAchievementsPage />} />
        <Route path={ROUTES.adviceAndContact} element={<AdviceAndContactPage />} />
        <Route path={ROUTES.forKidsAndWomen} element={<ForKidsAndWomenPage />} />
        <Route path={ROUTES.waterQuality} element={<WaterQualityPage />} />
        <Route path={ROUTES.refiningWater} element={<RefiningWaterPage />} />
        <Route path={ROUTES.labOfCompanyWater} element={<LabOfCompanyWaterPage />} />
        <Route path={ROUTES.sewageTreatment} element={<SewageTreatmentPage />} />
        <Route path={ROUTES.safeSewageDisposal} element={<SafeSewageDisposalPage />} />
        <Route path={ROUTES.saveSewageNetwork} element={<SaveSewageNetworkPage />} />
        <Route path={ROUTES.industrialWaste} element={<IndustrialWastePage />} />
        <Route path={ROUTES.industrialWasteRole} element={<IndustrialWasteRolePage />} />
        <Route path={ROUTES.customerCharter} element={<CustomerCharterPage />} />
        <Route path={ROUTES.newsArchive} element={<NewsArchive />} />
        <Route path={ROUTES.newsDetails} element={<NewsDetails />} />
        <Route path={ROUTES.projectsArchive} element={<ProjectsArchive />} />
        <Route path={ROUTES.projectDetails} element={<ProjectDetails />} />
        <Route path={ROUTES.tendersArchive} element={<TendersArchive />} />
        <Route path={ROUTES.tenderDetails} element={<TenderDetails />} />
        <Route path={ROUTES.generalAdminTraining} element={<GeneralAdminTrainingPage />} />
        <Route path={ROUTES.callCenter} element={<CallCenterPage />} />
        <Route path="/news-company/:id" element={<NewsDetails />} />
        <Route path="/projects-company/:id" element={<ProjectDetails />} />
        <Route path="/allTenders/:id" element={<TenderDetails />} />
        <Route path="/alltenders/:id" element={<TenderDetails />} />
        {LEGACY_ROUTE_REDIRECTS.map((legacyRoute) => (
          <Route
            key={legacyRoute.from}
            path={legacyRoute.from}
            element={<Navigate to={legacyRoute.to} replace />}
          />
        ))}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
>>>>>>> 9a151bc150d4800399fb2d69533981c12c23f7c1
    </>
  );
}

export default App;
