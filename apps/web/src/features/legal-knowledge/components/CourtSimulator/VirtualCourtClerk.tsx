import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Button
} from '@mui/material';
import { 
  KeyboardAlt as KeyboardIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  VolumeUp as VolumeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface CourtSession {
  id: string;
  participants: Participant[];
  currentSpeaker?: string;
  isRecording: boolean;
  startTime?: Date;
  endTime?: Date;
}

interface Participant {
  id: string;
  name: string;
  role: 'judge' | 'prosecutor' | 'defendant' | 'lawyer' | 'witness' | 'student';
  avatar?: string;
  isActive: boolean;
}

interface ProtocolEntry {
  timestamp: Date;
  speaker: string;
  role: string;
  text: string;
  isTyping?: boolean;
}

interface VirtualCourtClerkProps {
  session: CourtSession;
  onProtocolUpdate?: (protocol: ProtocolEntry[]) => void;
}

const roleLabels = {
  judge: 'כב׳ השופט/ת',
  prosecutor: 'התובע',
  defendant: 'הנתבע', 
  lawyer: 'עו״ד',
  witness: 'עד',
  student: 'סטודנט'
};

const roleColors = {
  judge: '#1976d2',
  prosecutor: '#d32f2f',
  defendant: '#7b1fa2',
  lawyer: '#388e3c',
  witness: '#f57c00',
  student: '#455a64'
};

// דמיית דיבור לפרוטוקול
const sampleSpeech = [
  { speaker: 'השופט', role: 'judge', text: 'בית המשפט נפתח. נדון היום בעניין מספר 12345.' },
  { speaker: 'עו״ד התובע', role: 'prosecutor', text: 'כבוד השופט, אני מבקש להציג את התביעה כנגד הנתבע.' },
  { speaker: 'עו״ד הנתבע', role: 'lawyer', text: 'כבוד השופט, אנו מכחישים את האשמות ומבקשים דחיית התביעה.' },
  { speaker: 'השופט', role: 'judge', text: 'אני שומע את הטענות. נתחיל בחקירת העדים.' },
  { speaker: 'העד הראשון', role: 'witness', text: 'אני מעיד כי ראיתי את המקרה באותו יום.' },
  { speaker: 'עו״ד הנתבע', role: 'lawyer', text: 'התנגדות! השאלה מובילה.' },
  { speaker: 'השופט', role: 'judge', text: 'ההתנגדות נדחית. העד יענה על השאלה.' }
];

export const VirtualCourtClerk: React.FC<VirtualCourtClerkProps> = ({
  session,
  onProtocolUpdate
}) => {
  const [protocol, setProtocol] = useState<ProtocolEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50); // מילי שניות בין תווים
  const [handsPosition, setHandsPosition] = useState({ left: 50, right: 50 });
  
  const typingIntervalRef = useRef<NodeJS.Timeout>();
  const speechTimeoutRef = useRef<NodeJS.Timeout>();

  // אנימציית ידיים על המקלדת
  useEffect(() => {
    if (isTyping) {
      const handAnimation = setInterval(() => {
        setHandsPosition(prev => ({
          left: 45 + Math.random() * 10,
          right: 45 + Math.random() * 10
        }));
      }, 200);
      return () => clearInterval(handAnimation);
    }
  }, [isTyping]);

  // הדמיית הקלדה
  const simulateTyping = (text: string, speaker: string, role: string) => {
    setIsTyping(true);
    setCurrentTypingText('');
    
    let charIndex = 0;
    typingIntervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setCurrentTypingText(prev => prev + text[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingIntervalRef.current!);
        setIsTyping(false);
        
        // הוספת הרשומה המלאה לפרוטוקול
        const newEntry: ProtocolEntry = {
          timestamp: new Date(),
          speaker,
          role,
          text
        };
        
        setProtocol(prev => {
          const updated = [...prev, newEntry];
          onProtocolUpdate?.(updated);
          return updated;
        });
        
        setCurrentTypingText('');
        
        // המשך לדיבור הבא
        setTimeout(() => {
          setSpeechIndex(prev => (prev + 1) % sampleSpeech.length);
        }, 2000);
      }
    }, typingSpeed);
  };

  // הפעלת סימולציה
  const startSimulation = () => {
    if (speechIndex < sampleSpeech.length && !isTyping) {
      const currentSpeech = sampleSpeech[speechIndex];
      setIsPlaying(true);
      
      // דמיית זמן דיבור לפני הקלדה
      speechTimeoutRef.current = setTimeout(() => {
        simulateTyping(currentSpeech.text, currentSpeech.speaker, currentSpeech.role);
      }, 1000);
    }
  };

  const pauseSimulation = () => {
    setIsPlaying(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    setIsTyping(false);
  };

  const resetSimulation = () => {
    pauseSimulation();
    setProtocol([]);
    setSpeechIndex(0);
    setCurrentTypingText('');
  };

  const downloadProtocol = () => {
    const protocolText = protocol.map(entry => 
      `[${entry.timestamp.toLocaleTimeString('he-IL')}] ${entry.speaker}: ${entry.text}`
    ).join('\n');
    
    const blob = new Blob([protocolText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol_${new Date().toLocaleDateString('he-IL')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 2 }}>
      {/* כותרת הקלדנית */}
      <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: '#2196f3' }}>
              <PersonIcon />
            </Avatar>
          }
          title="👩‍💼 קלדנית בית המשפט"
          subheader="רושמת פרוטוקול בזמן אמת על בסיס השמיעה"
          action={
            <Box display="flex" gap={1}>
              <Chip 
                label={isTyping ? 'מקלידה...' : isPlaying ? 'מאזינה...' : 'ממתינה'}
                color={isTyping ? 'success' : isPlaying ? 'warning' : 'default'}
                icon={isTyping ? <KeyboardIcon /> : <VolumeIcon />}
              />
            </Box>
          }
        />
      </Card>

      <Box display="flex" gap={3}>
        {/* אזור הקלדנית */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            {/* בקרות */}
            <Box display="flex" gap={2} mb={3} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={startSimulation}
                disabled={isTyping || isPlaying}
                color="success"
              >
                התחל דיון
              </Button>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={pauseSimulation}
                disabled={!isPlaying && !isTyping}
              >
                עצור
              </Button>
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={resetSimulation}
                color="error"
              >
                איפוס
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadProtocol}
                disabled={protocol.length === 0}
              >
                הורד פרוטוקול
              </Button>
            </Box>

            {/* הדמיית מקלדת וידיים */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#263238',
                color: 'white',
                position: 'relative',
                minHeight: 200,
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                🖥️ מסך הקלדנית
              </Typography>
              
              {/* אזור הקלדה נוכחי */}
              <Box 
                sx={{ 
                  backgroundColor: '#37474f',
                  p: 2,
                  borderRadius: 1,
                  minHeight: 100,
                  mb: 2,
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}
              >
                {isTyping && (
                  <Typography variant="body2" sx={{ color: '#4caf50', mb: 1 }}>
                    🎤 שומעת: {sampleSpeech[speechIndex]?.speaker}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentTypingText}
                  {isTyping && <Box component="span" sx={{ animation: 'blink 1s infinite' }}>|</Box>}
                </Typography>
              </Box>

              {/* הדמיית ידיים על מקלדת */}
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>⌨️ מקלדת</Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box sx={{
                    position: 'absolute',
                    left: `${handsPosition.left}%`,
                    top: '-20px',
                    transition: 'left 0.2s ease',
                    fontSize: '20px'
                  }}>
                    ✋
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    left: `${handsPosition.right}%`,
                    top: '-20px',
                    transition: 'left 0.2s ease',
                    fontSize: '20px'
                  }}>
                    🤚
                  </Box>
                  <Box sx={{ 
                    width: 300, 
                    height: 20, 
                    backgroundColor: '#424242',
                    borderRadius: 1,
                    mt: 3
                  }} />
                </Box>
              </Box>

              {/* מהירות הקלדה */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption">
                  מהירות הקלדה: {Math.round(60000 / typingSpeed)} תווים לדקה
                </Typography>
              </Box>
            </Paper>

            {/* התקדמות */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                התקדמות דיון: {speechIndex + 1} / {sampleSpeech.length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={((speechIndex + 1) / sampleSpeech.length) * 100} 
              />
            </Box>
          </CardContent>
        </Card>

        {/* פרוטוקול */}
        <Card sx={{ flex: 1, maxHeight: 600, overflow: 'hidden' }}>
          <CardHeader 
            title="📋 פרוטוקול דיון"
            subheader={`${protocol.length} רשומות נוצרו`}
          />
          <CardContent sx={{ maxHeight: 500, overflow: 'auto' }}>
            {protocol.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                הפרוטוקול יתחיל ברגע שהדיון יתחיל...
              </Typography>
            ) : (
              protocol.map((entry, index) => (
                <Paper 
                  key={index} 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    borderRight: `4px solid ${roleColors[entry.role as keyof typeof roleColors] || '#666'}`
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" sx={{ 
                      color: roleColors[entry.role as keyof typeof roleColors] || '#666',
                      fontWeight: 'bold'
                    }}>
                      {entry.speaker}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.timestamp.toLocaleTimeString('he-IL')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {entry.text}
                  </Typography>
                </Paper>
              ))
            )}
          </CardContent>
        </Card>
      </Box>

      {/* סטיילים לאנימציית הבהוב */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};
