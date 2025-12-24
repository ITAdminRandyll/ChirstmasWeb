'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const WISHES = [
  "May your holidays be painted in the softest whites and the warmest golds.",
  "Here’s to the blank page of the New Year—may you write your best chapter yet.",
  "Wishing you the peace of a silent night and the excitement of a bright morning.",
  "May you find a moment to press pause and simply soak in the magic around you.",
  "Hoping your season is wrapped in love and tied with a ribbon of hope.",
  "May your joy shine brighter than the North Star on a clear winter's night.",
  "Wishing you a heart light enough to float like a snowflake.",
  "May the melody of the holidays stay in your heart all year long.",
  "Sending you the kind of peace that settles like fresh snow: quiet and beautiful.",
  "May your dreams for the coming year be as big as the holiday spirit."
];

function CelebrationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "Friend";

  // States
  const [phase, setPhase] = useState<'countdown' | 'tree' | 'gift'>('countdown');
  const [currentWish, setCurrentWish] = useState('');
  
  // Refs
  // FIX: Explicitly type the video ref for TypeScript
  const treeVideoRef = useRef<HTMLVideoElement>(null);
  
  // FIX: Ref to prevent double speaking in React Strict Mode
  const hasSpokenRef = useRef(false);

  // Helper: Text to Speech
  // FIX: Added type for 'text'
  const speakWish = (text: string) => {
    if ('speechSynthesis' in window) {
      // Prevent multiple triggers
      if (hasSpokenRef.current) return;
      hasSpokenRef.current = true;

      // Cancel any ongoing speech immediately
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      let voices = window.speechSynthesis.getVoices();
      
      const selectVoice = () => {
        const maleVoice = voices.find(voice => 
          voice.name.includes('Google UK English Male') || // Usually a very good deep voice
          voice.name.includes('Daniel') || 
          voice.name.includes('David') ||  
          voice.name.includes('Google US English') // Fallback
        );

        if (maleVoice) utterance.voice = maleVoice;
        
        // --- VOICE TUNING ---
        // Rate: 0.8 (Slower, more thoughtful)
        // Pitch: 0.7 (Deeper, warmer tone)
        utterance.rate = 0.8; 
        utterance.pitch = 0.7; 
        
        window.speechSynthesis.speak(utterance);
      };

      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          selectVoice();
        };
      } else {
        selectVoice();
      }
    }
  };

  // --- PHASE 1: COUNTDOWN LOGIC ---
  useEffect(() => {
    if (phase === 'countdown') {
      const timer = setTimeout(() => {
        setPhase('tree');
      }, 25000); 

      return () => clearTimeout(timer);
    }
  }, [phase]);

  // --- PHASE 2 & 3: TREE & GIFT LOGIC ---
  useEffect(() => {
    if (phase === 'tree') {
      // 1. Ensure tree video plays
      if (treeVideoRef.current) {
        // FIX: Added type for error 'e'
        treeVideoRef.current.play().catch((e: any) => console.log("Autoplay blocked:", e));
      }

      // 2. Wait 8 seconds, then open gift
      const timer = setTimeout(() => {
        // Pause video
        if (treeVideoRef.current) treeVideoRef.current.pause();
        
        // Visuals
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        // Select Wish
        const selectedWish = WISHES[Math.floor(Math.random() * WISHES.length)];
        setCurrentWish(selectedWish);
        
        // Switch Phase
        setPhase('gift');

        // Audio: Speak the wish
        speakWish(selectedWish);

      }, 8000); 

      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      
      {/* Background Stardust */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>

      <AnimatePresence>
        
        {/* === PHASE 1: COUNTDOWN VIDEO === */}
        {phase === 'countdown' && (
          <motion.div
            key="countdown-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <video
              src="/countdown.mp4"
              autoPlay
              muted={false}
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* === PHASE 2 & 3: TREE VIDEO & GIFT REVEAL === */}
        {(phase === 'tree' || phase === 'gift') && (
          <motion.div
            key="tree-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <video
              ref={treeVideoRef}
              src="/ChirstmasTree.mp4"
              muted={false} 
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Gift Overlay */}
            <AnimatePresence>
              {phase === 'gift' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30 p-4"
                >
                  <div className="bg-white/95 text-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-400 mx-4 flex flex-col items-center relative">
                    
                    <h1 className="text-4xl md:text-6xl font-serif text-red-600 mb-8 font-bold drop-shadow-sm text-center">
                      Merry Christmas, {name}!
                    </h1>
                    
                    <div className="w-24 h-1.5 bg-green-600 mx-auto mb-8 rounded-full"></div>
                    
                    <p className="text-2xl md:text-3xl italic font-serif leading-relaxed text-slate-700 text-center">
                      "{currentWish}"
                    </p>
                    
                    {/* Signature Lower Right */}
                    <div className="w-full flex justify-end mt-10">
                      <p className="text-xl md:text-2xl font-bold text-slate-600 font-serif italic pr-2">
                        - Janidu
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CelebrationPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading Magic...</div>}>
      <CelebrationContent />
    </Suspense>
  );
}