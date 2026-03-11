import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
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
import TendersArchive from './pages/TendersArchive';
import TenderDetails from './pages/TenderDetails';
import GeneralAdminTrainingPage from './pages/GeneralAdminTrainingPage';
import CallCenterPage from './pages/CallCenterPage';
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from './constants/routes';

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
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
    </>
  );
}

export default App;
