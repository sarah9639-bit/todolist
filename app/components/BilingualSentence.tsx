'use client';

import { useState } from 'react';

export default function BilingualSentence() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = async () => {
    setLoading(true);
    setResult('');
    const res = await fetch('/api/bilingual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Please provide a bilingual sentence.' }),
    });
    const data = await res.json();
    setResult(data.content);
    setLoading(false);
  };

  const formatResult = (text: string) => {
    const [english, korean] = text.split('Korean:');
    return {
      english: english.replace('English:', '').trim(),
      korean: korean ? korean.trim() : '',
    };
  };

  const { english, korean } = result ? formatResult(result) : { english: '', korean: '' };

  const handleClose = () => {
    setIsVisible(false);
    // Clear result when closing
    setResult('');
  };

  if (!isVisible) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 transition-colors duration-300 mx-auto mt-16">
        <button
          onClick={() => setIsVisible(true)}
          className="rounded-full px-5 py-2 text-base font-semibold bg-blue-600 text-white hover:brightness-95 focus:ring-2 focus:ring-blue-400 transition-all w-full"
        >
          영한 번역 학습 열기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 transition-colors duration-300 mt-16">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold font-sans text-gray-900 flex items-center gap-2">📘 영한 번역 학습</h2>
      </div>
      
      <button
        onClick={handleClick}
        className="w-full rounded-full px-5 py-2 text-base font-semibold bg-blue-600 text-white hover:brightness-95 focus:ring-2 focus:ring-blue-400 transition-all"
        disabled={loading}
      >
        {loading ? 'Generating...' : '문장 생성하기'}
      </button>
      
      {result && (
        <div className="mt-6 space-y-4">
          <div className="w-full space-y-2">
            <h3 className="text-sm font-medium text-gray-600">English</h3>
            <div className="bg-slate-50 p-4 rounded-xl shadow-md w-full">
              <p className="text-gray-800">{english}</p>
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Korean</h3>
            <div className="bg-slate-50 p-4 rounded-xl shadow-md w-full">
              <p className="text-gray-800">{korean}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClose}
          className="rounded-full px-5 py-2 text-base font-semibold bg-slate-100 text-gray-700 hover:bg-slate-200 transition-all focus:ring-2 focus:ring-blue-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
} 