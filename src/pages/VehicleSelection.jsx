import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Bike, Truck, Train, Bus, Plane, Rocket, Ship, Anchor,
  ArrowRight, ArrowLeft, Check, Briefcase, User, Factory, 
  Microscope, Shield, Ambulance
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const vehicleTypes = {
  land: [
    { id: 'car', name: 'Car', icon: Car, description: 'Sedan, SUV, Hatchback' },
    { id: 'motorcycle', name: 'Motorcycle', icon: Bike, description: 'Two-wheeled motor vehicle' },
    { id: 'truck', name: 'Truck', icon: Truck, description: 'Heavy goods vehicles' },
    { id: 'bus', name: 'Bus', icon: Bus, description: 'Passenger transport' },
    { id: 'train', name: 'Train', icon: Train, description: 'Railway vehicles' },
  ],
  air: [
    { id: 'drone', name: 'Drone', icon: Plane, description: 'UAVs and quadcopters' },
    { id: 'helicopter', name: 'Helicopter', icon: Plane, description: 'Rotary-wing aircraft' },
    { id: 'aircraft', name: 'Aircraft', icon: Plane, description: 'Fixed-wing planes' },
    { id: 'jet', name: 'Private Jet', icon: Plane, description: 'Business aviation' },
  ],
  water: [
    { id: 'boat', name: 'Boat', icon: Ship, description: 'Small watercraft' },
    { id: 'yacht', name: 'Yacht', icon: Ship, description: 'Luxury vessels' },
    { id: 'jetski', name: 'Jet Ski', icon: Anchor, description: 'Personal watercraft' },
    { id: 'ship', name: 'Ship', icon: Ship, description: 'Large vessels' },
  ],
  underwater: [
    { id: 'submarine', name: 'Submarine', icon: Anchor, description: 'Underwater vessels' },
    { id: 'rov', name: 'ROV', icon: Anchor, description: 'Remote operated vehicles' },
    { id: 'submersible', name: 'Submersible', icon: Anchor, description: 'Research vehicles' },
  ],
  space: [
    { id: 'rocket', name: 'Rocket', icon: Rocket, description: 'Launch vehicles' },
    { id: 'satellite', name: 'Satellite', icon: Rocket, description: 'Orbital systems' },
    { id: 'rover', name: 'Space Rover', icon: Car, description: 'Planetary exploration' },
    { id: 'shuttle', name: 'Space Shuttle', icon: Rocket, description: 'Reusable spacecraft' },
  ]
};

const purposes = [
  { id: 'personal', name: 'Personal Use', icon: User, description: 'Daily commute & leisure' },
  { id: 'commercial', name: 'Commercial', icon: Briefcase, description: 'Business & transport' },
  { id: 'industrial', name: 'Industrial', icon: Factory, description: 'Heavy machinery work' },
  { id: 'research', name: 'Research', icon: Microscope, description: 'Scientific exploration' },
  { id: 'defense', name: 'Defense', icon: Shield, description: 'Military applications' },
  { id: 'emergency', name: 'Emergency', icon: Ambulance, description: 'Rescue & medical' },
];

export default function VehicleSelection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');

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
  const domain = progress?.vehicle_domain || 'land';
  const vehicles = vehicleTypes[domain] || vehicleTypes.land;

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserProgress.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      navigate(createPageUrl('Home'));
    }
  });

  const handleComplete = () => {
    if (progress?.id && selectedType && selectedPurpose) {
      updateProgressMutation.mutate({
        id: progress.id,
        data: {
          vehicle_type: selectedType,
          purpose: selectedPurpose
        }
      });
    } else {
      alert('Please select both vehicle type and purpose');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Vehicle
          </h1>
          <p className="text-gray-600">
            Select the specific vehicle type you want to learn
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {['Vehicle Type', 'Purpose'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= step ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {index < step ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= step ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {label}
              </span>
              {index < 1 && <div className="w-16 h-0.5 mx-4 bg-gray-200" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Vehicle Type */}
          {step === 0 && (
            <motion.div
              key="vehicle-type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {vehicles.map((vehicle) => {
                  const Icon = vehicle.icon;
                  const isSelected = selectedType === vehicle.id;
                  
                  return (
                    <motion.button
                      key={vehicle.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(vehicle.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-100' 
                          : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-sky-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                          <p className="text-sm text-gray-500">{vehicle.description}</p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Purpose */}
          {step === 1 && (
            <motion.div
              key="purpose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {purposes.map((purpose) => {
                  const Icon = purpose.icon;
                  const isSelected = selectedPurpose === purpose.id;
                  
                  return (
                    <motion.button
                      key={purpose.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPurpose(purpose.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-100' 
                          : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-sky-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{purpose.name}</h3>
                          <p className="text-sm text-gray-500">{purpose.description}</p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <Button 
            variant="ghost" 
            onClick={() => step > 0 ? setStep(step - 1) : navigate(createPageUrl('Onboarding'))}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {step === 0 ? (
            <Button 
              onClick={() => setStep(1)}
              disabled={!selectedType}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!selectedPurpose || updateProgressMutation.isPending}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              {updateProgressMutation.isPending ? 'Saving...' : 'Start Learning'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}