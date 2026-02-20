import React from 'react';
import { motion } from 'framer-motion';
import { Car, Plane, Ship, Waves, Rocket, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

const purposeLabels = {
  personal: 'Personal Use',
  commercial: 'Commercial',
  industrial: 'Industrial',
  research: 'Research',
  defense: 'Defense',
  emergency: 'Emergency Services'
};

export default function VehicleInfoCard({ vehicleDomain, vehicleType, purpose, onEdit }) {
  const Icon = domainIcons[vehicleDomain] || Car;
  const color = domainColors[vehicleDomain] || domainColors.land;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {vehicleType || `${vehicleDomain} Vehicle`}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {vehicleDomain} Domain • {purposeLabels[purpose] || purpose}
            </p>
          </div>
        </div>
        
        <Link to={createPageUrl('VehicleSelection')}>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Domain</p>
          <p className="font-medium text-gray-900 capitalize">{vehicleDomain}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Purpose</p>
          <p className="font-medium text-gray-900">{purposeLabels[purpose] || purpose}</p>
        </div>
      </div>

      <Link to={createPageUrl('Learning')}>
        <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
          Continue Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}