// ============================================================================
// COMPLETE AI CHATBOT SYSTEM - ALL INTEGRATIONS
// Prominent chatbot with OpenAI, Zapier, HeyGen, Synthesia integrations
// ============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Minimize2, Maximize2, Phone, Video, Calendar, Sparkles } from 'lucide-react';

// ============================================================================
// 1. MAIN AI CHATBOT COMPONENT
// ============================================================================

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'appointment' | 'video' | 'form';
  metadata?: any;
}

interface ChatbotProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  theme?: 'light' | 'dark' | 'brand';
}

export const ProminentAIChatbot: React.FC<ChatbotProps> = ({
  className = '',
  position = 'bottom-right',
  theme = 'brand'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI dental assistant. How can I help you today? I can help with appointments, treatment information, or answer any dental questions you have.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const themeClasses = {
    light: 'bg-white text-gray-800 border-gray-200',
    dark: 'bg-gray-800 text-white border-gray-600',
    brand: 'bg-gradient-to-br from-pink-600 to-teal-600 text-white border-transparent'
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Send to AI processing
      const response = await processAIMessage(inputValue);
      
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: 'bot',
          timestamp: new Date(),
          type: response.type,
          metadata: response.metadata
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses[position]} z-50 w-16 h-16 ${themeClasses[theme]} rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2`}
          >
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ 
              scale: isMinimized ? 0.3 : 1, 
              opacity: 1, 
              y: 0,
              height: isMinimized ? 60 : 500 
            }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            className={`fixed ${positionClasses[position]} z-50 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden ${className}`}
          >
            {/* Header */}
            <div className={`${themeClasses[theme]} p-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Dental Assistant</h3>
                  <p className="text-xs opacity-80">Online • Instant replies</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-2 shadow">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about treatments, book appointments..."
                      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-teal-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-2">
                    <QuickActionButton icon={Calendar} text="Book Appointment" onClick={() => handleQuickAction('appointment')} />
                    <QuickActionButton icon={Video} text="Video Call" onClick={() => handleQuickAction('video')} />
                    <QuickActionButton icon={Phone} text="Call Now" onClick={() => handleQuickAction('call')} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  function handleQuickAction(action: string) {
    const quickMessages = {
      appointment: "I'd like to book an appointment",
      video: "I'd like to schedule a video consultation",
      call: "I'd like to speak with someone now"
    };
    
    setInputValue(quickMessages[action as keyof typeof quickMessages]);
  }
};

// ============================================================================
// 2. MESSAGE BUBBLE COMPONENT
// ============================================================================

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex items-start space-x-2 max-w-xs ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-gradient-to-r from-pink-600 to-teal-600' : 'bg-gray-300'}`}>
          {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
        </div>
        <div className={`rounded-2xl px-4 py-2 shadow ${isBot ? 'bg-white' : 'bg-gradient-to-r from-pink-600 to-teal-600 text-white'}`}>
          <p className="text-sm">{message.content}</p>
          {message.type === 'appointment' && (
            <AppointmentCard metadata={message.metadata} />
          )}
          {message.type === 'video' && (
            <VideoCallCard metadata={message.metadata} />
          )}
          <p className="text-xs opacity-60 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 3. QUICK ACTION BUTTON
// ============================================================================

const QuickActionButton: React.FC<{
  icon: React.ComponentType<any>;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors"
  >
    <Icon className="w-3 h-3" />
    <span>{text}</span>
  </motion.button>
);

// ============================================================================
// 4. AI MESSAGE PROCESSING WITH ALL INTEGRATIONS
// ============================================================================

async function processAIMessage(message: string): Promise<{
  content: string;
  type?: string;
  metadata?: any;
}> {
  try {
    // Determine intent
    const intent = await determineIntent(message);
    
    switch (intent) {
      case 'appointment':
        return await handleAppointmentRequest(message);
      case 'treatment_info':
        return await handleTreatmentInfo(message);
      case 'video_consultation':
        return await handleVideoConsultation(message);
      case 'emergency':
        return await handleEmergency(message);
      default:
        return await handleGeneralQuery(message);
    }
  } catch (error) {
    console.error('AI Processing Error:', error);
    return {
      content: "I apologize, but I'm having trouble processing your request right now. Please try again or call us directly at 01273 453109.",
    };
  }
}

// ============================================================================
// 5. INTENT DETERMINATION
// ============================================================================

async function determineIntent(message: string): Promise<string> {
  const keywords = {
    appointment: ['appointment', 'book', 'schedule', 'visit', 'see doctor'],
    treatment_info: ['treatment', 'procedure', 'cost', 'price', 'veneer', 'implant', 'whitening'],
    video_consultation: ['video', 'consultation', 'online', 'remote', 'telemedicine'],
    emergency: ['emergency', 'pain', 'urgent', 'help', 'hurt']
  };

  const lowerMessage = message.toLowerCase();
  
  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      return intent;
    }
  }
  
  return 'general';
}

