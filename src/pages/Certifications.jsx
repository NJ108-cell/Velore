import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Award, Trophy, Star, Lock, CheckCircle2, Clock,
  Download, Share2, Medal, Target, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const certifications = [
  {
    id: 'phase1',
    title: 'Legal Ready',
    description: 'Completed all legal requirements training',
    phase: 1,
    icon: '📜',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'phase2',
    title: 'Theory Expert',
    description: 'Mastered vehicle theory and safety rules',
    phase: 2,
    icon: '📚',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'phase3',
    title: 'Simulation Pro',
    description: 'Completed all virtual training scenarios',
    phase: 3,
    icon: '🎮',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'phase4',
    title: 'Skilled Operator',
    description: 'Demonstrated practical handling skills',
    phase: 4,
    icon: '🔧',
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'phase5',
    title: 'Master Operator',
    description: 'Achieved expert-level certification',
    phase: 5,
    icon: '🏆',
    color: 'from-rose-500 to-pink-600'
  }
];

const badges = [
  { id: 'first_lesson', title: 'First Steps', description: 'Completed first lesson', icon: '🎯', earned: true },
  { id: 'week_streak', title: '7-Day Streak', description: 'Learned 7 days in a row', icon: '🔥', earned: true },
  { id: 'perfect_quiz', title: 'Perfect Score', description: 'Scored 100% on a quiz', icon: '⭐', earned: false },
  { id: 'fast_learner', title: 'Fast Learner', description: 'Completed 5 modules in one day', icon: '⚡', earned: false },
  { id: 'safety_first', title: 'Safety Champion', description: 'Passed all safety modules', icon: '🛡️', earned: false },
  { id: 'helper', title: 'Community Helper', description: 'Helped 10 other learners', icon: '🤝', earned: false },
];

export default function Certifications() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progressList } = useQuery({
    queryKey: ['userProgress'],
    queryFn: () => base44.entities.UserProgress.filter({ created_by: user?.email }),
    enabled: !!user?.email,
    initialData: [],
  });

  const progress = progressList?.[0];
  const currentPhase = progress?.current_phase || 1;
  const earnedCerts = progress?.certificates_earned || [];

  const isCertEarned = (cert) => {
    const certId = `phase${cert.phase}`;
    return earnedCerts.includes(certId);
  };
  const isCertInProgress = (cert) => cert.phase === currentPhase;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certifications & Badges</h1>
          <p className="text-gray-600">Track your achievements and earn recognition</p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Trophy, label: 'Certifications', value: certifications.filter(c => isCertEarned(c)).length, total: 5, color: 'from-amber-500 to-orange-600' },
            { icon: Medal, label: 'Badges Earned', value: badges.filter(b => b.earned).length, total: badges.length, color: 'from-violet-500 to-purple-600' },
            { icon: Target, label: 'Overall Progress', value: `${Math.round((currentPhase / 5) * 100)}%`, isPercent: true, color: 'from-sky-500 to-blue-600' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {!stat.isPercent && (
                  <span className="text-sm text-gray-500">{stat.value}/{stat.total}</span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Phase Certifications
          </h2>
          
          <div className="grid gap-4">
            {certifications.map((cert, index) => {
              const earned = isCertEarned(cert);
              const inProgress = isCertInProgress(cert);
              
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    earned 
                      ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50' 
                      : inProgress
                        ? 'border-sky-200 bg-white shadow-lg'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                      earned 
                        ? `bg-gradient-to-br ${cert.color} shadow-lg` 
                        : 'bg-gray-200'
                    }`}>
                      {earned ? cert.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                        {earned && (
                          <Badge className="bg-emerald-500 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        )}
                        {inProgress && (
                          <Badge variant="outline" className="border-sky-400 text-sky-600">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{cert.description}</p>
                      
                      {inProgress && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">35%</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    {earned && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Downloading certificate: ${cert.title}\n\nIn the real app, this would download a PDF certificate.`);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Share ${cert.title} on social media!\n\nIn the real app, this would open share options for LinkedIn, Twitter, etc.`);
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Achievement Badges
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 rounded-2xl border-2 text-center ${
                  badge.earned 
                    ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50' 
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl ${
                  badge.earned ? 'bg-white shadow-lg' : 'bg-gray-200'
                }`}>
                  {badge.earned ? badge.icon : '🔒'}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-12" />
    </div>
  );
}