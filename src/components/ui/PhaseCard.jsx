import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Monitor, Wrench, Trophy, Lock, CheckCircle2 } from 'lucide-react';

const phaseData = {
  1: {
    icon: FileText,
    title: 'Legal Readiness',
    description: 'Licenses, permits & documents',
    color: 'from-emerald-500 to-green-600'
  },
  2: {
    icon: BookOpen,
    title: 'Theory Training',
    description: 'How vehicles work & safety rules',
    color: 'from-sky-500 to-blue-600'
  },
  3: {
    icon: Monitor,
    title: 'Virtual Practice',
    description: 'AI simulators & scenarios',
    color: 'from-violet-500 to-purple-600'
  },
  4: {
    icon: Wrench,
    title: 'Practical Training',
    description: 'Real-world handling skills',
    color: 'from-orange-500 to-amber-600'
  },
  5: {
    icon: Trophy,
    title: 'Expert Level',
    description: 'Advanced maneuvers & mastery',
    color: 'from-rose-500 to-pink-600'
  }
};

export default function PhaseCard({ phase, status, progress, onClick }) {
  const { icon: Icon, title, description, color } = phaseData[phase];
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  
  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={() => !isLocked && onClick(phase)}
      disabled={isLocked}
      className={`relative w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
        isLocked 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
          : isCompleted
            ? 'border-emerald-300 bg-emerald-50 shadow-md'
            : isActive
              ? 'border-sky-400 bg-white shadow-lg shadow-sky-100'
              : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`relative p-3 rounded-xl bg-gradient-to-br ${isLocked ? 'from-gray-400 to-gray-500' : color} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
          {isLocked && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
          )}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Phase {phase}
            </span>
            {isActive && (
              <span className="px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                Current
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mt-0.5">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {description}
          </p>
        </div>
        
        {!isLocked && (
          <div className="text-right">
            <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-600' : 'text-gray-900'}`}>
              {progress}%
            </span>
          </div>
        )}
      </div>
      
      {!isLocked && progress > 0 && progress < 100 && (
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
          />
        </div>
      )}
    </motion.button>
  );
}