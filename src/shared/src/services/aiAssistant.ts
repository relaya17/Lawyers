import { logger } from '../utils/logger'

// Advanced AI Assistant & Smart Features

interface AIResponse {
    type: 'text' | 'suggestion' | 'action' | 'analysis';
    content: string;
    confidence: number;
    suggestions?: string[];
    actions?: AIAction[];
    metadata?: Record<string, unknown>;
}

interface AIAction {
    type: 'navigate' | 'create' | 'update' | 'delete' | 'analyze';
    target: string;
    parameters?: Record<string, unknown>;
    description: string;
}

interface AIContext {
    userRole: string;
    currentPage: string;
    recentActions: string[];
    contractContext?: Record<string, unknown>;
    learningProgress?: Record<string, unknown>;
    question?: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
}

class AIAssistantService {
    private context: AIContext = {
        userRole: 'lawyer',
        currentPage: '/',
        recentActions: [],
    };
    private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }> = [];
    private isProcessing = false;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        // Load user context from localStorage
        this.loadContext();

        // Set up event listeners for context updates
        this.setupContextListeners();
    }

    private loadContext(): void {
        try {
            const savedContext = localStorage.getItem('ai_context');
            if (savedContext) {
                this.context = { ...this.context, ...JSON.parse(savedContext) };
            }
        } catch (error) {
            logger.warn('Failed to load AI context:', error);
        }
    }

    private saveContext(): void {
        try {
            localStorage.setItem('ai_context', JSON.stringify(this.context));
        } catch (error) {
            logger.warn('Failed to save AI context:', error);
        }
    }

    private setupContextListeners(): void {
        // Listen for route changes
        window.addEventListener('popstate', () => {
            this.updateContext({ currentPage: window.location.pathname });
        });

        // Listen for user actions
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) {
                this.recordAction(`Clicked ${target.textContent || 'button'}`);
            }
        });
    }

    public async askQuestion(question: string): Promise<AIResponse> {
        if (this.isProcessing) {
            return {
                type: 'text',
                content: 'אני עדיין מעבד את השאלה הקודמת. אנא המתן רגע.',
                confidence: 1,
            };
        }

        this.isProcessing = true;

        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: question,
                timestamp: Date.now(),
            });

            // Prepare context for AI
            const aiContext = this.prepareAIContext(question);

            // Send to AI service
            const response = await this.callAIService(question, aiContext);

            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response.content,
                timestamp: Date.now(),
            });

            // Update context based on response
            this.updateContextFromResponse(response);

            return response;
        } catch (error) {
            logger.error('AI Assistant error:', error);
            return {
                type: 'text',
                content: 'מצטער, אירעה שגיאה בעיבוד השאלה שלך. אנא נסה שוב.',
                confidence: 0,
            };
        } finally {
            this.isProcessing = false;
        }
    }

    private prepareAIContext(question: string): AIContext {
        return {
            ...this.context,
            question,
            conversationHistory: this.conversationHistory.slice(-10), // Last 10 messages
        };
    }

    private async callAIService(question: string, context: AIContext): Promise<AIResponse> {
        try {
            const response = await fetch('/api/ai/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    context,
                    timestamp: Date.now(),
                }),
            });

            if (!response.ok) {
                throw new Error(`AI service error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Fallback to mock response for development
            return this.generateMockResponse(question);
        }
    }

    private generateMockResponse(question: string): AIResponse {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('חוזה') || lowerQuestion.includes('contract')) {
            return {
                type: 'suggestion',
                content: 'אני יכול לעזור לך עם ניהול חוזים. מה תרצה לעשות?',
                confidence: 0.9,
                suggestions: [
                    'צור חוזה חדש',
                    'בדוק חוזה קיים',
                    'ניתוח סיכונים',
                    'תבניות חוזים',
                ],
                actions: [
                    {
                        type: 'navigate',
                        target: '/contracts/new',
                        description: 'צור חוזה חדש',
                    },
                ],
            };
        }

        if (lowerQuestion.includes('למידה') || lowerQuestion.includes('learning')) {
            return {
                type: 'suggestion',
                content: 'יש לנו מערכת למידה אדפטיבית. איזה נושא מעניין אותך?',
                confidence: 0.8,
                suggestions: [
                    'דיני חוזים',
                    'ניהול סיכונים',
                    'משא ומתן',
                    'תביעות מסחריות',
                ],
                actions: [
                    {
                        type: 'navigate',
                        target: '/adaptive-learning',
                        description: 'פתח מערכת הלמידה',
                    },
                ],
            };
        }

        if (lowerQuestion.includes('סיכון') || lowerQuestion.includes('risk')) {
            return {
                type: 'analysis',
                content: 'אני יכול לבצע ניתוח סיכונים מתקדם. איזה חוזה תרצה לנתח?',
                confidence: 0.85,
                actions: [
                    {
                        type: 'navigate',
                        target: '/risk-analysis',
                        description: 'פתח ניתוח סיכונים',
                    },
                ],
            };
        }

        return {
            type: 'text',
            content: 'אני כאן כדי לעזור לך עם ניהול חוזים ולמידה משפטית. איך אוכל לסייע?',
            confidence: 0.7,
            suggestions: [
                'צור חוזה חדש',
                'בדוק ניתוח סיכונים',
                'פתח מערכת למידה',
                'בדוק תבניות חוזים',
            ],
        };
    }

    public async analyzeContract(contractText: string): Promise<AIResponse> {
        try {
            const response = await fetch('/api/ai/analyze-contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contractText,
                    context: this.context,
                }),
            });

            if (!response.ok) {
                throw new Error(`Contract analysis error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            logger.error('Contract analysis error:', error);
            return {
                type: 'analysis',
                content: 'לא הצלחתי לנתח את החוזה כרגע. אנא נסה שוב מאוחר יותר.',
                confidence: 0,
            };
        }
    }

    public async generateContractSuggestion(context: string): Promise<AIResponse> {
        try {
            const response = await fetch('/api/ai/generate-suggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context,
                    userRole: this.context.userRole,
                    recentActions: this.context.recentActions,
                }),
            });

            if (!response.ok) {
                throw new Error(`Suggestion generation error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            logger.error('Suggestion generation error:', error);
            return {
                type: 'suggestion',
                content: 'לא הצלחתי ליצור הצעה כרגע. אנא נסה שוב מאוחר יותר.',
                confidence: 0,
            };
        }
    }

    public async getSmartRecommendations(): Promise<AIResponse> {
        const recommendations = [] as string[];

        // Based on user role
        if (this.context.userRole === 'lawyer') {
            recommendations.push('בדוק חוזים שדורשים עדכון');
            recommendations.push('ניתוח סיכונים לחוזים פעילים');
        } else if (this.context.userRole === 'student') {
            recommendations.push('המשך למידה בנושא דיני חוזים');
            recommendations.push('תרגול ניתוח חוזים');
        }

        // Based on current page
        if (this.context.currentPage === '/contracts') {
            recommendations.push('צור חוזה חדש');
            recommendations.push('בדוק חוזים שפג תוקפם');
        }

        // Based on recent actions
        if (this.context.recentActions.includes('contract_created')) {
            recommendations.push('הוסף סעיפי ביטחון לחוזה');
            recommendations.push('בדוק תאימות עם תקנות');
        }

        return {
            type: 'suggestion',
            content: 'המלצות מותאמות אישית:',
            confidence: 0.8,
            suggestions: recommendations,
        };
    }

    private updateContext(updates: Partial<AIContext>): void {
        this.context = { ...this.context, ...updates };
        this.saveContext();
    }

    private recordAction(action: string): void {
        this.context.recentActions.push(action);
        if (this.context.recentActions.length > 10) {
            this.context.recentActions = this.context.recentActions.slice(-10);
        }
        this.saveContext();
    }

    private updateContextFromResponse(response: AIResponse): void {
        if (response.actions) {
            response.actions.forEach(action => {
                if (action.type === 'navigate') {
                    this.updateContext({ currentPage: action.target });
                }
            });
        }
    }

    public setUserRole(role: string): void {
        this.updateContext({ userRole: role });
    }

    public setContractContext(contract: Record<string, unknown>): void {
        this.context.contractContext = contract
        this.saveContext()
    }

    public setLearningProgress(progress: Record<string, unknown>): void {
        this.context.learningProgress = progress
        this.saveContext()
    }

    public getConversationHistory(): Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }> {
        return [...this.conversationHistory];
    }

    public clearConversationHistory(): void {
        this.conversationHistory = [];
    }

    public getProcessingStatus(): boolean {
        return this.isProcessing;
    }
}

// Export singleton instance
export const aiAssistant = new AIAssistantService();

// Hook for React components
export const useAIAssistant = () => {
    return {
        askQuestion: aiAssistant.askQuestion.bind(aiAssistant),
        analyzeContract: aiAssistant.analyzeContract.bind(aiAssistant),
        generateContractSuggestion: aiAssistant.generateContractSuggestion.bind(aiAssistant),
        getSmartRecommendations: aiAssistant.getSmartRecommendations.bind(aiAssistant),
        setUserRole: aiAssistant.setUserRole.bind(aiAssistant),
        setContractContext: aiAssistant.setContractContext.bind(aiAssistant),
        setLearningProgress: aiAssistant.setLearningProgress.bind(aiAssistant),
        getConversationHistory: aiAssistant.getConversationHistory.bind(aiAssistant),
        clearConversationHistory: aiAssistant.clearConversationHistory.bind(aiAssistant),
        isProcessing: () => aiAssistant.getProcessingStatus(),
    };
};
