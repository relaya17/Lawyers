import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    LinearProgress,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import type { LegalExamInteractionMode, StandardLegalQuestion } from './standardLegalQuestion';

export interface LegalExamRunnerProps {
    mode: LegalExamInteractionMode;
    title: string;
    titleEmoji?: string;
    questions: StandardLegalQuestion[];
}

function getDifficultyColor(difficulty: string): 'success' | 'warning' | 'error' | 'default' {
    switch (difficulty) {
        case 'קל':
            return 'success';
        case 'בינוני':
            return 'warning';
        case 'קשה':
        case 'קשה מאוד':
            return 'error';
        default:
            return 'default';
    }
}

export const LegalExamRunner: React.FC<LegalExamRunnerProps> = ({
    mode,
    title,
    titleEmoji = '📋',
    questions,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [examCompleted, setExamCompleted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];
    const practiceRevealed =
        mode === 'practice' && selectedAnswers[currentQuestion.id] !== undefined;

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: answer,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            finishExam();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const finishExam = () => {
        let correctAnswers = 0;
        questions.forEach((question) => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setExamCompleted(true);
    };

    const resetExam = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setExamCompleted(false);
        setScore(0);
    };

    const optionStyle = useCallback(
        (optionId: string) => {
            if (mode !== 'practice' || !practiceRevealed) {
                return { mb: 1, borderRadius: 1, px: 1, py: 0.5, transition: 'background 0.2s' };
            }
            const correct = optionId === currentQuestion.correctAnswer;
            const selected = optionId === selectedAnswers[currentQuestion.id];
            let bgcolor = 'transparent';
            let border = '1px solid transparent';
            if (correct) {
                bgcolor = 'rgba(46, 125, 50, 0.12)';
                border = '1px solid #2e7d32';
            } else if (selected && !correct) {
                bgcolor = 'rgba(211, 47, 47, 0.1)';
                border = '1px solid #c62828';
            }
            return {
                mb: 1,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                bgcolor,
                border,
                transition: 'background 0.2s',
            };
        },
        [mode, practiceRevealed, currentQuestion, selectedAnswers],
    );

    const tfStyle = useCallback(
        (value: 'true' | 'false') => {
            if (mode !== 'practice' || !practiceRevealed) {
                return { mb: 1, borderRadius: 1, px: 1, py: 0.5 };
            }
            const correct = value === currentQuestion.correctAnswer;
            const selected = value === selectedAnswers[currentQuestion.id];
            let bgcolor = 'transparent';
            let border = '1px solid transparent';
            if (correct) {
                bgcolor = 'rgba(46, 125, 50, 0.12)';
                border = '1px solid #2e7d32';
            } else if (selected && !correct) {
                bgcolor = 'rgba(211, 47, 47, 0.1)';
                border = '1px solid #c62828';
            }
            return { mb: 1, borderRadius: 1, px: 1, py: 0.5, bgcolor, border };
        },
        [mode, practiceRevealed, currentQuestion, selectedAnswers],
    );

    const isCorrectSelection = useMemo(() => {
        if (!practiceRevealed) return null;
        return selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;
    }, [practiceRevealed, selectedAnswers, currentQuestion]);

    if (examCompleted) {
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card elevation={4}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            {titleEmoji} {title} — הושלם
                        </Typography>

                        <Box sx={{ my: 3 }}>
                            <Typography variant="h2" color={percentage >= 70 ? 'success.main' : 'error.main'}>
                                {score}/{questions.length}
                            </Typography>
                            <Typography variant="h5" color="text.secondary">
                                {percentage}%
                            </Typography>
                        </Box>

                        <Alert severity={percentage >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
                            {percentage >= 70
                                ? 'כל הכבוד! רמת הבנה טובה של החומר.'
                                : 'מומלץ לעבור שוב על התשובות השגויות במצב תרגול, עם ההסברים המלאים.'}
                        </Alert>

                        <Button variant="contained" onClick={resetExam}>
                            מבחן חדש
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            {titleEmoji} {title}
                        </Typography>
                        {mode === 'practice' && (
                            <Chip
                                icon={<SchoolIcon />}
                                label="מצב תרגול — משוב מיידי והסבר מלא אחרי כל בחירה"
                                color="success"
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        )}
                        <Typography variant="body1" color="text.secondary">
                            שאלה {currentQuestionIndex + 1} מתוך {questions.length}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={((currentQuestionIndex + 1) / questions.length) * 100}
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6">{currentQuestion.icon}</Typography>
                            <Chip label={currentQuestion.category} color="primary" variant="outlined" />
                            <Chip
                                label={currentQuestion.difficulty}
                                color={getDifficultyColor(currentQuestion.difficulty)}
                                size="small"
                            />
                        </Box>

                        <Typography variant="h6" paragraph sx={{ lineHeight: 1.6 }}>
                            {currentQuestion.question}
                        </Typography>

                        {currentQuestion.options && currentQuestion.type !== 'true-false' && (
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={selectedAnswers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswerSelect(e.target.value)}
                                >
                                    {currentQuestion.options.map((option) => (
                                        <Paper key={option.id} variant="outlined" sx={optionStyle(option.id)}>
                                            <FormControlLabel
                                                value={option.id}
                                                control={<Radio />}
                                                label={option.text}
                                                sx={{ m: 0, width: '100%' }}
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}

                        {currentQuestion.type === 'true-false' && (
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={selectedAnswers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswerSelect(e.target.value)}
                                >
                                    <Paper variant="outlined" sx={tfStyle('true')}>
                                        <FormControlLabel value="true" control={<Radio />} label="נכון" sx={{ m: 0 }} />
                                    </Paper>
                                    <Paper variant="outlined" sx={tfStyle('false')}>
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio />}
                                            label="לא נכון"
                                            sx={{ m: 0 }}
                                        />
                                    </Paper>
                                </RadioGroup>
                            </FormControl>
                        )}
                    </Box>

                    {mode === 'practice' && practiceRevealed && (
                        <Alert
                            severity={isCorrectSelection ? 'success' : 'error'}
                            icon={isCorrectSelection ? <CheckCircleIcon /> : <CancelIcon />}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                {isCorrectSelection ? 'תשובה נכונה' : 'תשובה שגויה — לעומת התשובה הנכונה'}
                            </Typography>
                            {!isCorrectSelection && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    בחרת תשובה אחרת מהנדרש לפי הדין והפסיקה הרלוונטיים.
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                הסבר מלא
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                                {currentQuestion.explanation}
                            </Typography>
                            {currentQuestion.lawReference && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>מקור חוקי:</strong> {currentQuestion.lawReference}
                                </Typography>
                            )}
                            {currentQuestion.precedent && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>פסיקה / מקרים:</strong> {currentQuestion.precedent}
                                </Typography>
                            )}
                            {currentQuestion.academicNote && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        הקשר אקדמי (רמת סמינר)
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                                        {currentQuestion.academicNote}
                                    </Typography>
                                </Box>
                            )}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                            שאלה קודמת
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!selectedAnswers[currentQuestion.id] || (mode === 'practice' && !practiceRevealed)}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'סיום מבחן' : 'שאלה הבאה'}
                        </Button>
                    </Box>

                </CardContent>
            </Card>
        </Container>
    );
};

/** מפעיל רכיב מבחן סטנדרטי ממערך שאלות קיים בקובץ. `studyMode` מגיע מעמוד ידע משפטי (מבחן / תרגול). */
export function defineLegalExam(config: {
    title: string;
    emoji?: string;
    questions: StandardLegalQuestion[];
}): React.FC<{ studyMode?: LegalExamInteractionMode }> {
    const Comp: React.FC<{ studyMode?: LegalExamInteractionMode }> = ({ studyMode = 'exam' }) => (
        <LegalExamRunner mode={studyMode} title={config.title} titleEmoji={config.emoji} questions={config.questions} />
    );
    return Comp;
}
