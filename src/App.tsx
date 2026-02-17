import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewsArchive from './pages/NewsArchive';
import NewsDetails from './pages/NewsDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news-company" element={<NewsArchive />} />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/news-company/:id" element={<NewsDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
