import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Award, MessageCircle, 
  FileText, Target, Sparkles, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import VehicleInfoCard from '@/components/dashboard/VehicleInfoCard';
import RegulationAlert from '@/components/dashboard/RegulationAlert';
import PhaseCard from '@/components/ui/PhaseCard';
import QuickStats from '@/components/dashboard/QuickStats';

export default function Home() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progressList, isLoading: progressLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: () => base44.entities.UserProgress.filter({ created_by: user?.email }),
    enabled: !!user?.email,
    initialData: [],
  });

  const progress = progressList?.[0];
  const isLoading = userLoading || progressLoading;

  // Redirect to onboarding if no progress exists
  useEffect(() => {
    if (!isLoading && !progress && user) {
      navigate(createPageUrl('Onboarding'));
    }
  }, [isLoading, progress, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!progress) {
    return null; // Will redirect to onboarding
  }

  const location = {
    continent: progress.selected_continent,
    country: progress.selected_country,
    state: progress.selected_state,
    city: progress.selected_city
  };

  // Fetch module progress for accurate phase progress
  const { data: moduleProgressList = [] } = useQuery({
    queryKey: ['moduleProgress'],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.ModuleProgress.filter({ created_by: user.email });
    },
    enabled: !!user?.email,
    initialData: []
  });

  const { data: allModules = [] } = useQuery({
    queryKey: ['learningModules'],
    queryFn: () => base44.entities.LearningModule.list(),
    initialData: []
  });

  const getPhaseStatus = (phase) => {
    const currentPhase = progress.current_phase || 1;
    if (phase < currentPhase) return 'completed';
    if (phase === currentPhase) return 'active';
    return 'locked';
  };

  const getPhaseProgress = (phase) => {
    const currentPhase = progress.current_phase || 1;
    if (phase < currentPhase) return 100;
    if (phase > currentPhase) return 0;
    
    // Calculate real progress for current phase
    const phaseModules = allModules.filter(m => m.phase === phase);
    if (phaseModules.length === 0) return 0;
    
    const completedCount = phaseModules.filter(m => {
      const modProgress = moduleProgressList.find(mp => mp.module_id === m.id);
      return modProgress?.status === 'completed';
    }).length;
    
    return Math.round((completedCount / phaseModules.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-sm font-medium text-sky-100">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}!
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Continue Your Learning Journey
            </h1>
            <p className="text-sky-100 text-lg max-w-2xl">
              You're on your way to mastering {progress.vehicle_type || progress.vehicle_domain} vehicle operation.
              Keep going!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <QuickStats progress={progress} moduleProgressList={moduleProgressList} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Phases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Learning Path</h2>
                  <p className="text-sm text-gray-500">Complete each phase to advance</p>
                </div>
                <Link to={createPageUrl('Learning')}>
                  <Button variant="ghost" size="sm" className="text-sky-600">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((phase) => (
                  <PhaseCard
                    key={phase}
                    phase={phase}
                    status={getPhaseStatus(phase)}
                    progress={getPhaseProgress(phase)}
                    onClick={() => navigate(createPageUrl('Learning'))}
                  />
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-3 gap-4"
            >
              {[
                { 
                  icon: BookOpen, 
                  label: 'Continue Learning', 
                  desc: 'Resume your course',
                  page: 'Learning',
                  color: 'from-sky-500 to-blue-600'
                },
                { 
                  icon: MessageCircle, 
                  label: 'AI Assistant', 
                  desc: 'Get instant help',
                  page: 'AIAssistant',
                  color: 'from-violet-500 to-purple-600'
                },
                { 
                  icon: Award, 
                  label: 'Certifications', 
                  desc: 'View your progress',
                  page: 'Certifications',
                  color: 'from-amber-500 to-orange-600'
                }
              ].map((action) => (
                <Link key={action.page} to={createPageUrl(action.page)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{action.label}</h3>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <VehicleInfoCard
              vehicleDomain={progress.vehicle_domain}
              vehicleType={progress.vehicle_type}
              purpose={progress.purpose}
            />

            {/* Regulations */}
            <RegulationAlert
              location={location}
              vehicleDomain={progress.vehicle_domain}
              vehicleType={progress.vehicle_type}
            />
          </div>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-12" />
    </div>
  );
}