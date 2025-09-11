'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Video, VideoOff, Mic, MicOff, Monitor, MessageCircle, Phone, Settings } from 'lucide-react'
import { WaitingRoom } from './WaitingRoom'
import { PreflightCheck } from './PreflightCheck'
import { VideoControls } from './VideoControls'
import { ConsultationEnd } from './ConsultationEnd'
import { VideoChat } from '@/components/chat/VideoChat'
import { SessionRecorder } from '@/components/recording/SessionRecorder'
import { useWebRTC } from '@/components/webrtc/WebRTCProvider'

interface VideoConsultationProps {
  consultationId: string
  patientId: string
  doctorId: string
  enableRecording?: boolean
  enableChat?: boolean
  enableScreenShare?: boolean
  onConsultationEnd?: (summary: any) => void
  className?: string
}

type ConsultationState = 'preflight' | 'waiting' | 'connecting' | 'active' | 'ended'

interface ConsultationData {
  id: string
  patientId: string
  doctorId: string
  startTime?: Date
  endTime?: Date
  duration?: number
  recordingId?: string
  chatMessages?: any[]
  summary?: string
}

export function VideoConsultation({
  consultationId,
  patientId,
  doctorId,
  enableRecording = true,
  enableChat = true,
  enableScreenShare = true,
  onConsultationEnd,
  className = ''
}: VideoConsultationProps) {
  const [consultationState, setConsultationState] = useState<ConsultationState>('preflight')
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    id: consultationId,
    patientId,
    doctorId
  })
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent')
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  
  const { 
    peerConnection, 
    createOffer, 
    createAnswer, 
    addIceCandidate,
    isConnected,
    connectionState 
  } = useWebRTC()

  useEffect(() => {
    // Initialize consultation when component mounts
    initializeConsultation()
    
    return () => {
      // Cleanup when component unmounts
      cleanupConsultation()
    }
  }, [])

  useEffect(() => {
    // Update connection quality based on WebRTC stats
    if (peerConnection) {
      monitorConnectionQuality()
    }
  }, [peerConnection])

  const initializeConsultation = async () => {
    try {
      // Set consultation start time
      setConsultationData(prev => ({
        ...prev,
        startTime: new Date()
      }))
    } catch (error) {
      console.error('Failed to initialize consultation:', error)
    }
  }

  const cleanupConsultation = () => {
    // Stop all media streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close()
    }
  }

  const handlePreflightComplete = async (deviceCheck: any) => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceCheck.camera,
        audio: deviceCheck.microphone
      })
      
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      setConsultationState('waiting')
    } catch (error) {
      console.error('Failed to get user media:', error)
    }
  }

  const handleJoinConsultation = async () => {
    setConsultationState('connecting')
    
    try {
      // Add local stream to peer connection
      if (localStream && peerConnection) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream)
        })
      }
      
      // Create offer or wait for offer
      await createOffer()
      
      setConsultationState('active')
    } catch (error) {
      console.error('Failed to join consultation:', error)
    }
  }

  const handleEndConsultation = async () => {
    const endTime = new Date()
    const duration = consultationData.startTime 
      ? Math.floor((endTime.getTime() - consultationData.startTime.getTime()) / 1000)
      : 0

    const finalData = {
      ...consultationData,
      endTime,
      duration
    }

    setConsultationData(finalData)
    setConsultationState('ended')
    
    // Stop recording if active
    if (isRecording) {
      setIsRecording(false)
    }
    
    // Cleanup streams
    cleanupConsultation()
    
    onConsultationEnd?.(finalData)
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleScreenShare = async () => {
    if (!enableScreenShare) return

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        // Replace video track with screen share
        if (peerConnection && localStream) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          )
          
          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
        }
        
        setIsScreenSharing(true)
        
        // Listen for screen share end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false)
          // Switch back to camera
          if (localStream) {
            const cameraTrack = localStream.getVideoTracks()[0]
            const sender = peerConnection?.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            )
            if (sender && cameraTrack) {
              sender.replaceTrack(cameraTrack)
            }
          }
        })
      } else {
        // Switch back to camera
        if (peerConnection && localStream) {
          const cameraTrack = localStream.getVideoTracks()[0]
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          )
          
          if (sender && cameraTrack) {
            await sender.replaceTrack(cameraTrack)
          }
        }
        
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Screen share failed:', error)
    }
  }

  const monitorConnectionQuality = () => {
    if (!peerConnection) return

    const interval = setInterval(async () => {
      try {
        const stats = await peerConnection.getStats()
        let quality: typeof connectionQuality = 'excellent'
        
        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            const packetsLost = report.packetsLost || 0
            const packetsReceived = report.packetsReceived || 1
            const lossRate = packetsLost / (packetsLost + packetsReceived)
            
            if (lossRate > 0.05) quality = 'poor'
            else if (lossRate > 0.02) quality = 'fair'
            else if (lossRate > 0.01) quality = 'good'
          }
        })
        
        setConnectionQuality(quality)
      } catch (error) {
        console.error('Failed to get connection stats:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }

  const getQualityColor = (quality: typeof connectionQuality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (consultationState === 'preflight') {
    return (
      <PreflightCheck
        onComplete={handlePreflightComplete}
        className={className}
      />
    )
  }

  if (consultationState === 'waiting') {
    return (
      <WaitingRoom
        consultationId={consultationId}
        patientId={patientId}
        onJoin={handleJoinConsultation}
        className={className}
      />
    )
  }

  if (consultationState === 'ended') {
    return (
      <ConsultationEnd
        consultation={consultationData}
        onNewConsultation={() => setConsultationState('preflight')}
        className={className}
      />
    )
  }

  return (
    <div className={`h-screen bg-gray-900 flex flex-col ${className}`}>
      
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Video Consultation</h1>
            <p className="text-sm text-gray-600">
              {consultationState === 'connecting' ? 'Connecting...' : 'Connected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Quality */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionQuality === 'excellent' ? 'bg-green-500' :
              connectionQuality === 'good' ? 'bg-blue-500' :
              connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm ${getQualityColor(connectionQuality)}`}>
              {connectionQuality}
            </span>
          </div>
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {enableChat && isChatOpen && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg">
            <VideoChat
              consultationId={consultationId}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          {enableScreenShare && (
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
          )}

          {/* Chat Toggle */}
          {enableChat && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3 rounded-full transition-colors ${
                isChatOpen 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          )}

          {/* End Call */}
          <button
            onClick={handleEndConsultation}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" />
          </button>
        </div>
      </div>

      {/* Session Recorder */}
      {enableRecording && (
        <SessionRecorder
          consultationId={consultationId}
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
        />
      )}
    </div>
  )
}

