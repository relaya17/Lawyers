import { ContractType, Difficulty } from '../types/index';

export interface Scenario {
    id: string;
    title: string;
    hebrewTitle: string;
    description: string;
    hebrewDescription: string;
    contractType: ContractType;
    difficulty: Difficulty;
    category: string;
    initialConditions: {
        parties: string[];
        contractTerms: string[];
        currentSituation: string;
    };
    possibleOutcomes: ScenarioOutcome[];
    legalImplications: LegalImplication[];
    negotiationPoints: NegotiationPoint[];
    aiRecommendations: AIRecommendation[];
    relatedCaseLaw: CaseLawReference[];
}

export interface ScenarioOutcome {
    id: string;
    title: string;
    probability: number; // 0-100
    description: string;
    legalConsequences: string[];
    financialImpact: {
        min: number;
        max: number;
        currency: string;
    };
    timeToResolution: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface LegalImplication {
    area: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    relevantLaws: string[];
    potentialPenalties: string[];
    mitigationStrategies: string[];
}

export interface NegotiationPoint {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    suggestedApproach: string;
    fallbackOptions: string[];
    redLines: string[];
}

export interface AIRecommendation {
    type: 'strategy' | 'clause' | 'timing' | 'risk_mitigation';
    title: string;
    description: string;
    confidence: number; // 0-100
    implementation: string[];
    expectedOutcome: string;
    alternatives: string[];
}

export interface CaseLawReference {
    caseName: string;
    court: string;
    year: number;
    summary: string;
    relevance: string;
    keyPrinciples: string[];
}

export interface SimulationSession {
    id: string;
    userId: string;
    scenarioId: string;
    startTime: Date;
    currentStep: number;
    decisions: Decision[];
    outcomes: ScenarioOutcome[];
    timeSpent: number;
    isCompleted: boolean;
}

export interface Decision {
    step: number;
    question: string;
    options: string[];
    selectedOption: string;
    reasoning: string;
    timestamp: Date;
    impact: {
        riskChange: number;
        outcomeProbability: Record<string, number>;
    };
}

export interface ForecastRequest {
    contractType: ContractType;
    scenario: string;
    parties: string[];
    currentTerms: string[];
    desiredOutcome: string;
    constraints: string[];
}

export interface ForecastResult {
    successProbability: number;
    recommendedStrategy: string;
    timeline: string;
    risks: string[];
    opportunities: string[];
    alternativeScenarios: ScenarioOutcome[];
    legalConsiderations: LegalImplication[];
}

class ScenarioSimulationService {
    private scenarios: Map<string, Scenario> = new Map();
    private activeSessions: Map<string, SimulationSession> = new Map();

    constructor() {
        this.initializeScenarios();
    }

    // Get available scenarios
    async getScenarios(
        contractType?: ContractType,
        difficulty?: Difficulty
    ): Promise<Scenario[]> {
        let scenarios = Array.from(this.scenarios.values());

        if (contractType) {
            scenarios = scenarios.filter(s => s.contractType === contractType);
        }

        if (difficulty) {
            scenarios = scenarios.filter(s => s.difficulty === difficulty);
        }

        return scenarios;
    }

    // Get specific scenario
    async getScenario(scenarioId: string): Promise<Scenario | null> {
        return this.scenarios.get(scenarioId) || null;
    }

    // Start a new simulation session
    async startSimulation(
        userId: string,
        scenarioId: string
    ): Promise<SimulationSession> {
        const scenario = await this.getScenario(scenarioId);
        if (!scenario) {
            throw new Error('Scenario not found');
        }

        const session: SimulationSession = {
            id: `session_${userId}_${Date.now()}`,
            userId,
            scenarioId,
            startTime: new Date(),
            currentStep: 0,
            decisions: [],
            outcomes: [],
            timeSpent: 0,
            isCompleted: false
        };

        this.activeSessions.set(session.id, session);
        return session;
    }

