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

  const [phase, setPhase] = useState<'countdown' | 'tree' | 'gift'>('countdown');
  const [currentWish, setCurrentWish] = useState('');
  
  const treeVideoRef = useRef<HTMLVideoElement>(null);
  const hasSpokenRef = useRef(false);

  const speakWish = (text: string) => {
    if ('speechSynthesis' in window) {
      if (hasSpokenRef.current) return;
      hasSpokenRef.current = true;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      let voices = window.speechSynthesis.getVoices();
      
      const selectVoice = () => {
        const maleVoice = voices.find(voice => 
          voice.name.includes('Google UK English Male') || 
          voice.name.includes('Daniel') || 
          voice.name.includes('David') ||  
          voice.name.includes('Google US English')
        );

        if (maleVoice) utterance.voice = maleVoice;
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

  useEffect(() => {
    if (phase === 'countdown') {
      const timer = setTimeout(() => {
        setPhase('tree');
      }, 25000); 
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'tree') {
      if (treeVideoRef.current) {
        treeVideoRef.current.play().catch((e: any) => console.log("Autoplay blocked:", e));
      }

      const timer = setTimeout(() => {
        if (treeVideoRef.current) treeVideoRef.current.pause();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        const selectedWish = WISHES[Math.floor(Math.random() * WISHES.length)];
        setCurrentWish(selectedWish);
        setPhase('gift');
        speakWish(selectedWish);
      }, 8000); 

      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>

      <AnimatePresence>
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

            <AnimatePresence>
              {phase === 'gift' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-30 p-4 md:p-8"
                >
                  {/* Card Container: Optimized for mobile heights and widths */}
                  <div className="bg-white/95 text-slate-800 p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-400 flex flex-col items-center relative max-h-[90vh] overflow-y-auto">
                    
                    {/* Responsive Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-red-600 mb-4 md:mb-8 font-bold drop-shadow-sm text-center break-words w-full">
                      Merry Christmas, <span className="block sm:inline">{name}!</span>
                    </h1>
                    
                    <div className="w-16 md:w-24 h-1 md:h-1.5 bg-green-600 mx-auto mb-6 md:mb-8 rounded-full shrink-0"></div>
                    
                    {/* Responsive Wish Text */}
                    <p className="text-xl sm:text-2xl md:text-3xl italic font-serif leading-relaxed text-slate-700 text-center">
                      "{currentWish}"
                    </p>
                    
                    <div className="w-full flex justify-end mt-6 md:mt-10">
                      <p className="text-lg md:text-2xl font-bold text-slate-600 font-serif italic pr-2">
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