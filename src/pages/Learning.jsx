import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ModuleViewer from '@/components/learning/ModuleViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, BookOpen, Monitor, Wrench, Trophy, 
  Play, Clock, CheckCircle2, Lock, ChevronRight,
  AlertTriangle, Lightbulb, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const phaseData = {
  1: {
    title: 'Legal Readiness',
    description: 'Required licenses, permits & legal documents',
    icon: FileText,
    color: 'from-emerald-500 to-green-600',
    modules: [
      { id: '1-1', title: 'License Requirements', duration: '15 min', type: 'theory' },
      { id: '1-2', title: 'Age & Health Conditions', duration: '10 min', type: 'theory' },
      { id: '1-3', title: 'Government Exams Overview', duration: '20 min', type: 'theory' },
      { id: '1-4', title: 'Documents Checklist', duration: '10 min', type: 'practical' },
      { id: '1-5', title: 'Legal Readiness Quiz', duration: '15 min', type: 'assessment' }
    ]
  },
  2: {
    title: 'Theory Training',
    description: 'How vehicles work, controls & safety rules',
    icon: BookOpen,
    color: 'from-sky-500 to-blue-600',
    modules: [
      { id: '2-1', title: 'Vehicle Components', duration: '25 min', type: 'theory' },
      { id: '2-2', title: 'Dashboard & Controls', duration: '20 min', type: 'theory' },
      { id: '2-3', title: 'Safety Systems', duration: '20 min', type: 'theory' },
      { id: '2-4', title: 'Traffic & Navigation Rules', duration: '30 min', type: 'theory' },
      { id: '2-5', title: 'Emergency Protocols', duration: '25 min', type: 'theory' },
      { id: '2-6', title: 'Theory Assessment', duration: '30 min', type: 'assessment' }
    ]
  },
  3: {
    title: 'Virtual Practice',
    description: 'AI simulators & scenario training',
    icon: Monitor,
    color: 'from-violet-500 to-purple-600',
    modules: [
      { id: '3-1', title: 'Basic Controls Simulation', duration: '30 min', type: 'simulation' },
      { id: '3-2', title: 'Real-Life Scenarios', duration: '45 min', type: 'simulation' },
      { id: '3-3', title: 'Hazard Perception', duration: '30 min', type: 'simulation' },
      { id: '3-4', title: 'Night & Weather Conditions', duration: '30 min', type: 'simulation' },
      { id: '3-5', title: 'Simulation Assessment', duration: '40 min', type: 'assessment' }
    ]
  },
  4: {
    title: 'Practical Training',
    description: 'Real-world handling & environment adaptation',
    icon: Wrench,
    color: 'from-orange-500 to-amber-600',
    modules: [
      { id: '4-1', title: 'Pre-Operation Checks', duration: '20 min', type: 'practical' },
      { id: '4-2', title: 'Basic Maneuvers', duration: '60 min', type: 'practical' },
      { id: '4-3', title: 'Environment Adaptation', duration: '45 min', type: 'practical' },
      { id: '4-4', title: 'Parking & Docking', duration: '30 min', type: 'practical' },
      { id: '4-5', title: 'Practical Skills Test', duration: '60 min', type: 'assessment' }
    ]
  },
  5: {
    title: 'Expert Level',
    description: 'Advanced maneuvers & mastery certification',
    icon: Trophy,
    color: 'from-rose-500 to-pink-600',
    modules: [
      { id: '5-1', title: 'Advanced Maneuvers', duration: '60 min', type: 'practical' },
      { id: '5-2', title: 'Automation & AI Assistance', duration: '45 min', type: 'theory' },
      { id: '5-3', title: 'Risk Management', duration: '30 min', type: 'theory' },
      { id: '5-4', title: 'Efficiency Optimization', duration: '30 min', type: 'practical' },
      { id: '5-5', title: 'Final Certification Exam', duration: '90 min', type: 'assessment' }
    ]
  }
};

const typeColors = {
  theory: 'bg-sky-100 text-sky-700',
  simulation: 'bg-violet-100 text-violet-700',
  practical: 'bg-orange-100 text-orange-700',
  assessment: 'bg-rose-100 text-rose-700'
};

