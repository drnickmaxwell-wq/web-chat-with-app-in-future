# Video Consultation Module

Complete telemedicine video consultation platform with WebRTC, waiting room, and GDPR-compliant recording for St Mary's House Dental Care.

## Features Included

- **WebRTC Video Calls**: Peer-to-peer video communication
- **Waiting Room Flow**: Professional patient waiting experience
- **Preflight Checks**: Camera, microphone, and connection testing
- **Screen Sharing**: Share documents and treatment plans
- **Session Recording**: GDPR-compliant consultation recording
- **Chat Integration**: Text chat during video calls
- **Mobile Responsive**: Works on desktop, tablet, and mobile
- **Security & Privacy**: End-to-end encryption and data protection

## Brand Integration

- Consistent with St Mary's luxury coastal branding
- Professional video interface with brand colors
- Coastal-themed waiting room experience
- Branded consultation materials and backgrounds

## Installation

1. Extract zip to your project root
2. Copy `src/` contents to your project
3. Configure environment variables from `env.example`
4. Install dependencies from `deps.txt`
5. Set up TURN servers for WebRTC (optional - STUN provided)

## File Structure

```
src/
├── components/
│   ├── video/
│   │   ├── VideoConsultation.tsx      # Main video consultation interface
│   │   ├── WaitingRoom.tsx            # Patient waiting room
│   │   ├── PreflightCheck.tsx         # Device and connection testing
│   │   ├── VideoControls.tsx          # Video call controls
│   │   └── ConsultationEnd.tsx        # Post-consultation screen
│   ├── webrtc/
│   │   ├── WebRTCProvider.tsx         # WebRTC context provider
│   │   ├── PeerConnection.tsx         # WebRTC peer connection management
│   │   ├── MediaDevices.tsx           # Camera/microphone management
│   │   └── ScreenShare.tsx            # Screen sharing functionality
│   ├── chat/
│   │   ├── VideoChat.tsx              # In-call chat component
│   │   ├── ChatMessage.tsx            # Chat message display
│   │   └── ChatInput.tsx              # Chat input component
│   └── recording/
│       ├── SessionRecorder.tsx        # Consultation recording
│       ├── RecordingControls.tsx      # Recording control interface
│       └── RecordingConsent.tsx       # GDPR recording consent
├── lib/
│   ├── webrtc/
│   │   ├── peer-connection.ts         # WebRTC peer connection logic
│   │   ├── media-manager.ts           # Media device management
│   │   ├── signaling-server.ts        # WebRTC signaling
│   │   └── ice-servers.ts             # STUN/TURN server configuration
│   ├── video/
│   │   ├── consultation-manager.ts    # Consultation session management
│   │   ├── waiting-room-manager.ts    # Waiting room logic
│   │   ├── recording-manager.ts       # Session recording management
│   │   └── quality-monitor.ts         # Connection quality monitoring
│   ├── security/
│   │   ├── encryption.ts              # End-to-end encryption
│   │   ├── access-control.ts          # Consultation access control
│   │   └── gdpr-compliance.ts         # GDPR compliance utilities
│   └── utils/
│       ├── device-detection.ts        # Device capability detection
│       ├── bandwidth-test.ts          # Network bandwidth testing
│       └── error-recovery.ts          # Connection error recovery
├── api/
│   ├── consultation/
│   │   ├── create/route.ts            # Create consultation session
│   │   ├── join/route.ts              # Join consultation session
│   │   ├── end/route.ts               # End consultation session
│   │   └── status/route.ts            # Consultation status
│   ├── webrtc/
│   │   ├── signaling/route.ts         # WebRTC signaling endpoint
│   │   ├── ice-servers/route.ts       # ICE server configuration
│   │   └── turn-credentials/route.ts  # TURN server credentials
│   └── recording/
│       ├── start/route.ts             # Start session recording
│       ├── stop/route.ts              # Stop session recording
│       └── download/route.ts          # Download recording (GDPR)
└── demo/
    └── page.tsx                       # Complete demo
```

## Usage Examples