    // Make a decision in the simulation
    async makeDecision(
        sessionId: string,
        step: number,
        question: string,
        options: string[],
        selectedOption: string,
        reasoning: string
    ): Promise<{
        session: SimulationSession;
        nextStep: string;
        impact: Decision['impact'];
    }> {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const decision: Decision = {
            step,
            question,
            options,
            selectedOption,
            reasoning,
            timestamp: new Date(),
            impact: this.calculateDecisionImpact(session, selectedOption)
        };

        session.decisions.push(decision);
        session.currentStep = step + 1;
        session.timeSpent = Date.now() - session.startTime.getTime();

        // Update outcomes based on decision
        session.outcomes = this.recalculateOutcomes(session);

        const nextStep = this.getNextStep(session);

        return {
            session,
            nextStep,
            impact: decision.impact
        };
    }

    // Complete simulation and get final results
    async completeSimulation(sessionId: string): Promise<{
        session: SimulationSession;
        finalOutcome: ScenarioOutcome;
        analysis: string;
        recommendations: AIRecommendation[];
    }> {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        session.isCompleted = true;
        session.timeSpent = Date.now() - session.startTime.getTime();

        const scenario = await this.getScenario(session.scenarioId);
        if (!scenario) {
            throw new Error('Scenario not found');
        }

        const finalOutcome = this.determineFinalOutcome(session);
        const analysis = this.generateAnalysis(session, scenario);
        const recommendations = this.generateRecommendations(session, scenario);

        return {
            session,
            finalOutcome,
            analysis,
            recommendations
        };
    }

    // Generate outcome forecast
    async generateForecast(request: ForecastRequest): Promise<ForecastResult> {
        // Simulate AI analysis of the request
        const successProbability = this.calculateSuccessProbability(request);
        const recommendedStrategy = this.generateStrategy(request);
        const timeline = this.estimateTimeline(request);
        const risks = this.identifyRisks(request);
        const opportunities = this.identifyOpportunities(request);
        const alternativeScenarios = this.generateAlternativeScenarios(request);
        const legalConsiderations = this.analyzeLegalConsiderations(request);

        return {
            successProbability,
            recommendedStrategy,
            timeline,
            risks,
            opportunities,
            alternativeScenarios,
            legalConsiderations
        };
    }

    // Get user's simulation history
    async getUserSimulationHistory(userId: string): Promise<SimulationSession[]> {
        return Array.from(this.activeSessions.values())
            .filter(session => session.userId === userId)
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }

