import React from 'react';
import { motion } from 'framer-motion';
import { Car, Plane, Ship, Waves, Rocket } from 'lucide-react';

const domainIcons = {
  land: Car,
  air: Plane,
  water: Ship,
  underwater: Waves,
  space: Rocket
};

const domainColors = {
  land: 'from-amber-500 to-orange-600',
  air: 'from-sky-400 to-blue-600',
  water: 'from-cyan-400 to-teal-600',
  underwater: 'from-blue-600 to-indigo-800',
  space: 'from-purple-500 to-violet-700'
};

const domainLabels = {
  land: 'Land Vehicles',
  air: 'Air Vehicles',
  water: 'Water Vehicles',
  underwater: 'Underwater Vehicles',
  space: 'Space Vehicles'
};

const domainExamples = {
  land: 'Cars, Bikes, Trucks, Trains',
  air: 'Drones, Helicopters, Aircraft',
  water: 'Boats, Ships, Jet Skis',
  underwater: 'Submarines, ROVs',
  space: 'Rockets, Rovers, Satellites'
};

export default function VehicleDomainCard({ domain, selected, onClick }) {
  const Icon = domainIcons[domain];
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(domain)}
      className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group ${
        selected 
          ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-200/50' 
          : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domainColors[domain]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${domainColors[domain]} text-white shadow-lg`}>
          <Icon className="w-7 h-7" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {domainLabels[domain]}
          </h3>
          <p className="text-sm text-gray-500">
            {domainExamples[domain]}
          </p>
        </div>
        
        {selected && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}