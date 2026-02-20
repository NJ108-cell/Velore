import React from 'react';
import { motion } from 'framer-motion';
import { Baby, User, GraduationCap } from 'lucide-react';

const levels = [
  {
    id: 'beginner',
    icon: Baby,
    title: 'Beginner',
    subtitle: 'No prior knowledge',
    description: 'Simple language, step-by-step guidance, lots of visuals',
    color: 'from-emerald-500 to-green-600',
    features: ['Simple language', 'Visual guides', 'Voice assistance', 'Extra support']
  },
  {
    id: 'intermediate',
    icon: User,
    title: 'Intermediate',
    subtitle: 'Some experience',
    description: 'Technical explanations with practical focus',
    color: 'from-sky-500 to-blue-600',
    features: ['Technical details', 'Advanced tips', 'Faster pace', 'Self-guided options']
  },
  {
    id: 'expert',
    icon: GraduationCap,
    title: 'Expert',
    subtitle: 'Extensive experience',
    description: 'Engineering-level details and advanced techniques',
    color: 'from-violet-500 to-purple-600',
    features: ['Engineering specs', 'System-level info', 'Advanced maneuvers', 'Optimization tips']
  }
];

export default function SkillLevelSelector({ selected, onChange }) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <GraduationCap className="w-4 h-4 text-sky-500" />
        What's Your Skill Level?
      </label>
      
      <div className="grid gap-4">
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selected === level.id;
          
          return (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(level.id)}
              className={`relative w-full p-5 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                isSelected
                  ? 'border-sky-500 bg-white shadow-lg shadow-sky-100'
                  : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${level.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color} text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {level.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      — {level.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {level.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {level.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}