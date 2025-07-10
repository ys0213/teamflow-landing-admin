import React from 'react';
import { useAuth } from '../context/AuthContext';

import Feature from '../components/FeatureSection';
import CTA from '../components/CTASection';
import Pricing from '../components/PricingSection';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>

        {user && (
          <p className="text-gray-700 mb-6">Logged in as: <span className="font-semibold">{user.email}</span></p>
        )}

        <Feature />
        <CTA />
        <Pricing />
      </main>
    </div>
  );
}
