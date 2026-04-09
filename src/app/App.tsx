import { useState } from 'react';
import { CMSPackageSetupModal } from './components/CMSPackageSetupModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-brand-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CMS Package Setup
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Enterprise-grade package configuration with a modern UX-first workflow
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Open Package Setup Modal
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-brand-500 mb-2">3-Panel Workflow</div>
              <div className="text-sm text-gray-600">Browse features, configure settings, and review pricing in a streamlined layout</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-brand-500 mb-2">Reduced Cognitive Load</div>
              <div className="text-sm text-gray-600">Focus on one feature at a time with a dedicated configuration workspace</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-brand-500 mb-2">Real-time Pricing</div>
              <div className="text-sm text-gray-600">Live calculation of discounts, quantities, and total package cost</div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CMSPackageSetupModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
