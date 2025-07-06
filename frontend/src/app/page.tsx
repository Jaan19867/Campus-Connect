'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ENDPOINTS, NAME, DESCRIPTION } from '@/constants';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [backendMessage, setBackendMessage] = useState<string>('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.get<{ message: string }>(ENDPOINTS.HEALTH);
        setBackendStatus('✅ Connected');
        setBackendMessage(response.message);
      } catch (error) {
        setBackendStatus('❌ Disconnected');
        setBackendMessage('Make sure the backend is running on port 3006');
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {NAME}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {DESCRIPTION}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Frontend Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white dark:text-black font-bold text-xl">N</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Frontend
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Next.js 15</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✅ Next.js 15 (Latest)</li>
                <li>✅ React 19</li>
                <li>✅ TypeScript</li>
                <li>✅ Tailwind CSS</li>
                <li>✅ Server Components</li>
              </ul>
            </div>

            {/* Backend Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Backend
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">NestJS</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✅ NestJS Framework</li>
                <li>✅ TypeScript</li>
                <li>✅ Express.js</li>
                <li>✅ CORS Enabled</li>
                <li className="flex items-center">
                  <span className="mr-2">Status:</span>
                  <span className="font-semibold">{backendStatus}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Backend Connection Test
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Status:</strong> {backendStatus}
              </p>
              {backendMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Message:</strong> {backendMessage}
                </p>
              )}
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Getting Started
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">
                  1
                </span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Install dependencies
                  </p>
                  <code className="block mt-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 p-2 rounded text-xs">
                    npm run install:all
                  </code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">
                  2
                </span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Start development servers
                  </p>
                  <code className="block mt-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 p-2 rounded text-xs">
                    npm run dev
                  </code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">
                  3
                </span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Access your applications
                  </p>
                  <p className="text-blue-700 dark:text-blue-200 text-xs mt-1">
                    Frontend: http://localhost:3000 | Backend: http://localhost:3001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
