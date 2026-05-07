export type AgentRole = 'ANALYST' | 'STRATEGIST' | 'EXECUTIVE' | 'COMMUNICATOR';

export interface AgentState {
  role: AgentRole;
  status: 'IDLE' | 'THINKING' | 'ACTING' | 'ERROR';
  lastObservation?: any;
  lastThought?: string;
  lastAction?: string;
}

export interface WeatherIntelligence {
  timestamp: string;
  location: string;
  rawMetrics: {
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    description: string;
  };
  analysis: {
    microPatterns: string[];
    riskScore: number; // 0-10
    threatLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  decisions: {
    actionRequired: boolean;
    suggestedAction?: string;
    reasoning: string;
    priority: number;
  };
}

export interface AutonomousEvent {
  id: string;
  type: 'WEATHER_UPDATE' | 'RISK_DETECTED' | 'DECISION_MADE' | 'ALERT_SENT';
  agent: AgentRole;
  payload: any;
  timestamp: string;
}