```tsx
import { VideoConsultation } from '@/components/video/VideoConsultation'
import { WaitingRoom } from '@/components/video/WaitingRoom'
import { WebRTCProvider } from '@/components/webrtc/WebRTCProvider'

export default function ConsultationPage() {
  return (
    <WebRTCProvider>
      <VideoConsultation
        consultationId="consultation-123"
        patientId="patient-456"
        doctorId="doctor-789"
        enableRecording={true}
        enableChat={true}
        enableScreenShare={true}
        onConsultationEnd={(summary) => {
          console.log('Consultation ended:', summary)
        }}
      />
    </WebRTCProvider>
  )
}
```

## Video Consultation Flow

### 1. Pre-Consultation Setup
- **Appointment Booking**: Integration with appointment system
- **Device Check**: Camera, microphone, and browser compatibility
- **Connection Test**: Network bandwidth and latency testing
- **Consent Collection**: GDPR consent for recording and data processing

### 2. Waiting Room Experience
- **Professional Interface**: Branded waiting room with practice information
- **Queue Management**: Real-time position in consultation queue
- **Educational Content**: Dental health tips while waiting
- **Technical Support**: Help and troubleshooting resources

### 3. Video Consultation
- **HD Video Quality**: Adaptive bitrate for optimal quality
- **Audio Enhancement**: Noise cancellation and echo reduction
- **Screen Sharing**: Share treatment plans, X-rays, and documents
- **Recording**: GDPR-compliant session recording with consent
- **Chat Integration**: Text chat for notes and links

### 4. Post-Consultation
- **Session Summary**: Consultation notes and recommendations
- **Follow-up Scheduling**: Book follow-up appointments
- **Resource Sharing**: Treatment information and care instructions
- **Feedback Collection**: Patient satisfaction survey

## WebRTC Implementation

### Peer Connection Management
- **ICE Candidate Exchange**: NAT traversal and connectivity
- **Media Stream Handling**: Camera, microphone, and screen sharing
- **Connection Quality**: Real-time quality monitoring and adaptation
- **Fallback Strategies**: Graceful degradation for poor connections

### Signaling Server
- **WebSocket Communication**: Real-time signaling for WebRTC
- **Session Management**: Consultation room creation and management
- **Security**: Encrypted signaling and access control
- **Scalability**: Support for multiple concurrent consultations

## Security & Privacy

### Data Protection
- **End-to-End Encryption**: All video and audio streams encrypted
- **Secure Signaling**: TLS-encrypted signaling server communication
- **Access Control**: Token-based consultation access
- **Session Isolation**: Isolated consultation rooms

### GDPR Compliance
- **Recording Consent**: Explicit consent before recording
- **Data Retention**: Configurable retention periods
- **Right to Deletion**: Patient can request recording deletion
- **Data Export**: Patients can download their consultation data

### Medical Compliance
- **HIPAA Considerations**: Healthcare data protection measures
- **Audit Logging**: Comprehensive consultation activity logging
- **Professional Standards**: Compliance with telemedicine regulations

## Device Support

### Desktop Browsers
- **Chrome/Chromium**: Full WebRTC support
- **Firefox**: Complete compatibility
- **Safari**: WebRTC support with fallbacks
- **Edge**: Modern WebRTC implementation

### Mobile Devices
- **iOS Safari**: WebRTC support in iOS 11+
- **Android Chrome**: Full mobile WebRTC support
- **Responsive Design**: Optimized for mobile screens
- **Touch Controls**: Mobile-friendly interface controls

## Quality & Performance

### Adaptive Streaming
- **Bandwidth Detection**: Automatic quality adjustment
- **Network Monitoring**: Real-time connection quality assessment
- **Fallback Options**: Audio-only mode for poor connections
- **Reconnection Logic**: Automatic reconnection on network issues

### Performance Optimization
- **Lazy Loading**: Components loaded on demand
- **Resource Management**: Efficient memory and CPU usage
- **Battery Optimization**: Mobile battery usage optimization
- **Bandwidth Efficiency**: Optimized video encoding

## Environment Variables

See `env.example` for WebRTC servers, signaling configuration, and security settings.

