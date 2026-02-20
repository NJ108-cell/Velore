import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, MapPin, Car, 
  AlertTriangle, CheckCircle2, Loader2, Mic, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

const suggestedQuestions = [
  "What license do I need for a car?",
  "What are the speed limits in my area?",
  "How do I prepare for a driving test?",
  "What safety equipment is required?",
  "Can I modify my vehicle legally?",
  "What are the age requirements?"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build conversation history
    const conversationHistory = messages.map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');

    const context = `
You are VehicleLearn AI - a helpful, location-aware vehicle learning assistant.

User Context:
- Location: ${progress?.selected_state || ''}, ${progress?.selected_country || 'Unknown'}
- Vehicle Domain: ${progress?.vehicle_domain || 'Land'}
- Vehicle Type: ${progress?.vehicle_type || 'Car'}
- Purpose: ${progress?.purpose || 'Personal'}
- Skill Level: ${progress?.skill_level || 'Beginner'}
- Current Learning Phase: ${progress?.current_phase || 1}

Previous Conversation:
${conversationHistory}

Guidelines:
1. Always consider the user's location for regulations
2. Provide clear, simple explanations (user is ${progress?.skill_level || 'beginner'} level)
3. Include safety warnings when relevant (use ⚠️)
4. Mark legal requirements with ✅
5. Mark prohibited actions with ❌
6. Be encouraging and supportive
7. If unsure about specific local laws, recommend checking official sources
8. Reference previous conversation when relevant

Current User Question: ${text}

Respond helpfully and concisely. Use bullet points for clarity. Include location-specific info when relevant.
    `;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: context,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again or rephrase your question." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI Learning Guide</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Online • Here to help
              </p>
            </div>
          </div>
          
          {progress?.selected_country && (
            <Badge variant="outline" className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {progress.selected_state ? `${progress.selected_state}, ` : ''}{progress.selected_country}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Hi{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! How can I help?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Ask me anything about vehicle operation, regulations, licenses, or your learning path.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {suggestedQuestions.slice(0, 4).map((question) => (
                  <motion.button
                    key={question}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="p-4 rounded-xl bg-white border border-gray-200 text-left text-sm text-gray-700 hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message List */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about vehicles..."
                className="pr-12 py-6 rounded-xl border-gray-200 focus:border-violet-400"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => alert('Voice input feature coming soon!\n\nThis would allow you to speak your questions instead of typing.')}
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
            <Button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            AI responses are for educational purposes. Always verify with official sources.
          </p>
        </div>
      </div>
    </div>
  );
}