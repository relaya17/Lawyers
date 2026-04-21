import { ContractType, Difficulty } from '../types/index';

export interface UserLearningProfile {
    userId: string;
    contractTypes: Record<ContractType, {
        totalAttempts: number;
        correctAnswers: number;
        averageTime: number;
        difficultyProgress: Record<Difficulty, {
            completed: number;
            correct: number;
            averageScore: number;
        }>;
        weakAreas: string[];
        strongAreas: string[];
    }>;
    preferences: {
        preferredContractTypes: ContractType[];
        preferredDifficulty: Difficulty;
        learningStyle: 'visual' | 'textual' | 'interactive';
        timePerQuestion: number;
    };
    recentActivity: {
        lastPracticeDate: Date;
        practiceStreak: number;
        totalPracticeTime: number;
    };
}

export interface AdaptiveQuestion {
    id: string;
    originalQuestion: string;
    adaptedQuestion: string;
    difficulty: Difficulty;
    category: string;
    hints: string[];
    explanation: string;
    relatedQuestions: string[];
    learningPath: {
        prerequisites: string[];
        nextSteps: string[];
    };
}

export interface PersonalizedRecommendation {
    type: 'question' | 'practice' | 'review' | 'challenge';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
    expectedOutcome: string;
    relatedTopics: string[];
}

export interface LearningAnalytics {
    overallProgress: number;
    strengthAreas: string[];
    improvementAreas: string[];
    recommendedFocus: string[];
    nextMilestone: string;
    estimatedTimeToMastery: number;
}

class AdaptiveLearningService {
    private userProfiles: Map<string, UserLearningProfile> = new Map();

    // Initialize or get user learning profile
    async getUserProfile(userId: string): Promise<UserLearningProfile> {
        if (!this.userProfiles.has(userId)) {
            this.userProfiles.set(userId, this.createDefaultProfile(userId));
        }
        return this.userProfiles.get(userId)!;
    }

    // Update user profile based on performance
    async updateUserPerformance(
        userId: string,
        contractType: ContractType,
        difficulty: Difficulty,
        questionId: string,
        isCorrect: boolean,
        timeSpent: number,
        category: string
    ): Promise<void> {
        const profile = await this.getUserProfile(userId);
        const contractData = profile.contractTypes[contractType];

        // Update statistics
        contractData.totalAttempts++;
        if (isCorrect) contractData.correctAnswers++;
        contractData.averageTime = (contractData.averageTime + timeSpent) / 2;

        // Update difficulty progress
        const difficultyData = contractData.difficultyProgress[difficulty];
        difficultyData.completed++;
        if (isCorrect) difficultyData.correct++;
        difficultyData.averageScore = (difficultyData.correct / difficultyData.completed) * 100;

        // Update weak/strong areas
        if (isCorrect) {
            if (!contractData.strongAreas.includes(category)) {
                contractData.strongAreas.push(category);
            }
        } else {
            if (!contractData.weakAreas.includes(category)) {
                contractData.weakAreas.push(category);
            }
        }

        // Update recent activity
        profile.recentActivity.lastPracticeDate = new Date();
        profile.recentActivity.practiceStreak++;
        profile.recentActivity.totalPracticeTime += timeSpent;

        this.userProfiles.set(userId, profile);
    }

    // Generate personalized questions based on user profile
    async generateAdaptiveQuestions(
        userId: string,
        contractType: ContractType,
        count: number = 5
    ): Promise<AdaptiveQuestion[]> {
        const profile = await this.getUserProfile(userId);
        const contractData = profile.contractTypes[contractType];

        // Determine optimal difficulty based on performance
        const optimalDifficulty = this.calculateOptimalDifficulty(contractData);

        // Generate questions focusing on weak areas
        const questions: AdaptiveQuestion[] = [];
        const weakAreas = contractData.weakAreas.slice(0, 2); // Focus on top 2 weak areas

        for (let i = 0; i < count; i++) {
            const category = weakAreas[i % weakAreas.length] || 'General';
            questions.push({
                id: `adaptive_${userId}_${contractType}_${i}`,
                originalQuestion: `Original question for ${category}`,
                adaptedQuestion: this.adaptQuestionForUser(profile, category, optimalDifficulty),
                difficulty: optimalDifficulty,
                category,
                hints: this.generatePersonalizedHints(profile, category),
                explanation: `Detailed explanation for ${category} in ${contractType}`,
                relatedQuestions: this.findRelatedQuestions(category, contractType),
                learningPath: {
                    prerequisites: this.getPrerequisites(category, contractType),
                    nextSteps: this.getNextSteps(category, contractType)
                }
            });
        }

        return questions;
    }

