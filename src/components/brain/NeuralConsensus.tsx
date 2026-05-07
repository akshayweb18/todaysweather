'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiUserSharedLine, RiShieldUserLine, RiSettings3Line } from 'react-icons/ri';

interface AgentVote {
  name: string;
  role: string;
  vote: 'GO' | 'NO-GO' | 'CAUTION';
  confidence: number;
}

export const NeuralConsensus: React.FC<{ votes?: AgentVote[] }> = ({ votes }) => {
  const defaultVotes: AgentVote[] = [
    { name: 'Aether Analyst', role: 'Data Interpretation', vote: 'GO', confidence: 98 },
    { name: 'Risk Strategist', role: 'Safety Assessment', vote: 'CAUTION', confidence: 85 },
    { name: 'Executive Engine', role: 'Final Decision', vote: 'CAUTION', confidence: 92 },
  ];

  const agentBios: Record<string, string> = {
    'Aether Analyst': 'Deep-pattern matching active.',
    'Risk Strategist': 'Evaluating human-impact delta.',
    'Executive Engine': 'Synthesizing final directives.',
  };

  const activeVotes = votes || defaultVotes;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        Multi-Agent Consensus Board
      </div>
      <div className="grid grid-cols-3 gap-4">
        {activeVotes.map((agent, i) => (
          <motion.div 
            key={agent.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 rounded-2xl border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-1 h-full ${
              agent.vote === 'GO' ? 'bg-green-500' : 
              agent.vote === 'CAUTION' ? 'bg-orange-500' : 'bg-red-500'
            }`} />
            
            <div className="text-[9px] font-bold text-cyan-400 mb-1">{agent.role}</div>
            <div className="text-[11px] text-white font-bold mb-1">{agent.name}</div>
            <div className="text-[8px] text-slate-500 italic mb-3 opacity-60">
              {agentBios[agent.name]}
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase">Vote</span>
                <span className={`text-[10px] font-bold ${
                  agent.vote === 'GO' ? 'text-green-400' : 
                  agent.vote === 'CAUTION' ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {agent.vote}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-slate-500 uppercase">Conf</span>
                <span className="text-[10px] font-mono text-white">{agent.confidence}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
