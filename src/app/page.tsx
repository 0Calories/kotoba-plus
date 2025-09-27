'use client';

import { useState } from 'react';
import type { KotobaResponseData } from './types';

export default function Home() {
  const [word, setWord] = useState('');
  const [analysis, setAnalysis] = useState<KotobaResponseData | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word.trim() }),
      });

      const data = (await response.json()) as KotobaResponseData;
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KotobaPlus</h1>
          <p className="text-gray-600">Discover the context and nuance behind Japanese words</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a Japanese word..."
              className="flex-1 px-4 py-3 text-lg text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>

        {analysis && (
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{analysis.term}</h2>
                <span className="text-lg text-gray-600">{analysis.reading}</span>
              </div>
            </div>

            {/* Overall Usage Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
                Overall Usage
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Frequency</p>
                  <p className="text-lg text-gray-900 capitalize">
                    {analysis.overall_usage.frequency.replace('_', ' ')}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Usage Type</p>
                  <p className="text-lg text-gray-900 capitalize">
                    {analysis.overall_usage.spoken_vs_written.replace('_', ' ')}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Demographics</p>
                  <p className="text-lg text-gray-900">
                    {analysis.overall_usage.age_demographics
                      .map((demo) => demo.replace('_', ' '))
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Definitions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-green-500 pl-3">
                Definitions
              </h3>
              {analysis.definitions.map((def, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {def.part_of_speech.replace('_', ' ')}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      {def.formality_level.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-900 font-medium">{def.definition_text}</p>

                  {def.usage_contexts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Common contexts:</p>
                      <div className="flex flex-wrap gap-1">
                        {def.usage_contexts.map((context, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {context.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {def.appropriateness_notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Usage note:</span> {def.appropriateness_notes}
                      </p>
                    </div>
                  )}

                  {def.example_sentences.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Examples:</p>
                      <div className="space-y-2">
                        {def.example_sentences.map((example, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-900 mb-1">{example.japanese}</p>
                            <p className="text-gray-600 text-sm italic">{example.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Learner Warnings Section */}
            {analysis.learner_warnings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-red-500 pl-3">
                  Important Notes
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analysis.learner_warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠️</span>
                        <span className="text-red-800 text-sm">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
