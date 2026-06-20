import { useNavigate } from 'react-router-dom';
import { TutorialContent } from '../components/Tutorial/TutorialContent';

export const TutorialPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-4">
      <TutorialContent onClose={() => navigate('/')} />
    </div>
  );
};
