'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [name, setName] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/celebration?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md w-full bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20"
      >
        <h1 className="text-4xl font-bold text-red-500 font-serif">🎄 Holiday Wishes</h1>
        <p className="text-gray-200">Who is this special greeting for?</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name..."
            className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg transform hover:scale-105"
          >
            Go to North Pole 🎅
          </button>
        </form>
      </motion.div>
    </div>
  );
}