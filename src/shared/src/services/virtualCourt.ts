import { ContractType, Difficulty } from '../types/index';

export interface VirtualCourtSession {
    id: string;
    userId: string;
    sessionType: 'negotiation' | 'arbitration' | 'mediation' | 'mock_trial';
    contractType: ContractType;
    difficulty: Difficulty;
    participants: VirtualParticipant[];
    currentPhase: CourtPhase;
    timeline: CourtEvent[];
    evidence: Evidence[];
    rulings: Ruling[];
    chat: ChatMessage[];
    isActive: boolean;
    startTime: Date;
    endTime?: Date;
}

export interface VirtualParticipant {
    id: string;
    name: string;
    role: 'judge' | 'arbitrator' | 'mediator' | 'plaintiff' | 'defendant' | 'witness' | 'expert';
    isAI: boolean;
    personality: ParticipantPersonality;
    expertise: string[];
    currentPosition: string;
    negotiationStyle: 'aggressive' | 'collaborative' | 'competitive' | 'accommodating' | 'avoiding';
}

export interface ParticipantPersonality {
    communicationStyle: 'formal' | 'casual' | 'technical' | 'persuasive';
    decisionMaking: 'analytical' | 'intuitive' | 'consensus' | 'authoritative';
    riskTolerance: 'low' | 'medium' | 'high';
    patience: 'low' | 'medium' | 'high';
    empathy: 'low' | 'medium' | 'high';
}

export interface CourtPhase {
    id: string;
    name: string;
    description: string;
    duration: number; // minutes
    isCompleted: boolean;
    currentStep: number;
    totalSteps: number;
    actions: CourtAction[];
}

export interface CourtAction {
    id: string;
    type: 'presentation' | 'question' | 'objection' | 'ruling' | 'negotiation' | 'break';
    participantId: string;
    title: string;
    description: string;
    content: string;
    timestamp: Date;
    duration: number;
    isCompleted: boolean;
    responses: ActionResponse[];
}

export interface ActionResponse {
    id: string;
    participantId: string;
    content: string;
    timestamp: Date;
    type: 'agreement' | 'disagreement' | 'question' | 'suggestion' | 'objection';
}

export interface CourtEvent {
    id: string;
    type: 'phase_start' | 'phase_end' | 'action' | 'break' | 'ruling' | 'negotiation';
    title: string;
    description: string;
    timestamp: Date;
    participants: string[];
    outcome?: string;
}

export interface Evidence {
    id: string;
    type: 'document' | 'testimony' | 'expert_report' | 'contract' | 'email' | 'financial_record';
    title: string;
    description: string;
    submittedBy: string;
    submittedAt: Date;
    relevance: 'high' | 'medium' | 'low';
    admissibility: 'admitted' | 'excluded' | 'pending';
    content: string;
    attachments: string[];
}

export interface Ruling {
    id: string;
    type: 'procedural' | 'substantive' | 'final';
    title: string;
    description: string;
    issuedBy: string;
    issuedAt: Date;
    reasoning: string;
    outcome: string;
    impact: 'positive' | 'negative' | 'neutral';
    precedentialValue: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'system' | 'ai_suggestion';
}

export interface NegotiationScenario {
    id: string;
    title: string;
    hebrewTitle: string;
    description: string;
    contractType: ContractType;
    difficulty: Difficulty;
    parties: {
        party1: {
            name: string;
            role: string;
            interests: string[];
            constraints: string[];
            bottomLine: string;
        };
        party2: {
            name: string;
            role: string;
            interests: string[];
            constraints: string[];
            bottomLine: string;
        };
    };
    issues: NegotiationIssue[];
    timeLimit: number; // minutes
    successCriteria: string[];
}

export interface CourtScenario extends NegotiationScenario {
    courtType?: 'civil' | 'criminal' | 'family' | 'commercial' | 'labor' | 'arbitration';
    duration?: number;
    participants?: Array<{ role: string; name: string; isAI: boolean }>;
    evidence?: Array<{ type: string; title: string; relevance: string }>;
    phases?: string[];
}

export interface NegotiationIssue {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    positions: {
        party1: string;
        party2: string;
    };
    possibleSolutions: string[];
    value: number; // points or money
}

export interface NegotiationSession {
    id: string;
    scenarioId: string;
    userId: string;
    startTime: Date;
    currentRound: number;
    totalRounds: number;
    offers: NegotiationOffer[];
    agreements: NegotiationAgreement[];
    timeRemaining: number;
    isCompleted: boolean;
    outcome: 'agreement' | 'impasse' | 'timeout' | 'arbitration';
}

