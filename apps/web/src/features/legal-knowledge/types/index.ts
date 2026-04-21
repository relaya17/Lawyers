// Legal Knowledge Types
export interface LegalCase {
    id: string;
    title: string;
    description: string;
    scenario: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    category: 'law-vs-basic-law' | 'custom-vs-legislation' | 'pardon-vs-ruling' | 'general';
    options: CaseOption[];
    correctAnswer: string;
    explanation: string;
    legalBasis: LegalBasis[];
    precedents: Precedent[];
    timeLimit?: number; // for Quiz Blitz
}

export interface CaseOption {
    id: string;
    text: string;
    reasoning: string;
}

export interface LegalBasis {
    type: 'basic-law' | 'regular-law' | 'regulation' | 'custom' | 'precedent';
    source: string;
    text: string;
    icon: '⚖️' | '📜' | '✨' | '📌' | '🏛';
}

export interface Precedent {
    id: string;
    caseName: string;
    year: number;
    court: string;
    ruling: string;
    relevance: string;
}

export interface Flashcard {
    id: string;
    term: string;
    definition: string;
    category: LegalCategory;
    examples: string[];
    relatedCases: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    knownStatus: 'known' | 'needs-practice' | 'unknown';
}

export interface QuizQuestion {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer' | 'case-study';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    category: LegalCategory;
    timeLimit?: number;
    points: number;
    legalBasis: LegalBasis[];
}

export interface GameSession {
    id: string;
    type: 'law-vs-custom' | 'quiz-blitz' | 'court-simulator';
    startTime: Date;
    endTime?: Date;
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    timeBonus?: number;
}

export interface UserProgress {
    userId: string;
    categoryProgress: Record<LegalCategory, CategoryProgress>;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    averageTimePerQuestion: number;
    strongAreas: LegalCategory[];
    weakAreas: LegalCategory[];
    recommendedStudy: string[];
    achievements: Achievement[];
}

export interface CategoryProgress {
    category: LegalCategory;
    questionsAnswered: number;
    correctAnswers: number;
    averageTime: number;
    lastStudied: Date;
    masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    category?: LegalCategory;
}

export interface CourtCase {
    id: string;
    title: string;
    petition: string;
    facts: string[];
    legalQuestions: string[];
    possibleRulings: CourtRuling[];
    actualRuling?: CourtRuling;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    estimatedTime: number;
}

export interface CourtRuling {
    id: string;
    decision: string;
    reasoning: string;
    legalPrinciples: string[];
    precedentsUsed: Precedent[];
    futureImplications: string[];
}

export type LegalCategory =
    | 'laws'
    | 'precedents'
    | 'customs'
    | 'comparative-law'
    | 'interpretations'
    | 'constitutional-law'
    | 'civil-law'
    | 'criminal-law'
    | 'administrative-law';

export interface LegalHierarchy {
    level: number;
    type: 'basic-law' | 'regular-law' | 'regulation' | 'custom' | 'precedent';
    title: string;
    description: string;
    examples: string[];
    overrides: string[];
    overriddenBy: string[];
}

export interface StudySession {
    id: string;
    userId: string;
    type: 'flashcards' | 'quiz' | 'case-study' | 'game' | 'court-simulation';
    startTime: Date;
    endTime?: Date;
    itemsStudied: string[];
    performance: SessionPerformance;
    notes?: string;
}

export interface SessionPerformance {
    totalItems: number;
    completedItems: number;
    correctAnswers: number;
    averageTime: number;
    score: number;
    improvements: string[];
}

export interface InteractiveSummary {
    id: string;
    title: string;
    category: LegalCategory;
    mapData: LegalSourceMap;
    keyPoints: string[];
    connections: LegalConnection[];
    exercises: string[];
}

export interface LegalSourceMap {
    nodes: LegalNode[];
    connections: MapConnection[];
}

export interface LegalNode {
    id: string;
    type: 'basic-law' | 'regular-law' | 'regulation' | 'custom' | 'precedent';
    title: string;
    description: string;
    position: { x: number; y: number };
    icon: string;
    color: string;
}

export interface MapConnection {
    from: string;
    to: string;
    type: 'overrides' | 'supports' | 'conflicts' | 'clarifies';
    strength: number;
}

export interface LegalConnection {
    source: string;
    target: string;
    relationship: string;
    examples: string[];
}