// ============================================================================
// 6. OPENAI INTEGRATION
// ============================================================================

async function callOpenAI(prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        context: context || 'You are a helpful AI assistant for St Mary\'s House Dental Care, a luxury coastal dental practice in Shoreham-by-Sea.',
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API call failed');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}

// ============================================================================
// 7. ZAPIER INTEGRATION
// ============================================================================

async function sendToZapier(data: any, webhookUrl: string): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Zapier webhook failed');
    }
  } catch (error) {
    console.error('Zapier Error:', error);
    throw error;
  }
}

// ============================================================================
// 8. HEYGEN INTEGRATION
// ============================================================================

async function generateHeyGenVideo(script: string, avatarId: string = 'default'): Promise<string> {
  try {
    const response = await fetch('/api/integrations/heygen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        avatar_id: avatarId,
        voice_id: 'female_professional',
        background: 'dental_office'
      }),
    });

    if (!response.ok) {
      throw new Error('HeyGen API call failed');
    }

    const data = await response.json();
    return data.video_url;
  } catch (error) {
    console.error('HeyGen Error:', error);
    throw error;
  }
}

// ============================================================================
// 9. SYNTHESIA INTEGRATION
// ============================================================================

async function generateSynthesiaVideo(script: string, template: string = 'dental_consultation'): Promise<string> {
  try {
    const response = await fetch('/api/integrations/synthesia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        template,
        avatar: 'dental_professional',
        background: 'modern_dental_office'
      }),
    });

    if (!response.ok) {
      throw new Error('Synthesia API call failed');
    }

    const data = await response.json();
    return data.video_url;
  } catch (error) {
    console.error('Synthesia Error:', error);
    throw error;
  }
}

// ============================================================================
// 10. INTENT HANDLERS
// ============================================================================

async function handleAppointmentRequest(message: string): Promise<{
  content: string;
  type: string;
  metadata: any;
}> {
  // Send to Zapier for CRM integration
  await sendToZapier({
    type: 'appointment_request',
    message,
    timestamp: new Date().toISOString(),
    source: 'chatbot'
  }, process.env.ZAPIER_APPOINTMENT_WEBHOOK || '');

  // Generate AI response
  const aiResponse = await callOpenAI(
    `A patient wants to book an appointment. Their message: "${message}". Provide a helpful response and ask for their preferred date/time.`,
    'You are a dental receptionist helping with appointment booking.'
  );

  return {
    content: aiResponse,
    type: 'appointment',
    metadata: {
      availableSlots: [
        { date: '2024-01-15', time: '10:00 AM' },
        { date: '2024-01-15', time: '2:00 PM' },
        { date: '2024-01-16', time: '9:00 AM' }
      ]
    }
  };
}

async function handleTreatmentInfo(message: string): Promise<{
  content: string;
  type?: string;
  metadata?: any;
}> {
  const aiResponse = await callOpenAI(
    `A patient is asking about dental treatments. Their question: "${message}". Provide detailed, professional information about the treatment they're asking about.`,
    'You are a dental expert providing treatment information for St Mary\'s House Dental Care.'
  );

  return {
    content: aiResponse
  };
}