export interface NegotiationOffer {
    id: string;
    round: number;
    fromParty: string;
    toParty: string;
    content: string;
    issues: {
        issueId: string;
        proposedValue: string;
        reasoning: string;
    }[];
    timestamp: Date;
    isAccepted: boolean;
    counterOffer?: NegotiationOffer;
}

export interface NegotiationAgreement {
    id: string;
    issueId: string;
    agreedValue: string;
    agreedAt: Date;
    parties: string[];
    terms: string[];
}

export interface CourtPerformanceMetrics {
    sessionId: string;
    userId: string;
    overallScore: number;
    categoryScores: {
        preparation: number;
        presentation: number;
        argumentation: number;
        negotiation: number;
        legalKnowledge: number;
    };
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
    timeEfficiency: number;
    argumentEffectiveness: number;
    negotiationSuccess: number;
}

class VirtualCourtService {
    private sessions: Map<string, VirtualCourtSession> = new Map();
    private negotiationSessions: Map<string, NegotiationSession> = new Map();
    private scenarios: Map<string, CourtScenario> = new Map();

    constructor() {
        this.initializeScenarios();
    }

    // Start a new virtual court session
    async startVirtualCourtSession(
        userId: string,
        sessionType: VirtualCourtSession['sessionType'],
        contractType: ContractType,
        difficulty: Difficulty
    ): Promise<VirtualCourtSession> {
        const session: VirtualCourtSession = {
            id: `court_${userId}_${Date.now()}`,
            userId,
            sessionType,
            contractType,
            difficulty,
            participants: this.createParticipants(sessionType, contractType),
            currentPhase: this.getInitialPhase(sessionType),
            timeline: [],
            evidence: [],
            rulings: [],
            chat: [],
            isActive: true,
            startTime: new Date()
        };

        this.sessions.set(session.id, session);
        return session;
    }

    // Start a negotiation session
    async startNegotiationSession(
        userId: string,
        scenarioId: string
    ): Promise<NegotiationSession> {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error('Scenario not found');
        }

        const session: NegotiationSession = {
            id: `negotiation_${userId}_${Date.now()}`,
            scenarioId,
            userId,
            startTime: new Date(),
            currentRound: 1,
            totalRounds: 5,
            offers: [],
            agreements: [],
            timeRemaining: scenario.timeLimit * 60, // Convert to seconds
            isCompleted: false,
            outcome: 'impasse'
        };

