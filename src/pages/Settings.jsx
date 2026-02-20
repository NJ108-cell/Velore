import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Bell, Moon, Globe, Shield, 
  Volume2, Smartphone, Eye, Database, HelpCircle, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: settingsList = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.AppSettings.filter({ created_by: user.email });
    },
    enabled: !!user?.email
  });

  const savedSettings = settingsList[0];
  const [settings, setSettings] = useState({
    notifications_enabled: savedSettings?.notifications_enabled ?? true,
    email_updates_enabled: savedSettings?.email_updates_enabled ?? true,
    dark_mode: savedSettings?.dark_mode ?? false,
    voice_guidance: savedSettings?.voice_guidance ?? true,
    auto_play_videos: savedSettings?.auto_play_videos ?? false,
    anonymous_data_collection: savedSettings?.anonymous_data_collection ?? true,
    language: savedSettings?.language ?? 'en'
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings({
        notifications_enabled: savedSettings.notifications_enabled ?? true,
        email_updates_enabled: savedSettings.email_updates_enabled ?? true,
        dark_mode: savedSettings.dark_mode ?? false,
        voice_guidance: savedSettings.voice_guidance ?? true,
        auto_play_videos: savedSettings.auto_play_videos ?? false,
        anonymous_data_collection: savedSettings.anonymous_data_collection ?? true,
        language: savedSettings.language ?? 'en'
      });
    }
  }, [savedSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (savedSettings?.id) {
        return base44.entities.AppSettings.update(savedSettings.id, data);
      } else {
        return base44.entities.AppSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    }
  });

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettingsMutation.mutate(newSettings);
  };

  const handleLanguageChange = (language) => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    saveSettingsMutation.mutate(newSettings);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await base44.auth.logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your preferences and app settings</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Control how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive learning reminders and updates</p>
                </div>
                <Switch
                  checked={settings.notifications_enabled}
                  onCheckedChange={() => handleToggle('notifications_enabled')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Updates</Label>
                  <p className="text-sm text-gray-500">Get weekly progress reports via email</p>
                </div>
                <Switch
                  checked={settings.email_updates_enabled}
                  onCheckedChange={() => handleToggle('email_updates_enabled')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the app looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-500">Use dark theme for better visibility at night</p>
                </div>
                <Switch
                  checked={settings.dark_mode}
                  onCheckedChange={() => handleToggle('dark_mode')}
                />
              </div>

              <div>
                <Label className="mb-2 block">Language</Label>
                <Select value={settings.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Learning Preferences
              </CardTitle>
              <CardDescription>
                Adjust your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Guidance</Label>
                  <p className="text-sm text-gray-500">Enable audio instructions during lessons</p>
                </div>
                <Switch
                  checked={settings.voice_guidance}
                  onCheckedChange={() => handleToggle('voice_guidance')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-play Videos</Label>
                  <p className="text-sm text-gray-500">Automatically start video content</p>
                </div>
                <Switch
                  checked={settings.auto_play_videos}
                  onCheckedChange={() => handleToggle('auto_play_videos')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Usage Data</Label>
                  <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                </div>
                <Switch
                  checked={settings.anonymous_data_collection}
                  onCheckedChange={() => handleToggle('anonymous_data_collection')}
                />
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => alert('Download feature coming soon!\n\nThis will let you download all your personal data.')}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Help Center coming soon!')}
              >
                Help Center
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Contact Support coming soon!')}
              >
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('VehicleLearn v1.0.0\n\nYour global vehicle learning platform.')}
              >
                About VehicleLearn
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}