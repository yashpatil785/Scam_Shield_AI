import React from 'react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number; // 0 - 100
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 'md' }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine color scheme based on level
  const getColor = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          stroke: '#f43f5e', // rose-500
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          glow: 'rgba(244, 63, 94, 0.35)',
        };
      case 'HIGH':
        return {
          stroke: '#f97316', // orange-500
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          glow: 'rgba(249, 115, 22, 0.35)',
        };
      case 'MEDIUM':
        return {
          stroke: '#eab308', // yellow-500
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          glow: 'rgba(234, 179, 8, 0.35)',
        };
      case 'LOW':
      default:
        return {
          stroke: '#10b981', // emerald-500
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          glow: 'rgba(16, 185, 129, 0.35)',
        };
    }
  };

  const colors = getColor();

  // SVG Gauge calculations
  const dimension = size === 'sm' ? 100 : size === 'lg' ? 180 : 140;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc over 240 degrees
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center relative select-none" id="risk-gauge-container">
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="transform -rotate-135 origin-center"
        >
          {/* Background track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress value */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline font-mono font-bold tracking-tight">
            <span className={`text-3xl ${size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-2xl' : 'text-3xl'} ${colors.text}`}>
              {normalizedScore}
            </span>
            <span className="text-slate-500 text-xs ml-0.5">/100</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Badge below gauge */}
      <div
        className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mt-1 border ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {level} RISK
      </div>
    </div>
  );
};
