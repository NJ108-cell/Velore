import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegulationAlert({ location, vehicleDomain, vehicleType }) {
  // This would normally fetch real regulations based on location
  const regulations = getRegulationsForLocation(location, vehicleDomain, vehicleType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Local Regulations
          </h3>
          <p className="text-sm text-gray-600">
            Rules for {location?.state || location?.country || 'your location'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {regulations.map((reg, index) => (
          <div 
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              reg.type === 'warning' 
                ? 'bg-amber-50 border border-amber-200' 
                : reg.type === 'requirement'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-200'
            }`}
          >
            {reg.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : (
              <FileText className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm">{reg.title}</p>
              <p className="text-xs text-gray-600 mt-0.5">{reg.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full border-sky-300 text-sky-700 hover:bg-sky-100"
        onClick={() => {
          const country = location?.country || 'your country';
          alert(`Full regulations for ${country} would be displayed here.\n\nIn the real app, this would show:\n- Complete vehicle laws\n- License requirements\n- Safety standards\n- Local restrictions`);
        }}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Full Regulations
      </Button>
    </motion.div>
  );
}

function getRegulationsForLocation(location, domain, vehicleType) {
  // Sample regulations - in real app, this would be fetched from database
  const baseRegs = [
    {
      type: 'requirement',
      title: 'Valid License Required',
      description: `You need a valid license to operate ${vehicleType || domain} vehicles in ${location?.country || 'this region'}.`
    },
    {
      type: 'info',
      title: 'Age Requirement',
      description: 'Minimum age varies by vehicle type. Check Phase 1 for details.'
    }
  ];

  if (domain === 'air') {
    baseRegs.push({
      type: 'warning',
      title: 'Airspace Restrictions',
      description: 'Flying near airports, military zones, or above certain altitudes is prohibited.'
    });
  }

  if (domain === 'water') {
    baseRegs.push({
      type: 'requirement',
      title: 'Maritime License',
      description: 'Boat operators must have appropriate maritime certification.'
    });
  }

  return baseRegs;
}