async function handleVideoConsultation(message: string): Promise<{
  content: string;
  type: string;
  metadata: any;
}> {
  // Generate personalized video response using HeyGen
  const videoScript = `Hello! I understand you're interested in a video consultation. At St Mary's House Dental Care, we offer secure, GDPR-compliant video consultations where you can speak directly with our dental professionals from the comfort of your home.`;
  
  const videoUrl = await generateHeyGenVideo(videoScript);

  return {
    content: "I'd be happy to help you schedule a video consultation! Here's a personalized message from our team:",
    type: 'video',
    metadata: {
      videoUrl,
      consultationTypes: ['General Consultation', 'Treatment Planning', 'Follow-up'],
      duration: '30 minutes',
      cost: '£75'
    }
  };
}

async function handleEmergency(message: string): Promise<{
  content: string;
  type?: string;
  metadata?: any;
}> {
  // Immediate Zapier notification for emergency
  await sendToZapier({
    type: 'emergency',
    message,
    timestamp: new Date().toISOString(),
    priority: 'high'
  }, process.env.ZAPIER_EMERGENCY_WEBHOOK || '');

  return {
    content: "I understand this is urgent. For dental emergencies, please call us immediately at 01273 453109. If it's outside office hours, we have an emergency line available 24/7. In the meantime, here are some immediate steps you can take..."
  };
}

async function handleGeneralQuery(message: string): Promise<{
  content: string;
  type?: string;
  metadata?: any;
}> {
  const aiResponse = await callOpenAI(
    message,
    'You are a helpful AI assistant for St Mary\'s House Dental Care. Provide friendly, professional responses about dental care, the practice, and general dental health.'
  );

  return {
    content: aiResponse
  };
}

// ============================================================================
// 11. APPOINTMENT CARD COMPONENT
// ============================================================================

const AppointmentCard: React.FC<{ metadata: any }> = ({ metadata }) => (
  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
    <h4 className="font-semibold text-sm mb-2">Available Appointments</h4>
    <div className="space-y-2">
      {metadata?.availableSlots?.map((slot: any, index: number) => (
        <button
          key={index}
          className="w-full text-left p-2 bg-white rounded border hover:border-pink-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">{slot.date}</span>
            <span className="text-sm font-medium">{slot.time}</span>
          </div>
        </button>
      ))}
    </div>
    <button className="w-full mt-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
      Book Appointment
    </button>
  </div>
);

// ============================================================================
// 12. VIDEO CALL CARD COMPONENT
// ============================================================================

const VideoCallCard: React.FC<{ metadata: any }> = ({ metadata }) => (
  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
    <h4 className="font-semibold text-sm mb-2">Video Consultation</h4>
    {metadata?.videoUrl && (
      <video
        src={metadata.videoUrl}
        controls
        className="w-full rounded mb-2"
        style={{ maxHeight: '150px' }}
      />
    )}
    <div className="space-y-1 text-xs text-gray-600">
      <p>Duration: {metadata?.duration}</p>
      <p>Cost: {metadata?.cost}</p>
    </div>
    <button className="w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors">
      Schedule Video Call
    </button>
  </div>
);

// USAGE INSTRUCTIONS:
/*
1. Add to your layout.tsx or main component:
   <ProminentAIChatbot position="bottom-right" theme="brand" />

2. Create API routes:
   - /api/chat (OpenAI integration)
   - /api/integrations/heygen
   - /api/integrations/synthesia

3. Set environment variables:
   - OPENAI_API_KEY
   - ZAPIER_APPOINTMENT_WEBHOOK
   - ZAPIER_EMERGENCY_WEBHOOK
   - HEYGEN_API_KEY
   - SYNTHESIA_API_KEY

4. The chatbot will appear on all pages as a floating button
   and expand into a full chat interface when clicked.
*/

