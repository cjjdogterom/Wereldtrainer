import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DatasetProvider } from './data/DatasetContext';
import { getDataset } from './data/datasets';
import Layout from './components/Layout';
import TrainerPicker from './pages/TrainerPicker';
import Home from './pages/Home';
import Overview from './pages/Overview';
import QuizPage from './pages/QuizPage';
import Stats from './pages/Stats';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Learn from './pages/Learn';
import './styles/base.css';
import './styles/App.css';

// De hele voetbal-app hangt onder /voetbal in de leerapp.
export const VOETBAL_BASE = '/voetbal';

function DatasetApp() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const dataset = getDataset(datasetId);

  if (!dataset) {
    return <Navigate to={VOETBAL_BASE} replace />;
  }

  return (
    <DatasetProvider dataset={dataset}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="overzicht" element={<Overview />} />
          <Route path="overhoren" element={<QuizPage />} />
          <Route path="leren" element={<Learn />} />
          <Route path="statistieken" element={<Stats />} />
          <Route path="winnaars" element={<Clubs />} />
          <Route path="winnaars/:slug" element={<ClubDetail />} />
          <Route path="*" element={<Navigate to={`${VOETBAL_BASE}/${dataset.id}`} replace />} />
        </Routes>
      </Layout>
    </DatasetProvider>
  );
}

export default function VoetbalApp() {
  return (
    <div className="voetbal-app">
      <Routes>
        <Route path="/" element={<TrainerPicker />} />
        <Route path=":datasetId/*" element={<DatasetApp />} />
        <Route path="*" element={<Navigate to={VOETBAL_BASE} replace />} />
      </Routes>
    </div>
  );
}
