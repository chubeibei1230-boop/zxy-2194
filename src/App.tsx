import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainMenuPage } from './pages/MainMenuPage';
import { TutorialPage } from './pages/TutorialPage';
import { GamePage } from './pages/GamePage';
import { ResultPage } from './pages/ResultPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenuPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/game/:levelId" element={<GamePage />} />
        <Route path="/result/:levelId" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}
