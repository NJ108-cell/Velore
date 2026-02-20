import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, Clock } from 'lucide-react';

export default function QuickStats({ progress, moduleProgressList = [] }) {
  // Calculate streak (simplified - would need date tracking in real app)
  const currentStreak = 7; // Mock data
  
  // Calculate modules this week
  const modulesThisWeek = moduleProgressList.filter(mp => {
    if (!mp.completed_at) return false;
    const completedDate = new Date(mp.completed_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate >= weekAgo;
  }).length;
  
  // Calculate total completed modules
  const totalCompleted = moduleProgressList.filter(mp => mp.status === 'completed').length;
  
  // Calculate average score (mock for now)
  const avgScore = 85;

  const stats = [
    {
      icon: Flame,
      label: 'Day Streak',
      value: currentStreak,
      trend: '+2 from last week',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Target,
      label: 'Modules Done',
      value: totalCompleted,
      trend: `${modulesThisWeek} this week`,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: TrendingUp,
      label: 'Avg Score',
      value: `${avgScore}%`,
      trend: '+5% improvement',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50'
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: Math.round(progress?.total_learning_hours || 0),
      trend: 'Keep it up!',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50'
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
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.trend}</p>
          </motion.div>
        );
      })}
    </div>
  );
}