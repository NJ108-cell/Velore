import React from 'react';
import { motion } from 'framer-motion';
import { Car, Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-xl"
        >
          <Car className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Please wait...</span>
        </div>
      </motion.div>
    </div>
  );
}