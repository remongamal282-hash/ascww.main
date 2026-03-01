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
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
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
        <Route path="/forKids" element={<Navigate to="/forKidsAndWomen" replace />} />
        <Route path="/toWomen" element={<Navigate to="/forKidsAndWomen" replace />} />
        <Route path="/news-company" element={<NewsArchive />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/news-company/:id" element={<NewsDetails />} />
        <Route path="/projects" element={<ProjectsArchive />} />
        <Route path="/projects-company" element={<ProjectsArchive />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects-company/:id" element={<ProjectDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