    // Private helper methods
    private initializeScenarios(): void {
        // Lease Agreement Scenarios
        this.scenarios.set('lease_eviction_dispute', {
            id: 'lease_eviction_dispute',
            title: 'Early Eviction Dispute',
            hebrewTitle: 'סכסוך פינוי מוקדם',
            description: 'Landlord wants to evict tenant early due to alleged contract violations',
            hebrewDescription: 'המשכיר רוצה לפנות את השוכר מוקדם בשל הפרות חוזה לכאורה',
            contractType: 'rental',
            difficulty: 'hard',
            category: 'Dispute Resolution',
            initialConditions: {
                parties: ['Landlord', 'Tenant'],
                contractTerms: ['12-month lease', 'No early termination clause', 'Monthly rent payment'],
                currentSituation: 'Tenant is 2 months behind on rent, landlord wants immediate eviction'
            },
            possibleOutcomes: [
                {
                    id: 'outcome_1',
                    title: 'Successful Eviction',
                    probability: 60,
                    description: 'Landlord successfully evicts tenant through legal process',
                    legalConsequences: ['Tenant must vacate within 30 days', 'Landlord can sue for unpaid rent'],
                    financialImpact: { min: 5000, max: 15000, currency: 'USD' },
                    timeToResolution: '2-3 months',
                    riskLevel: 'medium'
                },
                {
                    id: 'outcome_2',
                    title: 'Settlement Agreement',
                    probability: 30,
                    description: 'Parties reach a settlement with payment plan',
                    legalConsequences: ['Tenant agrees to payment plan', 'Eviction proceedings halted'],
                    financialImpact: { min: 2000, max: 8000, currency: 'USD' },
                    timeToResolution: '1-2 months',
                    riskLevel: 'low'
                },
                {
                    id: 'outcome_3',
                    title: 'Tenant Wins',
                    probability: 10,
                    description: 'Tenant successfully defends against eviction',
                    legalConsequences: ['Tenant can remain in property', 'Landlord must pay legal fees'],
                    financialImpact: { min: -5000, max: -10000, currency: 'USD' },
                    timeToResolution: '3-6 months',
                    riskLevel: 'high'
                }
            ],
            legalImplications: [
                {
                    area: 'Tenant Rights',
                    description: 'Tenants have protection against unfair eviction',
                    severity: 'high',
                    relevantLaws: ['Tenant Protection Act', 'Housing Rights Law'],
                    potentialPenalties: ['Invalid eviction notice', 'Compensation for damages'],
                    mitigationStrategies: ['Proper notice period', 'Valid grounds for eviction']
                }
            ],
            negotiationPoints: [
                {
                    id: 'np_1',
                    title: 'Payment Plan Negotiation',
                    description: 'Negotiate a reasonable payment plan for arrears',
                    priority: 'high',
                    suggestedApproach: 'Propose 3-month payment plan with reduced rent',
                    fallbackOptions: ['Mediation', 'Legal proceedings'],
                    redLines: ['No immediate eviction', 'No excessive penalties']
                }
            ],
            aiRecommendations: [
                {
                    type: 'strategy',
                    title: 'Mediation First Approach',
                    description: 'Attempt mediation before legal proceedings',
                    confidence: 85,
                    implementation: ['Contact mediation service', 'Prepare settlement proposal'],
                    expectedOutcome: 'Faster resolution with lower costs',
                    alternatives: ['Direct negotiation', 'Legal action']
                }
            ],
            relatedCaseLaw: [
                {
                    caseName: 'Smith v. Johnson',
                    court: 'Supreme Court',
                    year: 2022,
                    summary: 'Case about tenant rights in eviction proceedings',
                    relevance: 'Establishes minimum notice requirements',
                    keyPrinciples: ['30-day notice required', 'Valid grounds must be proven']
                }
            ]
        });

        // Service Agreement Scenarios
        this.scenarios.set('service_breach_dispute', {
            id: 'service_breach_dispute',
            title: 'Service Level Breach',
            hebrewTitle: 'הפרת רמת שירות',
            description: 'Service provider fails to meet SLA requirements',
            hebrewDescription: 'ספק השירות לא עומד בדרישות רמת השירות',
            contractType: 'service',
            difficulty: 'medium',
            category: 'SLA Compliance',
            initialConditions: {
                parties: ['Service Provider', 'Client'],
                contractTerms: ['99.9% uptime SLA', '24-hour response time', 'Monthly service fee'],
                currentSituation: 'Service has been down for 48 hours, client demands compensation'
            },
            possibleOutcomes: [
                {
                    id: 'outcome_1',
                    title: 'Compensation Payment',
                    probability: 70,
                    description: 'Provider pays compensation for SLA breach',
                    legalConsequences: ['Provider pays penalty', 'SLA terms clarified'],
                    financialImpact: { min: 10000, max: 50000, currency: 'USD' },
                    timeToResolution: '1-2 weeks',
                    riskLevel: 'medium'
                }
            ],
            legalImplications: [],
            negotiationPoints: [],
            aiRecommendations: [],
            relatedCaseLaw: []
        });

        // Add more scenarios for other contract types...
    }

    private calculateDecisionImpact(session: SimulationSession, decision: string): Decision['impact'] {
        // Simulate impact calculation based on decision
        const riskChange = Math.random() * 20 - 10; // -10 to +10
        const outcomeProbability: Record<string, number> = {
            'outcome_1': Math.random() * 100,
            'outcome_2': Math.random() * 100,
            'outcome_3': Math.random() * 100
        };

        return {
            riskChange,
            outcomeProbability
        };
    }