        this.negotiationSessions.set(session.id, session);
        return session;
    }

    // Make an offer in negotiation
    async makeOffer(
        sessionId: string,
        fromParty: string,
        toParty: string,
        content: string,
        issues: NegotiationOffer['issues']
    ): Promise<{
        offer: NegotiationOffer;
        aiResponse?: NegotiationOffer;
        session: NegotiationSession;
    }> {
        const session = this.negotiationSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const offer: NegotiationOffer = {
            id: `offer_${Date.now()}`,
            round: session.currentRound,
            fromParty,
            toParty,
            content,
            issues,
            timestamp: new Date(),
            isAccepted: false
        };

        session.offers.push(offer);

        // Generate AI response
        const aiResponse = this.generateAIResponse(session, offer);
        if (aiResponse) {
            session.offers.push(aiResponse);
            session.currentRound++;
        }

        session.timeRemaining = Math.max(0, session.timeRemaining - 300); // 5 minutes per round

        return {
            offer,
            aiResponse: aiResponse || undefined,
            session
        };
    }

    // Complete a court action
    async completeCourtAction(
        sessionId: string,
        actionId: string,
        response?: ActionResponse
    ): Promise<{
        action: CourtAction;
        nextAction?: CourtAction;
        phase: CourtPhase;
        session: VirtualCourtSession;
    }> {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const action = session.currentPhase.actions.find(a => a.id === actionId);
        if (!action) {
            throw new Error('Action not found');
        }

        action.isCompleted = true;
        if (response) {
            action.responses.push(response);
        }

        // Check if phase is complete
        const completedActions = session.currentPhase.actions.filter(a => a.isCompleted);
        if (completedActions.length === session.currentPhase.actions.length) {
            session.currentPhase.isCompleted = true;
            const nextPhase = this.getNextPhase(session);
            if (nextPhase) {
                session.currentPhase = nextPhase;
            } else {
                session.isActive = false;
                session.endTime = new Date();
            }
        }

        const nextAction = session.currentPhase.actions.find(a => !a.isCompleted);

        return {
            action,
            nextAction,
            phase: session.currentPhase,
            session
        };
    }

    // Get available negotiation scenarios
    async getNegotiationScenarios(
        contractType?: ContractType,
        difficulty?: Difficulty
    ): Promise<NegotiationScenario[]> {
        let scenarios = Array.from(this.scenarios.values());

        if (contractType) {
            scenarios = scenarios.filter(s => s.contractType === contractType);
        }

        if (difficulty) {
            scenarios = scenarios.filter(s => s.difficulty === difficulty);
        }

        return scenarios;
    }

    // Get performance metrics
    async getPerformanceMetrics(sessionId: string): Promise<CourtPerformanceMetrics> {
        const session = this.sessions.get(sessionId) || this.negotiationSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        // Calculate performance metrics
        const overallScore = this.calculateOverallScore(session);
        const categoryScores = this.calculateCategoryScores(session);
        const strengths = this.identifyStrengths(session);
        const areasForImprovement = this.identifyImprovementAreas(session);
        const recommendations = this.generateRecommendations(session);

        return {
            sessionId,
            userId: session.userId,
            overallScore,
            categoryScores,
            strengths,
            areasForImprovement,
            recommendations,
            timeEfficiency: this.calculateTimeEfficiency(session),
            argumentEffectiveness: this.calculateArgumentEffectiveness(session),
            negotiationSuccess: this.calculateNegotiationSuccess(session)
        };
    }

    // Private helper methods
    private initializeScenarios(): void {
        // Civil Court Scenarios
        this.scenarios.set('civil_contract_dispute', {
            id: 'civil_contract_dispute',
            title: 'Contract Breach Dispute',
            hebrewTitle: 'סכסוך הפרת חוזה',
            description: 'Civil case involving breach of commercial contract',
            contractType: 'service',
            difficulty: 'medium',
            courtType: 'civil',
            duration: 90,
            participants: [
                { role: 'judge', name: 'Judge Sarah Cohen', isAI: true },
                { role: 'lawyer', name: 'Attorney David Levy', isAI: true },
                { role: 'lawyer', name: 'Attorney Rachel Green', isAI: true },
                { role: 'witness', name: 'John Smith (Plaintiff)', isAI: true },
                { role: 'witness', name: 'Mary Johnson (Defendant)', isAI: true }
            ],
            evidence: [
                { type: 'document', title: 'Original Contract', relevance: 'high' },
                { type: 'document', title: 'Payment Records', relevance: 'high' },
                { type: 'photo', title: 'Damaged Goods', relevance: 'medium' },
                { type: 'expert_report', title: 'Financial Analysis', relevance: 'high' }
            ],
            phases: ['opening_statements', 'plaintiff_case', 'defendant_case', 'cross_examination', 'closing_arguments', 'deliberation'],
            parties: {
                party1: {
                    name: 'Plaintiff',
                    role: 'Plaintiff',
                    interests: ['Compensation', 'Justice'],
                    constraints: ['Time', 'Cost'],
                    bottomLine: 'Minimum compensation'
                },
                party2: {
                    name: 'Defendant',
                    role: 'Defendant',
                    interests: ['Minimal liability', 'Settlement'],
                    constraints: ['Legal costs', 'Reputation'],
                    bottomLine: 'Reasonable settlement'
                }
            },
            issues: [
                {
                    id: 'breach',
                    title: 'Contract Breach',
                    description: 'Whether the contract was breached',
                    priority: 'high',
                    positions: {
                        party1: 'Clear breach occurred',
                        party2: 'No breach occurred'
                    },
                    possibleSolutions: ['Settlement', 'Mediation', 'Court decision'],
                    value: 10000
                }
            ],
            timeLimit: 90,
            successCriteria: ['Fair resolution', 'Legal precedent', 'Cost efficiency']
        });

        // Criminal Court Scenarios
        this.scenarios.set('criminal_fraud_case', {
            id: 'criminal_fraud_case',
            title: 'Financial Fraud Case',
            hebrewTitle: 'תיק הונאה פיננסית',
            description: 'Criminal case involving financial fraud and embezzlement',
            contractType: 'service',
            difficulty: 'hard',
            courtType: 'criminal',
            duration: 120,
            participants: [
                { role: 'judge', name: 'Judge Michael Brown', isAI: true },
                { role: 'lawyer', name: 'Prosecutor Lisa Davis', isAI: true },
                { role: 'lawyer', name: 'Defense Attorney Robert Wilson', isAI: true },
                { role: 'witness', name: 'Detective James Miller', isAI: true },
                { role: 'witness', name: 'Accountant Sarah White', isAI: true },
                { role: 'expert', name: 'Dr. Financial Expert', isAI: true }
            ],
            evidence: [
                { type: 'document', title: 'Bank Records', relevance: 'high' },
                { type: 'video', title: 'Surveillance Footage', relevance: 'high' },
                { type: 'audio', title: 'Phone Recording', relevance: 'medium' },
                { type: 'expert_report', title: 'Forensic Analysis', relevance: 'high' }
            ],
            phases: ['arraignment', 'prosecution_case', 'defense_case', 'expert_testimony', 'closing_arguments', 'jury_deliberation'],
            parties: {
                party1: {
                    name: 'Prosecution',
                    role: 'Prosecution',
                    interests: ['Justice', 'Punishment'],
                    constraints: ['Evidence', 'Legal standards'],
                    bottomLine: 'Conviction'
                },
                party2: {
                    name: 'Defense',
                    role: 'Defense',
                    interests: ['Acquittal', 'Reasonable doubt'],
                    constraints: ['Evidence', 'Client rights'],
                    bottomLine: 'Acquittal or reduced sentence'
                }
            },
            issues: [
                {
                    id: 'fraud',
                    title: 'Financial Fraud',
                    description: 'Whether financial fraud occurred',
                    priority: 'high',
                    positions: {
                        party1: 'Clear evidence of fraud',
                        party2: 'No fraud occurred'
                    },
                    possibleSolutions: ['Conviction', 'Acquittal', 'Plea bargain'],
                    value: 50000
                }
            ],
            timeLimit: 120,
            successCriteria: ['Justice served', 'Legal precedent', 'Fair trial']
        });

        // Family Court Scenarios
        this.scenarios.set('family_custody_case', {
            id: 'family_custody_case',
            title: 'Child Custody Dispute',
            hebrewTitle: 'סכסוך משמורת ילדים',
            description: 'Family court case involving child custody and visitation rights',
            contractType: 'service',
            difficulty: 'medium',
            courtType: 'family',
            duration: 75,
            participants: [
                { role: 'judge', name: 'Judge Jennifer Adams', isAI: true },
                { role: 'lawyer', name: 'Family Attorney Mark Johnson', isAI: true },
                { role: 'lawyer', name: 'Family Attorney Lisa Chen', isAI: true },
                { role: 'witness', name: 'Child Psychologist Dr. Smith', isAI: true },
                { role: 'witness', name: 'Social Worker Sarah Brown', isAI: true }
            ],
            evidence: [
                { type: 'document', title: 'Psychological Evaluation', relevance: 'high' },
                { type: 'document', title: 'School Records', relevance: 'medium' },
                { type: 'photo', title: 'Home Environment Photos', relevance: 'medium' },
                { type: 'expert_report', title: 'Child Welfare Report', relevance: 'high' }
            ],
            phases: ['mediation_attempt', 'opening_statements', 'expert_testimony', 'cross_examination', 'closing_arguments', 'judgment'],
            parties: {
                party1: {
                    name: 'Parent A',
                    role: 'Parent A',
                    interests: ['Primary custody', 'Child welfare'],
                    constraints: ['Work schedule', 'Resources'],
                    bottomLine: 'Shared custody'
                },
                party2: {
                    name: 'Parent B',
                    role: 'Parent B',
                    interests: ['Primary custody', 'Child welfare'],
                    constraints: ['Work schedule', 'Resources'],
                    bottomLine: 'Shared custody'
                }
            },
            issues: [
                {
                    id: 'custody',
                    title: 'Child Custody',
                    description: 'Determining primary custody',
                    priority: 'high',
                    positions: {
                        party1: 'Primary custody for Parent A',
                        party2: 'Primary custody for Parent B'
                    },
                    possibleSolutions: ['Shared custody', 'Primary custody', 'Mediation'],
                    value: 1000
                }
            ],
            timeLimit: 75,
            successCriteria: ['Child welfare', 'Fair arrangement', 'Cooperation']
        });

        // Commercial Court Scenarios
        this.scenarios.set('commercial_merger_case', {
            id: 'commercial_merger_case',
            title: 'Corporate Merger Dispute',
            hebrewTitle: 'סכסוך מיזוג חברות',
            description: 'Commercial court case involving corporate merger and shareholder rights',
            contractType: 'service',
            difficulty: 'hard',
            courtType: 'commercial',
            duration: 150,
            participants: [
                { role: 'judge', name: 'Judge Richard Thompson', isAI: true },
                { role: 'lawyer', name: 'Corporate Attorney Emily Davis', isAI: true },
                { role: 'lawyer', name: 'Corporate Attorney Michael Lee', isAI: true },
                { role: 'expert', name: 'Financial Analyst Dr. Johnson', isAI: true },
                { role: 'witness', name: 'CEO John Anderson', isAI: true },
                { role: 'witness', name: 'Board Member Lisa Wilson', isAI: true }
            ],
            evidence: [
                { type: 'document', title: 'Merger Agreement', relevance: 'high' },
                { type: 'document', title: 'Financial Statements', relevance: 'high' },
                { type: 'expert_report', title: 'Valuation Report', relevance: 'high' },
                { type: 'document', title: 'Shareholder Meeting Minutes', relevance: 'medium' }
            ],
            phases: ['preliminary_hearing', 'plaintiff_case', 'defendant_case', 'expert_testimony', 'cross_examination', 'closing_arguments', 'judgment'],
            parties: {
                party1: {
                    name: 'Company A',
                    role: 'Acquiring Company',
                    interests: ['Successful merger', 'Shareholder value'],
                    constraints: ['Regulatory approval', 'Cost'],
                    bottomLine: 'Favorable merger terms'
                },
                party2: {
                    name: 'Company B',
                    role: 'Target Company',
                    interests: ['Fair valuation', 'Employee protection'],
                    constraints: ['Market conditions', 'Regulatory requirements'],
                    bottomLine: 'Fair merger terms'
                }
            },
            issues: [
                {
                    id: 'valuation',
                    title: 'Company Valuation',
                    description: 'Determining fair value for merger',
                    priority: 'high',
                    positions: {
                        party1: 'Lower valuation',
                        party2: 'Higher valuation'
                    },
                    possibleSolutions: ['Independent valuation', 'Negotiation', 'Court decision'],
                    value: 1000000
                }
            ],
            timeLimit: 150,
            successCriteria: ['Fair valuation', 'Regulatory compliance', 'Shareholder approval']
        });

        // Arbitration Scenarios
        this.scenarios.set('arbitration_labor_dispute', {
            id: 'arbitration_labor_dispute',
            title: 'Labor Union Arbitration',
            hebrewTitle: 'בוררות איגוד עובדים',
            description: 'Arbitration case involving labor union contract negotiations',
            contractType: 'employment',
            difficulty: 'medium',
            courtType: 'arbitration',
            duration: 100,
            participants: [
                { role: 'arbitrator', name: 'Arbitrator Dr. Sarah Martinez', isAI: true },
                { role: 'lawyer', name: 'Union Attorney David Kim', isAI: true },
                { role: 'lawyer', name: 'Management Attorney Lisa Park', isAI: true },
                { role: 'witness', name: 'Union Representative Mike Johnson', isAI: true },
                { role: 'witness', name: 'HR Director Jennifer Brown', isAI: true }
            ],
            evidence: [
                { type: 'document', title: 'Current Labor Agreement', relevance: 'high' },
                { type: 'document', title: 'Financial Performance Data', relevance: 'high' },
                { type: 'expert_report', title: 'Industry Analysis', relevance: 'medium' },
                { type: 'document', title: 'Employee Survey Results', relevance: 'medium' }
            ],
            phases: ['opening_statements', 'union_case', 'management_case', 'expert_testimony', 'negotiation', 'arbitration_decision'],
            parties: {
                party1: {
                    name: 'Labor Union',
                    role: 'Labor Union',
                    interests: ['Better wages', 'Working conditions'],
                    constraints: ['Company finances', 'Market conditions'],
                    bottomLine: 'Reasonable improvements'
                },
                party2: {
                    name: 'Management',
                    role: 'Management',
                    interests: ['Cost control', 'Productivity'],
                    constraints: ['Union demands', 'Competition'],
                    bottomLine: 'Sustainable agreement'
                }
            },
            issues: [
                {
                    id: 'wages',
                    title: 'Wage Increase',
                    description: 'Determining wage increase percentage',
                    priority: 'high',
                    positions: {
                        party1: 'Higher wage increase',
                        party2: 'Lower wage increase'
                    },
                    possibleSolutions: ['Compromise', 'Performance-based', 'Industry standard'],
                    value: 5000
                }
            ],
            timeLimit: 100,
            successCriteria: ['Fair agreement', 'Employee satisfaction', 'Company sustainability']
        });

        // Lease Negotiation Scenario (existing)
        this.scenarios.set('lease_negotiation_1', {
            id: 'lease_negotiation_1',
            title: 'Commercial Lease Renewal',
            hebrewTitle: 'חידוש חוזה שכירות מסחרי',
            description: 'Negotiate renewal terms for a commercial property lease',
            contractType: 'rental',
            difficulty: 'medium',
            parties: {
                party1: {
                    name: 'Tenant (Tech Startup)',
                    role: 'Current tenant seeking renewal',
                    interests: ['Lower rent', 'Longer term', 'Flexible use'],
                    constraints: ['Budget limitations', 'Growth uncertainty'],
                    bottomLine: 'Cannot exceed current rent by more than 10%'
                },
                party2: {
                    name: 'Landlord (Property Management)',
                    role: 'Property owner seeking market rate',
                    interests: ['Higher rent', 'Stable tenant', 'Property improvements'],
                    constraints: ['Market competition', 'Property maintenance costs'],
                    bottomLine: 'Must achieve at least 15% rent increase'
                }
            },
            issues: [
                {
                    id: 'rent_amount',
                    title: 'Monthly Rent',
                    description: 'Negotiate the monthly rent amount',
                    priority: 'high',
                    positions: {
                        party1: 'Maintain current rent of $5,000/month',
                        party2: 'Increase to $6,500/month'
                    },
                    possibleSolutions: ['Gradual increase', 'Performance-based adjustment', 'Market rate with cap'],
                    value: 18000 // Annual difference
                },
                {
                    id: 'lease_term',
                    title: 'Lease Duration',
                    description: 'Length of the lease agreement',
                    priority: 'medium',
                    positions: {
                        party1: '3-year term with renewal options',
                        party2: '5-year term with annual reviews'
                    },
                    possibleSolutions: ['3+2 option', '5-year with break clause', 'Annual with notice'],
                    value: 5000
                }
            ],
            timeLimit: 60,
            successCriteria: [
                'Agreement on rent within 10% of current rate',
                'Flexible lease term options',
                'Maintained good relationship'
            ]
        });

        // Service Agreement Negotiation (existing)
        this.scenarios.set('service_negotiation_1', {
            id: 'service_negotiation_1',
            title: 'IT Service Agreement',
            hebrewTitle: 'הסכם שירותי IT',
            description: 'Negotiate terms for IT infrastructure services',
            contractType: 'service',
            difficulty: 'hard',
            parties: {
                party1: {
                    name: 'Client (Manufacturing Company)',
                    role: 'Service recipient',
                    interests: ['High availability', 'Cost efficiency', 'Custom solutions'],
                    constraints: ['Budget approval process', 'Internal IT limitations'],
                    bottomLine: 'Must stay within $50,000 annual budget'
                },
                party2: {
                    name: 'IT Service Provider',
                    role: 'Service provider',
                    interests: ['Premium pricing', 'Long-term commitment', 'Standard solutions'],
                    constraints: ['Resource limitations', 'Profit margins'],
                    bottomLine: 'Minimum $60,000 annual contract value'
                }
            },
            issues: [
                {
                    id: 'service_level',
                    title: 'Service Level Agreement',
                    description: 'Define uptime and response time requirements',
                    priority: 'high',
                    positions: {
                        party1: '99.9% uptime, 2-hour response',
                        party2: '99.5% uptime, 4-hour response'
                    },
                    possibleSolutions: ['Tiered SLA', 'Performance-based pricing', 'Escalation procedures'],
                    value: 15000
                }
            ],
            timeLimit: 90,
            successCriteria: [
                'Agreement within budget constraints',
                'Acceptable service levels',
                'Clear escalation procedures'
            ]
        });
    }

    private createParticipants(_sessionType: VirtualCourtSession['sessionType'], contractType: ContractType): VirtualParticipant[] {
        const participants: VirtualParticipant[] = [];

        if (_sessionType === 'negotiation') {
            participants.push(
                {
                    id: 'ai_negotiator',
                    name: 'AI Negotiator',
                    role: 'defendant',
                    isAI: true,
                    personality: {
                        communicationStyle: 'persuasive',
                        decisionMaking: 'analytical',
                        riskTolerance: 'medium',
                        patience: 'high',
                        empathy: 'medium'
                    },
                    expertise: [contractType, 'Negotiation', 'Legal Analysis'],
                    currentPosition: 'Seeking fair and reasonable terms',
                    negotiationStyle: 'collaborative'
                }
            );
        } else if (_sessionType === 'arbitration') {
            participants.push(
                {
                    id: 'ai_arbitrator',
                    name: 'Judge Sarah Cohen',
                    role: 'arbitrator',
                    isAI: true,
                    personality: {
                        communicationStyle: 'formal',
                        decisionMaking: 'analytical',
                        riskTolerance: 'low',
                        patience: 'high',
                        empathy: 'medium'
                    },
                    expertise: ['Arbitration', 'Contract Law', 'Dispute Resolution'],
                    currentPosition: 'Neutral arbitrator seeking fair resolution',
                    negotiationStyle: 'accommodating'
                }
            );
        }

        return participants;
    }

    private getInitialPhase(_sessionType: VirtualCourtSession['sessionType']): CourtPhase {
        const phases = {
            negotiation: {
                id: 'opening',
                name: 'Opening Statements',
                description: 'Parties present their initial positions',
                duration: 10,
                isCompleted: false,
                currentStep: 1,
                totalSteps: 3,
                actions: [
                    {
                        id: 'opening_1',
                        type: 'presentation' as const,
                        participantId: 'user',
                        title: 'Present Your Position',
                        description: 'Explain your initial position and key interests',
                        content: 'Please present your opening statement...',
                        timestamp: new Date(),
                        duration: 5,
                        isCompleted: false,
                        responses: []
                    }
                ]
            },
            arbitration: {
                id: 'preliminary',
                name: 'Preliminary Hearing',
                description: 'Establish procedures and identify issues',
                duration: 15,
                isCompleted: false,
                currentStep: 1,
                totalSteps: 4,
                actions: [
                    {
                        id: 'prelim_1',
                        type: 'presentation' as const,
                        participantId: 'ai_arbitrator',
                        title: 'Arbitration Procedures',
                        description: 'Arbitrator explains the process',
                        content: 'Welcome to the arbitration hearing...',
                        timestamp: new Date(),
                        duration: 5,
                        isCompleted: false,
                        responses: []
                    }
                ]
            }
        };

        return phases[_sessionType as keyof typeof phases] || phases.negotiation;
    }

    private getNextPhase(session: VirtualCourtSession): CourtPhase | null {
        const phaseSequence = {
            negotiation: ['opening', 'discussion', 'bargaining', 'closing'],
            arbitration: ['preliminary', 'evidence', 'arguments', 'decision']
        };

        const sequence = phaseSequence[session.sessionType as keyof typeof phaseSequence] || phaseSequence.negotiation;
        const currentIndex = sequence.indexOf(session.currentPhase.id);

        if (currentIndex < sequence.length - 1) {
            const nextPhaseId = sequence[currentIndex + 1];
            return this.createPhase(nextPhaseId);
        }

        return null;
    }

    private createPhase(phaseId: string): CourtPhase {
        // Create phase based on ID and session type
        return {
            id: phaseId,
            name: `Phase ${phaseId}`,
            description: `Description for ${phaseId}`,
            duration: 15,
            isCompleted: false,
            currentStep: 1,
            totalSteps: 3,
            actions: []
        };
    }

    private generateAIResponse(_session: NegotiationSession, offer: NegotiationOffer): NegotiationOffer | null {
        // Simulate AI response generation
        const scenario = this.scenarios.get(_session.scenarioId);
        if (!scenario) return null;

        const aiParty = offer.toParty === scenario.parties.party1.name ? scenario.parties.party2.name : scenario.parties.party1.name;

        return {
            id: `ai_response_${Date.now()}`,
            round: _session.currentRound,
            fromParty: aiParty,
            toParty: offer.fromParty,
            content: `Thank you for your offer. We propose the following counter-offer...`,
            issues: offer.issues.map(issue => ({
                issueId: issue.issueId,
                proposedValue: `Counter-proposal for ${issue.issueId}`,
                reasoning: 'Based on our analysis and constraints'
            })),
            timestamp: new Date(),
            isAccepted: false,
            counterOffer: offer
        };
    }

    // Enhanced Virtual Court Methods
    async getAvailableScenarios(): Promise<Array<{
        id: string;
        title: string;
        hebrewTitle: string;
        description: string;
        contractType: string;
        difficulty: string;
        courtType?: string;
        duration: number;
        participants: Array<{ role: string; name: string; isAI: boolean }>;
        evidence: Array<{ type: string; title: string; relevance: string }>;
        phases: string[];
    }>> {
        return Array.from(this.scenarios.values()).map(scenario => ({
            id: scenario.id,
            title: scenario.title,
            hebrewTitle: scenario.hebrewTitle || scenario.title,
            description: scenario.description,
            contractType: scenario.contractType,
            difficulty: scenario.difficulty,
            courtType: scenario.courtType,
            duration: scenario.duration || 60,
            participants: scenario.participants || [],
            evidence: scenario.evidence || [],
            phases: scenario.phases || []
        }));
    }

    async getScenarioById(scenarioId: string): Promise<CourtScenario | null> {
        return this.scenarios.get(scenarioId) || null;
    }

    async submitEvidence(_sessionId: string, evidence: {
        title: string;
        type: string;
        submittedBy: string;
        relevance: 'high' | 'medium' | 'low';
        url: string;
    }): Promise<Evidence> {
        const session = this.sessions.get(_sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const newEvidence: Evidence = {
            id: `evidence_${Date.now()}`,
            title: evidence.title,
            type: evidence.type as 'document' | 'testimony' | 'expert_report' | 'contract' | 'email' | 'financial_record',
            description: evidence.title,
            submittedBy: evidence.submittedBy,
            submittedAt: new Date(),
            relevance: evidence.relevance,
            admissibility: 'pending',
            content: evidence.title,
            attachments: [evidence.url]
        };

        session.evidence.push(newEvidence);
        return newEvidence;
    }

    async makeRuling(_sessionId: string, ruling: {
        title: string;
        description: string;
        judge: string;
        type: 'procedural' | 'substantive' | 'final';
        outcome?: 'plaintiff' | 'defendant' | 'mixed' | 'dismissed';
    }): Promise<Ruling> {
        const session = this.sessions.get(_sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const newRuling: Ruling = {
            id: `ruling_${Date.now()}`,
            title: ruling.title,
            description: ruling.description,
            issuedBy: ruling.judge,
            issuedAt: new Date(),
            reasoning: ruling.description,
            outcome: ruling.outcome || 'mixed',
            type: ruling.type,
            impact: 'neutral',
            precedentialValue: 'medium'
        };

        session.rulings.push(newRuling);
        return newRuling;
    }

    async sendChatMessage(_sessionId: string, message: {
        sender: string;
        content: string;
        type: 'text' | 'system' | 'ai_suggestion';
    }): Promise<ChatMessage> {
        const session = this.sessions.get(_sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const newMessage: ChatMessage = {
            id: `message_${Date.now()}`,
            sender: message.sender,
            content: message.content,
            timestamp: new Date(),
            type: message.type
        };

        session.chat.push(newMessage);
        return newMessage;
    }

    async generateAISuggestions(): Promise<string[]> {
        // Simulate AI-generated suggestions based on context
        const suggestions = [
            'Consider presenting evidence of similar cases',
            'Focus on the key legal principles at stake',
            'Address the opposing party\'s strongest arguments',
            'Request additional time for preparation if needed',
            'Consider mediation as an alternative resolution'
        ];

        return suggestions.slice(0, 3); // Return top 3 suggestions
    }

    async getSessionAnalytics(_sessionId: string): Promise<{
        speakingTime: { [participantId: string]: number };
        contributions: { [participantId: string]: number };
        argumentEffectiveness: { [participantId: string]: number };
        timeEfficiency: number;
        overallScore: number;
    }> {
        const session = this.sessions.get(_sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        // Simulate analytics calculation
        const analytics = {
            speakingTime: {} as { [participantId: string]: number },
            contributions: {} as { [participantId: string]: number },
            argumentEffectiveness: {} as { [participantId: string]: number },
            timeEfficiency: Math.random() * 100,
            overallScore: Math.random() * 100
        };

        session.participants.forEach(participant => {
            analytics.speakingTime[participant.id] = Math.floor(Math.random() * 300);
            analytics.contributions[participant.id] = Math.floor(Math.random() * 20);
            analytics.argumentEffectiveness[participant.id] = Math.random() * 100;
        });

        return analytics;
    }

    async exportTranscript(_sessionId: string): Promise<string> {
        const session = this.sessions.get(_sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        // Generate transcript from chat messages and timeline
        let transcript = `Virtual Court Session Transcript\n`;
        transcript += `Session ID: ${session.id}\n`;
        transcript += `Date: ${session.startTime.toLocaleDateString()}\n`;
        transcript += `Type: ${session.sessionType}\n\n`;

        session.timeline.forEach(event => {
            transcript += `[${event.timestamp.toLocaleTimeString()}] ${event.title}: ${event.description}\n`;
        });

        session.chat.forEach(message => {
            transcript += `[${message.timestamp.toLocaleTimeString()}] ${message.sender}: ${message.content}\n`;
        });

        return transcript;
    }

    async getSessionHistory(_userId: string): Promise<VirtualCourtSession[]> {
        return Array.from(this.sessions.values())
            .filter(session => session.userId === _userId)
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }

    private calculateOverallScore(_session: VirtualCourtSession | NegotiationSession): number {
        return 85; // Mock score
    }

    private calculateCategoryScores(_session: VirtualCourtSession | NegotiationSession): CourtPerformanceMetrics['categoryScores'] {
        return {
            preparation: 80,
            presentation: 85,
            argumentation: 90,
            negotiation: 75,
            legalKnowledge: 85
        };
    }

    private identifyStrengths(_session: VirtualCourtSession | NegotiationSession): string[] {
        return ['Strong argumentation', 'Good evidence presentation'];
    }

    private identifyImprovementAreas(_session: VirtualCourtSession | NegotiationSession): string[] {
        return ['Time management', 'Cross-examination skills'];
    }

    private generateRecommendations(_session: VirtualCourtSession | NegotiationSession): string[] {
        return ['Practice time management', 'Improve cross-examination techniques'];
    }

    private calculateTimeEfficiency(_session: VirtualCourtSession | NegotiationSession): number {
        return 75;
    }

    private calculateArgumentEffectiveness(_session: VirtualCourtSession | NegotiationSession): number {
        return 85;
    }

    private calculateNegotiationSuccess(_session: VirtualCourtSession | NegotiationSession): number {
        return 90;
    }
}

export const virtualCourtService = new VirtualCourtService();
