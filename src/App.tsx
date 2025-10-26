import { Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
