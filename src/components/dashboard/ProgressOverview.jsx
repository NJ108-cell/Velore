import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Award, Target } from 'lucide-react';

export default function ProgressOverview({ progress }) {
  const stats = [
    {
      icon: Target,
      label: 'Current Phase',
      value: `Phase ${progress?.current_phase || 1}`,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50'
    },
    {
      icon: Award,
      label: 'Modules Done',
      value: progress?.completed_modules?.length || 0,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: `${progress?.total_learning_hours || 0}h`,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50'
    },
    {
      icon: TrendingUp,
      label: 'Certificates',
      value: progress?.certificates_earned?.length || 0,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl ${stat.bgColor} border border-gray-100`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}