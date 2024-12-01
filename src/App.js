import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import ContestDetails from './pages/ContestDetails';
import Contests from './pages/Contests';

const App = () => {
  return (
    <Router>
      <AppProvider i18n={enTranslations}>
        <Routes>
          <Route path="/" element={<Contests />} />
          <Route path="/contest/:contestId" element={<ContestDetails />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;