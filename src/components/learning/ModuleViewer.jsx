import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  X, CheckCircle2, ArrowRight, ArrowLeft, Clock, 
  PlayCircle, BookOpen, Monitor, Wrench, FileText,
  Award, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';

const moduleContent = {
  theory: {
    icon: BookOpen,
    content: (module) => `
# ${module.title}

## Overview
This module covers essential theoretical knowledge about ${module.title.toLowerCase()}.

## Learning Objectives
- Understand the key concepts
- Learn safety protocols
- Master theoretical principles
- Pass the assessment

## Content

### Section 1: Introduction
Understanding the fundamentals is crucial for safe vehicle operation. This section introduces you to the core concepts.

### Section 2: Key Principles
- **Safety First**: Always prioritize safety in all operations
- **Legal Compliance**: Follow all local regulations
- **Best Practices**: Industry-standard procedures

### Section 3: Important Details
Vehicle operation requires knowledge of systems, controls, and safety measures. Pay close attention to:
- Emergency procedures
- Normal operating conditions
- Prohibited actions

## Summary
Completing this module gives you the theoretical foundation needed for practical application.
    `
  },
  simulation: {
    icon: Monitor,
    content: (module) => `
# ${module.title}

## Virtual Practice Session

This simulation helps you practice in a safe, controlled environment.

## Simulation Objectives
- Practice controls without risk
- Build muscle memory
- Experience various scenarios
- React to hazards

## Instructions
1. Review the controls
2. Start with basic maneuvers
3. Progress to complex scenarios
4. Complete all challenges

### Scenario 1: Basic Controls
Practice acceleration, braking, and steering in an open environment.

### Scenario 2: Real-World Conditions
Navigate through traffic, weather, and various road conditions.

### Scenario 3: Emergency Response
Learn to handle emergency situations safely and effectively.

## Tips
- Take your time
- Repeat scenarios as needed
- Focus on smooth control inputs
- Learn from mistakes
    `
  },
  practical: {
    icon: Wrench,
    content: (module) => `
# ${module.title}

## Practical Training

Hands-on experience with real equipment under supervision.

## Prerequisites
✅ Complete theory modules
✅ Pass simulation training
✅ Have required permits

## What You'll Do
1. Pre-operation inspection
2. Basic maneuvers
3. Real-world scenarios
4. Instructor evaluation

### Safety Checklist
- [ ] Proper safety equipment
- [ ] Supervisor present
- [ ] Clear operating area
- [ ] Emergency procedures reviewed

### Practice Areas
- Controlled environment first
- Gradual complexity increase
- Real-world conditions last

## Instructor Guidelines
Your instructor will evaluate:
- Safety awareness
- Control precision
- Decision making
- Procedure adherence
    `
  },
  assessment: {
    icon: FileText,
    content: (module) => `
# ${module.title}

## Knowledge Assessment

Test your understanding of the material covered.

## Assessment Details
- **Questions**: 20 multiple choice
- **Passing Score**: 80%
- **Time Limit**: 30 minutes
- **Attempts**: 3 maximum

## Topics Covered
All material from this phase will be tested.

## Preparation Tips
1. Review all module content
2. Practice with simulations
3. Understand key concepts
4. Don't rush - read carefully

## What Happens Next
- **Pass**: Unlock next phase
- **Fail**: Review material and retry
- **3 Failures**: Speak with instructor

## Important Notes
⚠️ This is a timed assessment
⚠️ You cannot pause once started
✅ Answers are reviewed immediately
✅ Passing advances you to next phase

## Ready?
When you're confident in your knowledge, click "Start Assessment" below.
    `
  }
};

export default function ModuleViewer({ module, onClose, currentProgress }) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletion, setShowCompletion] = useState(false);

  const Icon = moduleContent[module.content_type]?.icon || BookOpen;
  const content = moduleContent[module.content_type]?.content(module) || 
    `# ${module.title}\n\nModule content coming soon...`;

  useEffect(() => {
    // Simulate reading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const createOrUpdateProgressMutation = useMutation({
    mutationFn: async (data) => {
      // Check if progress record exists
      const existing = await base44.entities.ModuleProgress.filter({
        created_by: (await base44.auth.me()).email,
        module_id: module.id
      });

      if (existing.length > 0) {
        return base44.entities.ModuleProgress.update(existing[0].id, data);
      } else {
        return base44.entities.ModuleProgress.create({
          module_id: module.id,
          module_title: module.title,
          ...data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    }
  });

  const completeModuleMutation = useMutation({
    mutationFn: async () => {
      const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
      const user = await base44.auth.me();
      
      // Update module progress
      await createOrUpdateProgressMutation.mutateAsync({
        status: 'completed',
        progress_percentage: 100,
        time_spent_minutes: timeSpent,
        completed_at: new Date().toISOString()
      });

      // Update user progress
      const progressList = await base44.entities.UserProgress.filter({
        created_by: user.email
      });

      if (progressList.length > 0) {
        const userProgress = progressList[0];
        const completedModules = userProgress.completed_modules || [];
        
        if (!completedModules.includes(module.id)) {
          completedModules.push(module.id);
          
          const totalHours = (userProgress.total_learning_hours || 0) + (timeSpent / 60);
          
          await base44.entities.UserProgress.update(userProgress.id, {
            completed_modules: completedModules,
            total_learning_hours: parseFloat(totalHours.toFixed(2))
          });
        }
      }
    },
    onSuccess: () => {
      setShowCompletion(true);
    }
  });

  const handleComplete = () => {
    completeModuleMutation.mutate();
  };

  if (showCompletion) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Module Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Great job completing <strong>{module.title}</strong>
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            Continue Learning
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-4xl w-full my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <Icon className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{module.title}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {module.duration_minutes} minutes
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
          
          <Button
            onClick={handleComplete}
            disabled={progress < 100 || completeModuleMutation.isPending}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            {completeModuleMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : progress < 100 ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Keep Reading...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Module
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}