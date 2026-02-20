import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  User, Mail, MapPin, Car, GraduationCap, Save, 
  Edit2, Camera, Award, Clock, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

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

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  });

  const handleSave = () => {
    if (!formData.full_name || formData.full_name.trim().length === 0) {
      alert('Please enter your full name');
      return;
    }
    updateUserMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.full_name?.[0] || 'U'}
                    </div>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg"
                      onClick={() => alert('Photo upload coming soon!')}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user?.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role || 'user'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{progress?.current_phase || 1}</p>
                      <p className="text-xs text-gray-500">Phase</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{progress?.total_learning_hours || 0}</p>
                      <p className="text-xs text-gray-500">Hours</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{progress?.certificates_earned?.length || 0}</p>
                      <p className="text-xs text-gray-500">Certs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.full_name ?? user?.full_name ?? ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user?.full_name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <Label>Email Address</Label>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user?.email}
                  </p>
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Learning Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Learning Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                    <p className="font-medium text-gray-900">
                      {progress?.selected_state ? `${progress.selected_state}, ` : ''}
                      {progress?.selected_country || 'Not set'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Car className="w-4 h-4" />
                      Vehicle Type
                    </div>
                    <p className="font-medium text-gray-900 capitalize">
                      {progress?.vehicle_type || progress?.vehicle_domain || 'Not set'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Target className="w-4 h-4" />
                      Skill Level
                    </div>
                    <p className="font-medium text-gray-900 capitalize">
                      {progress?.skill_level || 'Not set'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Award className="w-4 h-4" />
                      Current Phase
                    </div>
                    <p className="font-medium text-gray-900">
                      Phase {progress?.current_phase || 1} of 5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}