    // Get personalized recommendations
    async getPersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
        const profile = await this.getUserProfile(userId);
        const recommendations: PersonalizedRecommendation[] = [];

        // Analyze weak areas and suggest focused practice
        Object.entries(profile.contractTypes).forEach(([contractType, data]) => {
            if (data.weakAreas.length > 0) {
                recommendations.push({
                    type: 'practice',
                    title: `תרגול ${contractType} - ${data.weakAreas[0]}`,
                    description: `התמקד באזור החלש שלך: ${data.weakAreas[0]}`,
                    priority: 'high',
                    estimatedTime: 15,
                    expectedOutcome: 'שיפור הבנה של נושא זה',
                    relatedTopics: data.weakAreas
                });
            }
        });

        // Suggest review of strong areas to maintain knowledge
        Object.entries(profile.contractTypes).forEach(([contractType, data]) => {
            if (data.strongAreas.length > 0 && data.totalAttempts > 10) {
                recommendations.push({
                    type: 'review',
                    title: `חזרה על ${contractType} - ${data.strongAreas[0]}`,
                    description: 'חזור על נושאים חזקים כדי לשמור על הידע',
                    priority: 'medium',
                    estimatedTime: 10,
                    expectedOutcome: 'חיזוק הידע הקיים',
                    relatedTopics: data.strongAreas
                });
            }
        });