    private recalculateOutcomes(session: SimulationSession): ScenarioOutcome[] {
        // Simulate outcome recalculation based on decisions
        return [
            {
                id: 'recalculated_1',
                title: 'Updated Outcome',
                probability: Math.random() * 100,
                description: 'Outcome updated based on decisions',
                legalConsequences: ['Updated consequence 1', 'Updated consequence 2'],
                financialImpact: { min: 1000, max: 10000, currency: 'USD' },
                timeToResolution: '1-3 months',
                riskLevel: 'medium'
            }
        ];
    }

    private getNextStep(session: SimulationSession): string {
        const steps = [
            'Analyze the situation',
            'Identify key issues',
            'Consider legal implications',
            'Explore negotiation options',
            'Make strategic decision',
            'Evaluate outcomes'
        ];

        return steps[session.currentStep] || 'Complete simulation';
    }

    private determineFinalOutcome(session: SimulationSession): ScenarioOutcome {
        // Simulate final outcome determination
        return {
            id: 'final_outcome',
            title: 'Simulation Complete',
            probability: 100,
            description: 'Final outcome based on all decisions',
            legalConsequences: ['Final consequence 1', 'Final consequence 2'],
            financialImpact: { min: 5000, max: 20000, currency: 'USD' },
            timeToResolution: '2-4 months',
            riskLevel: 'medium'
        };
    }

    private generateAnalysis(session: SimulationSession, scenario: Scenario): string {
        return `Analysis of simulation: ${session.decisions.length} decisions made over ${session.timeSpent}ms. Key insights include...`;
    }

    private generateRecommendations(session: SimulationSession, scenario: Scenario): AIRecommendation[] {
        return [
            {
                type: 'strategy',
                title: 'Recommended Next Steps',
                description: 'Based on simulation outcomes',
                confidence: 90,
                implementation: ['Step 1', 'Step 2', 'Step 3'],
                expectedOutcome: 'Improved negotiation position',
                alternatives: ['Alternative 1', 'Alternative 2']
            }
        ];
    }

    private calculateSuccessProbability(request: ForecastRequest): number {
        // Simulate AI calculation of success probability
        return Math.random() * 100;
    }

    private generateStrategy(request: ForecastRequest): string {
        return `Recommended strategy for ${request.contractType} contract: ${request.desiredOutcome}`;
    }

    private estimateTimeline(request: ForecastRequest): string {
        return '3-6 months based on complexity and parties involved';
    }

    private identifyRisks(request: ForecastRequest): string[] {
        return [
            'Legal compliance risks',
            'Financial risks',
            'Operational risks'
        ];
    }

    private identifyOpportunities(request: ForecastRequest): string[] {
        return [
            'Cost savings potential',
            'Process improvement',
            'Relationship building'
        ];
    }

    private generateAlternativeScenarios(request: ForecastRequest): ScenarioOutcome[] {
        return [
            {
                id: 'alt_1',
                title: 'Conservative Approach',
                probability: 40,
                description: 'Conservative negotiation strategy',
                legalConsequences: ['Minimal legal risk'],
                financialImpact: { min: 1000, max: 5000, currency: 'USD' },
                timeToResolution: '2-3 months',
                riskLevel: 'low'
            }
        ];
    }

    private analyzeLegalConsiderations(request: ForecastRequest): LegalImplication[] {
        return [
            {
                area: 'Contract Law',
                description: 'Standard contract law considerations',
                severity: 'medium',
                relevantLaws: ['Contract Law', 'Commercial Law'],
                potentialPenalties: ['Breach of contract'],
                mitigationStrategies: ['Clear terms', 'Proper documentation']
            }
        ];
    }
}

export const scenarioSimulationService = new ScenarioSimulationService();
