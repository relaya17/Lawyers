import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Chip, 
  Button,
  Collapse,
  IconButton,
  Paper,
  Tooltip,
  LinearProgress,
  Badge
} from '@mui/material';
import { 
  ExpandMore as ExpandIcon,
  Quiz as QuizIcon,
  Lightbulb as TipIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon
} from '@mui/icons-material';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    progress: number; // 0-100
    examples: string[];
    tips: string[];
    questionsCount: number;
    completedQuestions: number;
    lastStudied?: Date;
    isBookmarked: boolean;
  };
  onStartQuiz: (topicId: string) => void;
  onStartLesson: (topicId: string) => void;
  onToggleBookmark: (topicId: string) => void;
}

const difficultyConfig = {
  easy: { label: 'קל', color: '#4caf50' },
  medium: { label: 'בינוני', color: '#ff9800' },
  hard: { label: 'קשה', color: '#f44336' },
  'very-hard': { label: 'קשה מאוד', color: '#9c27b0' }
};

export const InteractiveTopicCard: React.FC<TopicCardProps> = ({
  topic,
  onStartQuiz,
  onStartLesson,
  onToggleBookmark
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const difficultyInfo = difficultyConfig[topic.difficulty];
  const completionRate = topic.questionsCount > 0 ? 
    Math.round((topic.completedQuestions / topic.questionsCount) * 100) : 0;

  return (
    <Card 
      sx={{ 
        mb: 3,
        borderLeft: `6px solid ${topic.color}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardHeader
        avatar={
          <Box sx={{ 
            fontSize: '2rem',
            p: 1,
            borderRadius: '50%',
            backgroundColor: `${topic.color}20`,
            color: topic.color
          }}>
            {topic.icon}
          </Box>
        }
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {topic.title}
            </Typography>
            <Chip 
              label={difficultyInfo.label}
              size="small"
              sx={{ 
                backgroundColor: difficultyInfo.color,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            {topic.progress === 100 && (
              <Tooltip title="נושא הושלם">
                <CheckIcon sx={{ color: '#4caf50' }} />
              </Tooltip>
            )}
          </Box>
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={() => onToggleBookmark(topic.id)}
              color={topic.isBookmarked ? 'primary' : 'default'}
            >
              {topic.isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
            </IconButton>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandIcon />
            </IconButton>
          </Box>
        }
        subheader={
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {topic.description}
            </Typography>
            
            {/* התקדמות */}
            <Box sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  התקדמות: {topic.progress}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {topic.completedQuestions}/{topic.questionsCount} שאלות
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={topic.progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: topic.color
                  }
                }}
              />
            </Box>

            {/* סטטיסטיקות מהירות */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                label={`${completionRate}% הושלם`}
                size="small"
                color={completionRate === 100 ? 'success' : 'default'}
                variant="outlined"
              />
              {topic.lastStudied && (
                <Chip 
                  label={`נלמד לאחרונה: ${topic.lastStudied.toLocaleDateString('he-IL')}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Box display="flex" gap={2} mb={3}>
            {/* כפתורי פעולה */}
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={() => onStartLesson(topic.id)}
              sx={{ 
                backgroundColor: topic.color,
                '&:hover': { backgroundColor: `${topic.color}dd` }
              }}
            >
              התחל לימוד
            </Button>
            
            <Badge badgeContent={topic.questionsCount} color="primary">
              <Button
                variant="outlined"
                startIcon={<QuizIcon />}
                onClick={() => onStartQuiz(topic.id)}
                sx={{ borderColor: topic.color, color: topic.color }}
              >
                מבחן
              </Button>
            </Badge>

            <Button
              variant="text"
              startIcon={<TipIcon />}
              onClick={() => setShowTips(!showTips)}
              sx={{ color: topic.color }}
            >
              טיפים
            </Button>
          </Box>

          {/* דוגמאות */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom sx={{ color: topic.color }}>
              📚 דוגמאות מעשיות
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {topic.examples.map((example, index) => (
                <Paper 
                  key={index} 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f8f9fa',
                    borderRight: `3px solid ${topic.color}`
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    💡 {example}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* טיפים */}
          <Collapse in={showTips} timeout="auto">
            <Box mb={2}>
              <Typography variant="h6" gutterBottom sx={{ color: topic.color }}>
                💡 טיפים ללמידה
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {topic.tips.map((tip, index) => (
                  <Paper 
                    key={index} 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      backgroundColor: '#fff3e0',
                      border: `1px solid ${topic.color}40`
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      lineHeight: 1.6,
                      fontStyle: 'italic' 
                    }}>
                      🎯 {tip}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Collapse>
    </Card>
  );
};
