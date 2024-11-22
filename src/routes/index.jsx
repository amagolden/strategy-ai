import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../Features';
import StrategyPlan from '../StrategyPlan';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Features />} />
        <Route path="/product" element={<StrategyPlan />} />
    </Routes>
  );
};

export default AppRoutes;
