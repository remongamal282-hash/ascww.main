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
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/an-elsherka" element={<AboutCompanyPage />} />
        <Route path="/branch-of-company" element={<BranchesPage />} />
        <Route path="/vision-and-message" element={<VisionAndMessagePage />} />
        <Route path="/organization-structure" element={<OrganizationStructurePage />} />
        <Route path="/contract-and-sell" element={<ContractsRegulationPage />} />
        <Route path="/company-achivement" element={<CompanyAchievementsPage />} />
        <Route path="/adviceAndContact" element={<AdviceAndContactPage />} />
        <Route path="/forKidsAndWomen" element={<ForKidsAndWomenPage />} />
        <Route path="/water-quality" element={<WaterQualityPage />} />
        <Route path="/refining-water" element={<RefiningWaterPage />} />
        <Route path="/lab-of-company-water" element={<LabOfCompanyWaterPage />} />
        <Route path="/sewage-treatment" element={<SewageTreatmentPage />} />
        <Route path="/Riddence-waste-water" element={<SafeSewageDisposalPage />} />
        <Route path="/save-web-waste-water" element={<SaveSewageNetworkPage />} />
        <Route path="/manufactring-waste" element={<IndustrialWastePage />} />
        <Route path="/waste-water-in-manufactring" element={<IndustrialWasteRolePage />} />
        <Route path="/forKids" element={<Navigate to="/forKidsAndWomen" replace />} />
        <Route path="/toWomen" element={<Navigate to="/forKidsAndWomen" replace />} />
        <Route path="/news-company" element={<NewsArchive />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/news-company/:id" element={<NewsDetails />} />
        <Route path="/projects" element={<ProjectsArchive />} />
        <Route path="/projects-company" element={<ProjectsArchive />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects-company/:id" element={<ProjectDetails />} />
        <Route path="/allTenders" element={<TendersArchive />} />
        <Route path="/allTenders/:id" element={<TenderDetails />} />
        <Route path="/alltenders" element={<Navigate to="/allTenders" replace />} />
        <Route path="/alltenders/:id" element={<TenderDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
