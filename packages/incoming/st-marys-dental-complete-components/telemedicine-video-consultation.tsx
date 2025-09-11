// app/video-consultation/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Users, MessageSquare, FileText, Calendar } from 'lucide-react';

// ============================================================================
// 1. MAIN VIDEO CONSULTATION COMPONENT
// ============================================================================

export default function VideoConsultationPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Initialize WebRTC
  useEffect(() => {
    if (isCallActive) {
      initializeCall();
    } else {
      cleanupCall();
    }

    return () => cleanupCall();
  }, [isCallActive]);

  const initializeCall = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate connection (in real implementation, this would use WebRTC)
      setTimeout(() => {
        setConnectionStatus('connected');
        // Simulate remote stream
        setRemoteStream(stream); // In real app, this would be the remote peer's stream
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setConnectionStatus('disconnected');
      setIsCallActive(false);
    }
  };

  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setConnectionStatus('disconnected');
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-teal-600 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Video Consultation</h1>
              <p className="text-white/70 text-sm">Secure GDPR-compliant telemedicine</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-300' :
              connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {connectionStatus === 'connected' ? '🟢 Connected' :
               connectionStatus === 'connecting' ? '🟡 Connecting...' :
               '🔴 Disconnected'}
            </div>
          </div>
        </div>
      </header>

      {!isCallActive ? (
        <PreCallSetup onStartCall={() => setIsCallActive(true)} />
      ) : (
        <VideoCallInterface
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          connectionStatus={connectionStatus}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          onEndCall={endCall}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          showChat={showChat}
          setShowChat={setShowChat}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
        />
      )}
    </div>
  );
}

// ============================================================================
// 2. PRE-CALL SETUP COMPONENT
// ============================================================================

const PreCallSetup: React.FC<{ onStartCall: () => void }> = ({ onStartCall }) => {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    symptoms: '',
    urgency: 'routine'
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [deviceTest, setDeviceTest] = useState({ camera: false, microphone: false });
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    testDevices();
  }, []);

  const testDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }
      
      setDeviceTest({ camera: true, microphone: true });
      
      // Stop the test stream after a few seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
      }, 5000);
    } catch (error) {
      console.error('Device test failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consentGiven && deviceTest.camera && deviceTest.microphone) {
      onStartCall();
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Information Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Consultation Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={patientInfo.email}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="+44 1234 567890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Reason for Consultation</label>
                  <select
                    value={patientInfo.reason}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="routine-checkup">Routine Checkup</option>
                    <option value="dental-pain">Dental Pain</option>
                    <option value="cosmetic-consultation">Cosmetic Consultation</option>
                    <option value="treatment-followup">Treatment Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Symptoms/Description</label>
                  <textarea
                    value={patientInfo.symptoms}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Please describe your symptoms or concerns..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Urgency Level</label>
                  <select
                    value={patientInfo.urgency}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Device Test & Consent */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Device Setup</h2>
              
              {/* Camera Preview */}
              <div className="mb-6">
                <div className="bg-black/50 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={previewRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${deviceTest.camera ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-white/80 text-sm">Camera</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${deviceTest.microphone ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-white/80 text-sm">Microphone</span>
                  </div>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Privacy & Consent</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <p>By proceeding with this video consultation:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your consultation will be encrypted end-to-end</li>
                    <li>No recording will be made without your explicit consent</li>
                    <li>Your medical data is processed securely under GDPR</li>
                    <li>You can request data deletion at any time</li>
                  </ul>
                </div>
                
                <label className="flex items-start space-x-3 mt-4">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 rounded"
                  />
                  <span className="text-white/80 text-sm">
                    I consent to the processing of my personal and medical data for this consultation, 
                    and I understand my rights under GDPR.
                  </span>
                </label>
              </div>

              {/* Start Call Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!consentGiven || !deviceTest.camera || !deviceTest.microphone}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-teal-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                whileHover={{ scale: consentGiven && deviceTest.camera && deviceTest.microphone ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Video Consultation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. VIDEO CALL INTERFACE
// ============================================================================

const VideoCallInterface: React.FC<{
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  connectionStatus: string;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}> = ({
  localVideoRef,
  remoteVideoRef,
  isVideoEnabled,
  isAudioEnabled,
  connectionStatus,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  showSettings,
  setShowSettings,
  showChat,
  setShowChat,
  showNotes,
  setShowNotes
}) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover bg-gray-900"
          />
          
          {connectionStatus === 'connecting' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xl">Connecting to practitioner...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-white/60" />
            </div>
          )}
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-white text-sm">
            <div className="font-semibold">Dr. Sarah Mitchell</div>
            <div className="text-white/70">Duration: {formatDuration(callDuration)}</div>
          </div>
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
          {showNotes && <NotesPanel onClose={() => setShowNotes(false)} />}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-lg p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Toggle */}
          <motion.button
            onClick={onToggleAudio}
            className={`p-4 rounded-full ${isAudioEnabled ? 'bg-white/20' : 'bg-red-500'} text-white hover:scale-105 transition-all`}
            whileTap={{ scale: 0.95 }}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </motion.button>

          {/* Video Toggle */}
          <motion.button
            onClick={onToggleVideo}
            className={`p-4 rounded-full ${isVideoEnabled ? 'bg-white/20' : 'bg-red-500'} text-white hover:scale-105 transition-all`}
            whileTap={{ scale: 0.95 }}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </motion.button>

          {/* End Call */}
          <motion.button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-500 text-white hover:scale-105 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <PhoneOff className="w-6 h-6" />
          </motion.button>

          {/* Chat */}
          <motion.button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full ${showChat ? 'bg-pink-500' : 'bg-white/20'} text-white hover:scale-105 transition-all`}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>

          {/* Notes */}
          <motion.button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-4 rounded-full ${showNotes ? 'bg-teal-500' : 'bg-white/20'} text-white hover:scale-105 transition-all`}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-6 h-6" />
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-white/20 text-white hover:scale-105 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. CHAT PANEL
// ============================================================================

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Mitchell', message: 'Hello! How are you feeling today?', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'You',
        message: newMessage,
        timestamp: new Date()
      }]);
      setNewMessage('');
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-lg border-l border-white/20"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h3 className="text-white font-semibold">Chat</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs ${
                msg.sender === 'You' 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-white/20 text-white'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 5. NOTES PANEL
// ============================================================================

const NotesPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [notes, setNotes] = useState('');

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-lg border-l border-white/20"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h3 className="text-white font-semibold">Consultation Notes</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>
        
        <div className="flex-1 p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes during the consultation..."
            className="w-full h-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>
        
        <div className="p-4 border-t border-white/20">
          <button className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            Save Notes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

