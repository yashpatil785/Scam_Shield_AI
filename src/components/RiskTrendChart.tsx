import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { ScamAnalysisReport } from '../types';
import {
  TrendingUp,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Info,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface RiskTrendChartProps {
  history: ScamAnalysisReport[];
  onSelectReport?: (report: ScamAnalysisReport) => void;
}

interface TrendPoint {
  id: string;
  timestamp: string;
  timeLabel: string;
  fullDate: string;
  riskScore: number;
  scamProbability: number;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  channel: string;
  isUserScan: boolean;
  summary: string;
  originalReport?: ScamAnalysisReport;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({
  history,
  onSelectReport,
}) => {
  const [timeframe, setTimeframe] = useState<'timeline' | 'daily'>('timeline');
  const [showThresholds, setShowThresholds] = useState(true);
  const [showProbability, setShowProbability] = useState(false);

  // Baseline simulated telemetry incidents for a realistic continuous timeline
  const baselineTelemetry: TrendPoint[] = useMemo(() => {
    const now = Date.now();
    return [
      {
        id: 'tel_1',
        timestamp: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
        timeLabel: '-36h',
        fullDate: new Date(now - 1000 * 60 * 60 * 36).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 88,
        scamProbability: 92,
        category: 'Fake Job / Telegram Task',
        riskLevel: 'CRITICAL',
        channel: 'Telegram',
        isUserScan: false,
        summary: 'Telegram daily salary task scam asking for prepayment.',
      },
      {
        id: 'tel_2',
        timestamp: new Date(now - 1000 * 60 * 60 * 28).toISOString(),
        timeLabel: '-28h',
        fullDate: new Date(now - 1000 * 60 * 60 * 28).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 24,
        scamProbability: 18,
        category: 'Order Confirmation Advisory',
        riskLevel: 'LOW',
        channel: 'Email',
        isUserScan: false,
        summary: 'Legitimate merchant order receipt notification.',
      },
      {
        id: 'tel_3',
        timestamp: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
        timeLabel: '-20h',
        fullDate: new Date(now - 1000 * 60 * 60 * 20).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 78,
        scamProbability: 82,
        category: 'Electricity Bill Disconnection',
        riskLevel: 'HIGH',
        channel: 'SMS',
        isUserScan: false,
        summary: 'Power cut urgency scam with malicious APK helpline link.',
      },
      {
        id: 'tel_4',
        timestamp: new Date(now - 1000 * 60 * 60 * 14).toISOString(),
        timeLabel: '-14h',
        fullDate: new Date(now - 1000 * 60 * 60 * 14).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 94,
        scamProbability: 96,
        category: 'KYC / NetBanking Phishing',
        riskLevel: 'CRITICAL',
        channel: 'SMS',
        isUserScan: false,
        summary: 'Bank KYC expiry alert leading to spoofed netbanking credential harvesting portal.',
      },
      {
        id: 'tel_5',
        timestamp: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
        timeLabel: '-8h',
        fullDate: new Date(now - 1000 * 60 * 60 * 8).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 62,
        scamProbability: 65,
        category: 'Customs Clearance Fee Scam',
        riskLevel: 'MEDIUM',
        channel: 'WhatsApp',
        isUserScan: false,
        summary: 'Foreign parcel clearance fee demand via fake courier tracking link.',
      },
      {
        id: 'tel_6',
        timestamp: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
        timeLabel: '-3h',
        fullDate: new Date(now - 1000 * 60 * 60 * 3).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskScore: 92,
        scamProbability: 95,
        category: 'UPI Refund / Reverse QR Trap',
        riskLevel: 'CRITICAL',
        channel: 'UPI / SMS',
        isUserScan: false,
        summary: 'Fake accidental transfer claim requesting QR scan to receive refund.',
      },
    ];
  }, []);

  // Map user history into trend points
  const userPoints: TrendPoint[] = useMemo(() => {
    // Sort ascending by timestamp so line moves left-to-right chronologically
    const sorted = [...history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((item, idx) => {
      const date = new Date(item.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return {
        id: item.id,
        timestamp: item.timestamp,
        timeLabel: `${dateStr} ${timeStr}`,
        fullDate: `${dateStr}, ${timeStr}`,
        riskScore: item.riskScore,
        scamProbability: item.scamProbability,
        category: item.scamCategory,
        riskLevel: item.riskLevel,
        channel: item.communicationType,
        isUserScan: true,
        summary: item.summary,
        originalReport: item,
      };
    });
  }, [history]);

  // Combined dataset for chronological scan timeline
  const timelineData = useMemo(() => {
    if (userPoints.length === 0) {
      return baselineTelemetry;
    }
    if (userPoints.length < 5) {
      // Prepend relevant baseline telemetry before user points so the line is continuous
      const recentBaseline = baselineTelemetry.slice(0, 5 - userPoints.length);
      return [...recentBaseline, ...userPoints];
    }
    return userPoints;
  }, [userPoints, baselineTelemetry]);

  // Daily aggregate dataset (last 7 days aggregate score)
  const dailyData = useMemo(() => {
    const days: { [day: string]: { scores: number[]; probs: number[]; count: number } } = {};
    const now = new Date();

    // Initialize past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      // Baseline synthetic default based on day index
      const defaultScore = 70 + (i % 3) * 6 - (i % 2) * 8;
      days[key] = { scores: [defaultScore], probs: [defaultScore + 2], count: 1 };
    }

    // Incorporate user history into daily buckets
    history.forEach((h) => {
      const d = new Date(h.timestamp);
      const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (days[key]) {
        days[key].scores.push(h.riskScore);
        days[key].probs.push(h.scamProbability);
        days[key].count += 1;
      }
    });

    return Object.entries(days).map(([dayLabel, val]) => {
      const avgScore = Math.round(val.scores.reduce((a, b) => a + b, 0) / val.scores.length);
      const avgProb = Math.round(val.probs.reduce((a, b) => a + b, 0) / val.probs.length);
      return {
        id: dayLabel,
        timestamp: dayLabel,
        timeLabel: dayLabel,
        fullDate: dayLabel,
        riskScore: avgScore,
        scamProbability: avgProb,
        category: `${val.count} Threat(s) Monitored`,
        riskLevel: (avgScore >= 80 ? 'CRITICAL' : avgScore >= 60 ? 'HIGH' : avgScore >= 40 ? 'MEDIUM' : 'LOW') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        channel: 'Aggregated',
        isUserScan: val.count > 1,
        summary: `Average threat score: ${avgScore}/100 across monitored incidents.`,
      };
    });
  }, [history]);

  const activeData = timeframe === 'timeline' ? timelineData : dailyData;

  // Key metrics over the displayed curve
  const avgScore = Math.round(
    activeData.reduce((acc, curr) => acc + curr.riskScore, 0) / (activeData.length || 1)
  );
  const maxScore = Math.max(...activeData.map((d) => d.riskScore), 0);
  const criticalCount = activeData.filter((d) => d.riskScore >= 80).length;

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md shadow-xl space-y-6"
      id="historical-risk-trends-section"
    >
      {/* Top Header with title and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Forensic Threat Intelligence • Recharts Analytics</span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            Historical Risk Score Trends
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological trend analysis tracking threat score fluctuations across scanned vectors and security telemetry.
          </p>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="inline-flex rounded-lg bg-slate-800/90 p-0.5 border border-slate-700 text-xs font-mono">
            <button
              id="chart-view-timeline-btn"
              type="button"
              onClick={() => setTimeframe('timeline')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeframe === 'timeline'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scan Timeline
            </button>
            <button
              id="chart-view-daily-btn"
              type="button"
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeframe === 'daily'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7-Day Average
            </button>
          </div>

          {/* Toggle Critical Thresholds */}
          <button
            id="toggle-thresholds-btn"
            type="button"
            onClick={() => setShowThresholds(!showThresholds)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-center space-x-1.5 ${
              showThresholds
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle critical and medium danger reference lines"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Thresholds</span>
          </button>

          {/* Toggle Probability Curve */}
          <button
            id="toggle-probability-btn"
            type="button"
            onClick={() => setShowProbability(!showProbability)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-center space-x-1.5 ${
              showProbability
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle scam probability comparison curve"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Probability %</span>
          </button>
        </div>
      </div>

      {/* Metric summary badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Trend Period Average
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-white">{avgScore}</span>
            <span className="text-xs font-mono text-slate-500">/100</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {avgScore >= 80 ? 'Critical Threat Range' : avgScore >= 50 ? 'Elevated Danger' : 'Guarded State'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="block text-[10px] font-mono text-rose-400 uppercase tracking-wider">
            Peak Danger Score
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-rose-400">{maxScore}</span>
            <span className="text-xs font-mono text-slate-500">/100</span>
          </div>
          <span className="text-[10px] text-rose-400/80 block mt-0.5">Severe Risk Event</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="block text-[10px] font-mono text-amber-400 uppercase tracking-wider">
            Critical Scans (≥80)
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-amber-300">{criticalCount}</span>
            <span className="text-xs font-mono text-slate-500">/ {activeData.length} pts</span>
          </div>
          <span className="text-[10px] text-amber-400/80 block mt-0.5">Immediate Red Flags</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
            Live User Scans
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-cyan-300">{history.length}</span>
            <span className="text-xs font-mono text-slate-500">recorded</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 block mt-0.5">
            {history.length > 0 ? 'Integrated into curve' : 'Awaiting live scans'}
          </span>
        </div>
      </div>

      {/* Main Line Chart Canvas */}
      <div className="w-full h-80 pt-2" id="recharts-line-chart-container">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <LineChart
            data={activeData}
            margin={{ top: 18, right: 25, left: -10, bottom: 10 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                const point = e.activePayload[0].payload as TrendPoint;
                if (point.originalReport && onSelectReport) {
                  onSelectReport(point.originalReport);
                }
              }
            }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            {/* X & Y Axes */}
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${val}`}
            />

            {/* Critical Danger Reference Line (80) */}
            {showThresholds && (
              <ReferenceLine
                y={80}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                strokeOpacity={0.7}
                label={{
                  value: 'CRITICAL ZONE (80)',
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'monospace',
                }}
              />
            )}

            {/* Suspicious Threshold Reference Line (50) */}
            {showThresholds && (
              <ReferenceLine
                y={50}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1}
                strokeOpacity={0.6}
                label={{
                  value: 'SUSPICIOUS (50)',
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'monospace',
                }}
              />
            )}

            {/* Custom Interactive Cyber Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as TrendPoint;
                const isCritical = data.riskScore >= 80;
                const isHigh = data.riskScore >= 60 && data.riskScore < 80;
                const isMed = data.riskScore >= 40 && data.riskScore < 60;

                const scoreColor = isCritical
                  ? 'text-rose-400'
                  : isHigh
                  ? 'text-orange-400'
                  : isMed
                  ? 'text-amber-400'
                  : 'text-emerald-400';

                const badgeBg = isCritical
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : isHigh
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                  : isMed
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';

                return (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-xl max-w-xs text-xs space-y-2 z-50">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-mono text-[11px] text-slate-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{data.fullDate}</span>
                      </span>
                      {data.isUserScan ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                          Live Scan
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                          Telemetry
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono">Risk Score:</span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-base font-black font-mono ${scoreColor}`}>
                          {data.riskScore}/100
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase border ${badgeBg}`}>
                          {data.riskLevel}
                        </span>
                      </div>
                    </div>

                    {showProbability && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono">Scam Probability:</span>
                        <span className="font-mono font-bold text-purple-300">
                          {data.scamProbability}%
                        </span>
                      </div>
                    )}

                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[170px]">
                          {data.category}
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">
                          [{data.channel}]
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {data.summary}
                      </p>
                    </div>

                    {data.originalReport && onSelectReport && (
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-cyan-400 font-mono text-[10px] font-semibold">
                        <span>Click point to open report</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Optional Legend */}
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }}
            />

            {/* Primary Threat Risk Score Line */}
            <Line
              type="monotone"
              dataKey="riskScore"
              name="Threat Risk Score"
              stroke="#06b6d4"
              strokeWidth={2.8}
              activeDot={{
                r: 7,
                fill: '#06b6d4',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              dot={(dotProps) => {
                const { cx, cy, payload } = dotProps;
                if (!cx || !cy) return <circle key={`dot-fallback-${dotProps.key}`} />;
                const pt = payload as TrendPoint;
                const isCrit = pt.riskScore >= 80;
                const dotColor = isCrit
                  ? '#f43f5e'
                  : pt.riskScore >= 60
                  ? '#f97316'
                  : pt.riskScore >= 40
                  ? '#f59e0b'
                  : '#10b981';

                return (
                  <g key={`dot-${pt.id}-${cx}-${cy}`}>
                    {/* Pulsing ring for user's live scans */}
                    {pt.isUserScan && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeOpacity={0.8}
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={pt.isUserScan ? 5 : 4}
                      fill={dotColor}
                      stroke="#0f172a"
                      strokeWidth={2}
                      className="cursor-pointer transition-transform hover:scale-125"
                    />
                  </g>
                );
              }}
            />

            {/* Secondary Scam Probability Line (optional toggle) */}
            {showProbability && (
              <Line
                type="monotone"
                dataKey="scamProbability"
                name="Scam Probability %"
                stroke="#c084fc"
                strokeWidth={1.8}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#c084fc' }}
                activeDot={{ r: 5, fill: '#c084fc', stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Chart Legend & Guidance Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Critical (&ge;80)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <span>High (60-79)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Medium (40-59)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Low (&lt;40)</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-cyan-400/90">
          <span className="w-2 h-2 rounded-full border border-cyan-400 inline-block animate-ping" />
          <span>Rings indicate your live scanned communications</span>
        </div>
      </div>
    </div>
  );
};