export default function Learning() {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null);

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
  const completedModules = progress?.completed_modules || [];

  // Fetch all learning modules
  const { data: allModules = [] } = useQuery({
    queryKey: ['learningModules'],
    queryFn: () => base44.entities.LearningModule.list(),
    initialData: []
  });

  // Fetch module progress
  const { data: moduleProgressList = [] } = useQuery({
    queryKey: ['moduleProgress'],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.ModuleProgress.filter({ created_by: user.email });
    },
    enabled: !!user?.email,
    initialData: []
  });

  const phase = phaseData[selectedPhase];
  const Icon = phase.icon;

  // Get real modules for current phase
  const phaseModules = allModules.filter(m => m.phase === selectedPhase);
  const modulesToShow = phaseModules.length > 0 ? phaseModules : phase.modules;

  const isPhaseUnlocked = (p) => p <= currentPhase;
  const isModuleCompleted = (moduleId) => {
    const modProgress = moduleProgressList.find(mp => mp.module_id === moduleId);
    return modProgress?.status === 'completed';
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const handleContinueLearning = () => {
    // Find the next incomplete module
    const nextModule = modulesToShow.find(m => !isModuleCompleted(m.id));
    if (nextModule) {
      handleModuleClick(nextModule);
    } else {
      alert('All modules in this phase are complete! Great job!');
    }
  };

  // Check if phase is complete and advance
  useEffect(() => {
    const checkPhaseCompletion = async () => {
      if (!progress || !user) return;
      
      const phaseModules = allModules.filter(m => m.phase === currentPhase);
      if (phaseModules.length === 0) return;
      
      const allCompleted = phaseModules.every(m => isModuleCompleted(m.id));
      
      if (allCompleted && currentPhase < 5) {
        // Award certificate and advance phase
        const certs = progress.certificates_earned || [];
        const certId = `phase${currentPhase}`;
        
        if (!certs.includes(certId)) {
          await base44.entities.UserProgress.update(progress.id, {
            current_phase: currentPhase + 1,
            certificates_earned: [...certs, certId]
          });
          
          alert(`🎉 Congratulations! You've completed Phase ${currentPhase}!\n\nYou've earned the Phase ${currentPhase} Certificate and unlocked Phase ${currentPhase + 1}!`);
        }
      }
    };
    
    checkPhaseCompletion();
  }, [moduleProgressList, progress, currentPhase, allModules, user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
          <p className="text-gray-600">Complete each phase to become a certified operator</p>
        </div>

        {/* Phase Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {[1, 2, 3, 4, 5].map((p) => {
              const pData = phaseData[p];
              const PIcon = pData.icon;
              const isUnlocked = isPhaseUnlocked(p);
              const isActive = selectedPhase === p;
              
              return (
                <motion.button
                  key={p}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => isUnlocked && setSelectedPhase(p)}
                  disabled={!isUnlocked}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${
                    isActive 
                      ? 'border-sky-500 bg-white shadow-lg' 
                      : isUnlocked
                        ? 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? `bg-gradient-to-br ${pData.color} text-white shadow-lg` 
                      : isUnlocked
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isUnlocked ? <PIcon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Phase {p}</p>
                    <p className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {pData.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Phase Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Modules List */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.color} text-white p-6`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Phase {selectedPhase}: {phase.title}</h2>
                    <p className="text-white/80">{phase.description}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/80">Progress</span>
                    <span className="font-medium">
                      {modulesToShow.filter(m => isModuleCompleted(m.id)).length} / {modulesToShow.length} completed
                    </span>
                  </div>
                  <Progress 
                    value={(modulesToShow.filter(m => isModuleCompleted(m.id)).length / modulesToShow.length) * 100} 
                    className="h-2 bg-white/20"
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="p-6">
                <div className="space-y-3">
                  {modulesToShow.map((module, index) => {
                    const isCompleted = isModuleCompleted(module.id);
                    const isNext = !isCompleted && index === modulesToShow.findIndex(m => !isModuleCompleted(m.id));
                    
                    return (
                      <motion.button
                        key={module.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleModuleClick(module)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isNext
                            ? 'border-sky-400 bg-sky-50 shadow-md'
                            : isCompleted
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : isNext
                                ? 'bg-sky-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isNext ? (
                              <Play className="w-4 h-4 ml-0.5" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium ${isCompleted ? 'text-emerald-700' : 'text-gray-900'}`}>
                                {module.title}
                              </h3>
                              {isNext && (
                                <Badge className="bg-sky-500 text-white">Next</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                {module.duration}
                              </span>
                              <Badge variant="secondary" className={typeColors[module.type]}>
                                {module.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Learning Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Complete modules in order for best results
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Take notes during theory sessions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Practice simulations multiple times
                </li>
              </ul>
            </div>

            {/* Warning Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Safety First</h3>
              </div>
              <p className="text-sm text-gray-700">
                Never attempt real-world operation without completing all required phases and obtaining proper licenses.
              </p>
            </div>

            {/* Continue Button */}
            <Button 
              onClick={handleContinueLearning}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Module Viewer Modal */}
      {selectedModule && (
        <ModuleViewer
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          currentProgress={moduleProgressList.find(mp => mp.module_id === selectedModule.id)}
        />
      )}
    </div>
  );
}