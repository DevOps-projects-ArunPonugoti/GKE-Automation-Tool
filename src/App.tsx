import React from 'react';
import { Cloud } from 'lucide-react';
import { InfraForm } from './components/InfraForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Cloud className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            GCP Infrastructure Deployment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Deploy your infrastructure to Google Cloud Platform with ease
          </p>
        </div>
        
        <div className="mt-10 flex justify-center">
          <InfraForm />
        </div>
      </div>
    </div>
  );
}

export default App;