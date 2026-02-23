import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewsArchive from './pages/NewsArchive';
import NewsDetails from './pages/NewsDetails';
import ProjectsArchive from './pages/ProjectsArchive';
import ProjectDetails from './pages/ProjectDetails';
import AboutCompanyPage from './pages/AboutCompanyPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/an-elsherka" element={<AboutCompanyPage />} />
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
