import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, ArrowRight, ArrowLeft, Sparkles, MapPin, 
  GraduationCap, Target, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSelector from '@/components/ui/LocationSelector';
import VehicleDomainCard from '@/components/ui/VehicleDomainCard';
import SkillLevelSelector from '@/components/ui/SkillLevelSelector';

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'location', title: 'Location' },
  { id: 'vehicle', title: 'Vehicle' },
  { id: 'skill', title: 'Skill Level' },
  { id: 'complete', title: 'Complete' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    location: { continent: '', country: '', state: '', city: '' },
    vehicleDomain: '',
    skillLevel: 'beginner'
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const createProgressMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProgress.create(data),
    onSuccess: () => {
      navigate(createPageUrl('VehicleSelection'));
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!formData.location.country) {
      alert('Please select your location');
      return;
    }
    if (!formData.vehicleDomain) {
      alert('Please select a vehicle domain');
      return;
    }
    if (!formData.skillLevel) {
      alert('Please select your skill level');
      return;
    }
    
    createProgressMutation.mutate({
      selected_continent: formData.location.continent,
      selected_country: formData.location.country,
      selected_state: formData.location.state,
      selected_city: formData.location.city,
      vehicle_domain: formData.vehicleDomain,
      skill_level: formData.skillLevel,
      current_phase: 1,
      completed_modules: [],
      certificates_earned: [],
      total_learning_hours: 0
    });
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome': return true;
      case 'location': return formData.location.country;
      case 'vehicle': return formData.vehicleDomain;
      case 'skill': return formData.skillLevel;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index < currentStep 
                  ? 'bg-sky-500 text-white' 
                  : index === currentStep 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-sky-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Welcome Step */}
            {steps[currentStep].id === 'welcome' && (
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-sky-200"
                >
                  <Car className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to <span className="gradient-text">VehicleLearn</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Your global guide to learning any vehicle — from cars to rockets, 
                  legally and safely.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  {[
                    { icon: MapPin, label: 'Location-aware rules' },
                    { icon: GraduationCap, label: 'Step-by-step learning' },
                    { icon: Target, label: 'Get certified' }
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <item.icon className="w-6 h-6 text-sky-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Let's set up your personalized learning path
                </p>
              </div>
            )}

            {/* Location Step */}
            {steps[currentStep].id === 'location' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Where are you located?
                  </h2>
                  <p className="text-gray-600">
                    We'll load the right laws and regulations for your region
                  </p>
                </div>
                
                <LocationSelector 
                  location={formData.location}
                  onChange={(location) => setFormData({ ...formData, location })}
                />
              </div>
            )}

            {/* Vehicle Step */}
            {steps[currentStep].id === 'vehicle' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What do you want to learn?
                  </h2>
                  <p className="text-gray-600">
                    Choose a vehicle domain to start
                  </p>
                </div>
                
                <div className="space-y-3">
                  {['land', 'air', 'water', 'underwater', 'space'].map((domain) => (
                    <VehicleDomainCard
                      key={domain}
                      domain={domain}
                      selected={formData.vehicleDomain === domain}
                      onClick={(d) => setFormData({ ...formData, vehicleDomain: d })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skill Level Step */}
            {steps[currentStep].id === 'skill' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What's your experience level?
                  </h2>
                  <p className="text-gray-600">
                    We'll adjust the content to match your skill
                  </p>
                </div>
                
                <SkillLevelSelector
                  selected={formData.skillLevel}
                  onChange={(level) => setFormData({ ...formData, skillLevel: level })}
                />
              </div>
            )}

            {/* Complete Step */}
            {steps[currentStep].id === 'complete' && (
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-200"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  You're all set!
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Your personalized learning path is ready. Let's select your specific vehicle type.
                </p>

                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm mb-8 max-w-sm mx-auto text-left">
                  <h3 className="font-medium text-gray-900 mb-3">Your Setup:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-gray-900">
                        {formData.location.state ? `${formData.location.state}, ` : ''}
                        {formData.location.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Domain:</span>
                      <span className="font-medium text-gray-900 capitalize">{formData.vehicleDomain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Skill Level:</span>
                      <span className="font-medium text-gray-900 capitalize">{formData.skillLevel}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleComplete}
                  disabled={createProgressMutation.isPending}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg px-8 py-6"
                >
                  {createProgressMutation.isPending ? 'Setting up...' : 'Choose Your Vehicle'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {steps[currentStep].id !== 'complete' && (
          <div className="flex justify-between mt-12">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}