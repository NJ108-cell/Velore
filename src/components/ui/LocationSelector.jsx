import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Globe, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const continents = [
  { id: 'africa', name: 'Africa', emoji: '🌍' },
  { id: 'asia', name: 'Asia', emoji: '🌏' },
  { id: 'europe', name: 'Europe', emoji: '🌍' },
  { id: 'north_america', name: 'North America', emoji: '🌎' },
  { id: 'south_america', name: 'South America', emoji: '🌎' },
  { id: 'oceania', name: 'Oceania', emoji: '🌏' }
];

const countriesByContinent = {
  africa: ['Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Ghana', 'Tanzania'],
  asia: ['India', 'China', 'Japan', 'South Korea', 'UAE', 'Saudi Arabia', 'Singapore', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines', 'Pakistan', 'Bangladesh'],
  europe: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Poland', 'Switzerland'],
  north_america: ['United States', 'Canada', 'Mexico'],
  south_america: ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'],
  oceania: ['Australia', 'New Zealand']
};

const statesByCountry = {
  'United States': ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'Michigan', 'Arizona'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Delhi', 'West Bengal', 'Telangana', 'Rajasthan', 'Kerala', 'Uttar Pradesh'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Germany': ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'North Rhine-Westphalia']
};

export default function LocationSelector({ location, onChange }) {
  const [step, setStep] = useState(location.continent ? (location.country ? (location.state ? 3 : 2) : 1) : 0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleContinentSelect = (continent) => {
    onChange({ ...location, continent, country: '', state: '', city: '' });
    setStep(1);
  };
  
  const handleCountrySelect = (country) => {
    onChange({ ...location, country, state: '', city: '' });
    setStep(2);
  };
  
  const handleStateSelect = (state) => {
    onChange({ ...location, state, city: '' });
    setStep(3);
  };
  
  const countries = location.continent ? countriesByContinent[location.continent] || [] : [];
  const states = location.country ? statesByCountry[location.country] || [] : [];
  
  const filteredCountries = countries.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredStates = states.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Continent Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Globe className="w-4 h-4 text-sky-500" />
          Select Your Continent
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {continents.map((continent) => (
            <motion.button
              key={continent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContinentSelect(continent.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                location.continent === continent.id
                  ? 'border-sky-500 bg-sky-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-sky-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{continent.emoji}</span>
              <span className="font-medium text-gray-900">{continent.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Country Selection */}
      <AnimatePresence>
        {location.continent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-sky-500" />
              Select Your Country
            </label>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filteredCountries.map((country) => (
                <motion.button
                  key={country}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleCountrySelect(country);
                    setSearchTerm('');
                  }}
                  className={`p-3 rounded-lg border text-left text-sm transition-all flex items-center justify-between ${
                    location.country === country
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-sky-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{country}</span>
                  {location.country === country && (
                    <Check className="w-4 h-4 text-sky-500" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* State Selection */}
      <AnimatePresence>
        {location.country && states.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-sky-500" />
              Select Your State / Province
            </label>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filteredStates.map((state) => (
                <motion.button
                  key={state}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleStateSelect(state);
                    setSearchTerm('');
                  }}
                  className={`p-3 rounded-lg border text-left text-sm transition-all flex items-center justify-between ${
                    location.state === state
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-sky-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{state}</span>
                  {location.state === state && (
                    <Check className="w-4 h-4 text-sky-500" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Summary */}
      {location.country && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200"
        >
          <div className="flex items-center gap-2 text-sky-700">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">
              {[location.state, location.country].filter(Boolean).join(', ')}
            </span>
          </div>
          <p className="text-sm text-sky-600 mt-1">
            Regulations will be loaded for this location
          </p>
        </motion.div>
      )}
    </div>
  );
}