        // Suggest challenges for advanced users
        if (profile.recentActivity.practiceStreak > 5) {
            recommendations.push({
                type: 'challenge',
                title: 'אתגר יומי - שאלות מורכבות',
                description: 'נסה שאלות ברמת קושי גבוהה יותר',
                priority: 'medium',
                estimatedTime: 20,
                expectedOutcome: 'הרחבת הידע והמיומנויות',
                relatedTopics: ['Advanced Topics', 'Complex Scenarios']
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    // Get learning analytics
    async getLearningAnalytics(userId: string): Promise<LearningAnalytics> {
        const profile = await this.getUserProfile(userId);

        // Calculate overall progress
        let totalCorrect = 0;
        let totalAttempts = 0;

        Object.values(profile.contractTypes).forEach(contractData => {
            totalCorrect += contractData.correctAnswers;
            totalAttempts += contractData.totalAttempts;
        });

        const overallProgress = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

        // Identify strength and improvement areas
        const allWeakAreas = new Set<string>();
        const allStrongAreas = new Set<string>();

        Object.values(profile.contractTypes).forEach(contractData => {
            contractData.weakAreas.forEach(area => allWeakAreas.add(area));
            contractData.strongAreas.forEach(area => allStrongAreas.add(area));
        });

        // Remove areas that are both weak and strong (conflicting data)
        allWeakAreas.forEach(area => {
            if (allStrongAreas.has(area)) {
                allWeakAreas.delete(area);
                allStrongAreas.delete(area);
            }
        });

        return {
            overallProgress,
            strengthAreas: Array.from(allStrongAreas),
            improvementAreas: Array.from(allWeakAreas),
            recommendedFocus: Array.from(allWeakAreas).slice(0, 3),
            nextMilestone: this.calculateNextMilestone(overallProgress),
            estimatedTimeToMastery: this.estimateTimeToMastery(profile)
        };
    }

    // Private helper methods
    private createDefaultProfile(userId: string): UserLearningProfile {
        const defaultContractData = {
            totalAttempts: 0,
            correctAnswers: 0,
            averageTime: 0,
            difficultyProgress: {
                easy: { completed: 0, correct: 0, averageScore: 0 },
                medium: { completed: 0, correct: 0, averageScore: 0 },
                hard: { completed: 0, correct: 0, averageScore: 0 }
            },
            weakAreas: [],
            strongAreas: []
        };

        return {
            userId,
            contractTypes: {
                rental: { ...defaultContractData },
                service: { ...defaultContractData },
                employment: { ...defaultContractData },
                purchase: { ...defaultContractData },
                partnership: { ...defaultContractData },
                nda: { ...defaultContractData },
                license: { ...defaultContractData },
                franchise: { ...defaultContractData },
                consulting: { ...defaultContractData },
                other: { ...defaultContractData }
            },
            preferences: {
                preferredContractTypes: [],
                preferredDifficulty: 'easy',
                learningStyle: 'interactive',
                timePerQuestion: 120
            },
            recentActivity: {
                lastPracticeDate: new Date(),
                practiceStreak: 0,
                totalPracticeTime: 0
            }
        };
    }

    private calculateOptimalDifficulty(contractData: UserLearningProfile['contractTypes'][ContractType]): Difficulty {
        const easyScore = contractData.difficultyProgress.easy.averageScore;
        const mediumScore = contractData.difficultyProgress.medium.averageScore;
        const hardScore = contractData.difficultyProgress.hard.averageScore;

        if (easyScore >= 80 && mediumScore < 70) return 'medium';
        if (mediumScore >= 75 && hardScore < 65) return 'hard';
        if (hardScore >= 70) return 'hard';
        if (mediumScore >= 60) return 'medium';
        return 'easy';
    }

    private adaptQuestionForUser(profile: UserLearningProfile, category: string, difficulty: Difficulty): string {
        const learningStyle = profile.preferences.learningStyle;
        const difficultyText = difficulty === 'easy' ? 'בסיסי' : difficulty === 'medium' ? 'בינוני' : 'מתקדם';

        if (learningStyle === 'visual') {
            return `[תמונה/דיאגרמה] ${category} - שאלה ${difficultyText} מותאמת למשתמש ויזואלי`;
        } else if (learningStyle === 'textual') {
            return `${category} - שאלה ${difficultyText} מפורטת עם הסברים נרחבים`;
        } else {
            return `${category} - שאלה ${difficultyText} אינטראקטיבית עם תרחישים מעשיים`;
        }
    }

    private generatePersonalizedHints(profile: UserLearningProfile, category: string): string[] {
        const hints = [
            `רמז מותאם אישית ל-${category}`,
            `תבסס על הביצועים שלך ב-${category}`,
            'הצעה לשיפור הבנת הנושא'
        ];

        if (profile.recentActivity.practiceStreak > 3) {
            hints.push('רמז מתקדם למשתמש מנוסה');
        }

        return hints;
    }

    private findRelatedQuestions(category: string, contractType: ContractType): string[] {
        return [
            `${category} - שאלה דומה 1`,
            `${category} - שאלה דומה 2`,
            `${contractType} - נושא קשור`
        ];
    }

    private getPrerequisites(category: string, contractType: ContractType): string[] {
        return [
            `ידע בסיסי ב-${contractType}`,
            `הבנת מושגי ${category}`
        ];
    }

    private getNextSteps(category: string, contractType: ContractType): string[] {
        return [
            `הרחבת ידע ב-${category}`,
            `יישום מעשי ב-${contractType}`,
            'נושאים מתקדמים'
        ];
    }

    private calculateNextMilestone(progress: number): string {
        if (progress < 50) return 'השלמת 50% מהשאלות';
        if (progress < 75) return 'השלמת 75% מהשאלות';
        if (progress < 90) return 'השלמת 90% מהשאלות';
        return 'השלמת כל השאלות - מומחיות!';
    }

    private estimateTimeToMastery(profile: UserLearningProfile): number {
        const totalTime = profile.recentActivity.totalPracticeTime;
        const totalAttempts = Object.values(profile.contractTypes)
            .reduce((sum, data) => sum + data.totalAttempts, 0);

        if (totalAttempts === 0) return 60; // 1 hour for new users

        const averageTimePerQuestion = totalTime / totalAttempts;
        const remainingQuestions = 100 - totalAttempts; // Assuming 100 questions for mastery

        return Math.round(remainingQuestions * averageTimePerQuestion / 60); // Convert to minutes
    }
}

export const adaptiveLearningService = new AdaptiveLearningService();
