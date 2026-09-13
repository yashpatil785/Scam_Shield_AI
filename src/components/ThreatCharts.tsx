import React from 'react';

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface RiskDistributionData {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface ThreatChartsProps {
  categories: CategoryData[];
  riskDistribution: RiskDistributionData;
}

export const ThreatCharts: React.FC<ThreatChartsProps> = ({ categories, riskDistribution }) => {
  const total = riskDistribution.total || 1;
  const criticalPct = Math.round((riskDistribution.critical / total) * 100);
  const highPct = Math.round((riskDistribution.high / total) * 100);
  const mediumPct = Math.round((riskDistribution.medium / total) * 100);
  const lowPct = Math.round((riskDistribution.low / total) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="threat-charts-section">
      {/* Risk Distribution Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm" id="chart-risk-distribution">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">Threat Severity Distribution</h3>
            <p className="text-xs text-slate-400">Proportion of scanned threats across severity bands</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Total: {total.toLocaleString()}
          </span>
        </div>

        {/* Multi-segment stacked bar */}
        <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex mb-4 p-0.5 border border-slate-700/50">
          <div
            style={{ width: `${criticalPct}%` }}
            className="h-full bg-rose-500 rounded-l-full transition-all duration-700"
            title={`Critical: ${riskDistribution.critical} (${criticalPct}%)`}
          />
          <div
            style={{ width: `${highPct}%` }}
            className="h-full bg-orange-500 transition-all duration-700"
            title={`High: ${riskDistribution.high} (${highPct}%)`}
          />
          <div
            style={{ width: `${mediumPct}%` }}
            className="h-full bg-amber-500 transition-all duration-700"
            title={`Medium: ${riskDistribution.medium} (${mediumPct}%)`}
          />
          <div
            style={{ width: `${lowPct}%` }}
            className="h-full bg-emerald-500 rounded-r-full transition-all duration-700"
            title={`Low: ${riskDistribution.low} (${lowPct}%)`}
          />
        </div>

        {/* Breakdown Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="block text-[11px] font-mono text-rose-400 uppercase tracking-wider">Critical</span>
            <span className="text-xl font-bold font-mono text-rose-300">{riskDistribution.critical}</span>
            <span className="block text-[10px] text-rose-400/80 font-mono">{criticalPct}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
            <span className="block text-[11px] font-mono text-orange-400 uppercase tracking-wider">High</span>
            <span className="text-xl font-bold font-mono text-orange-300">{riskDistribution.high}</span>
            <span className="block text-[10px] text-orange-400/80 font-mono">{highPct}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="block text-[11px] font-mono text-amber-400 uppercase tracking-wider">Medium</span>
            <span className="text-xl font-bold font-mono text-amber-300">{riskDistribution.medium}</span>
            <span className="block text-[10px] text-amber-400/80 font-mono">{mediumPct}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="block text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Low</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{riskDistribution.low}</span>
            <span className="block text-[10px] text-emerald-400/80 font-mono">{lowPct}%</span>
          </div>
        </div>

        {/* Visual ring/gauge explanation note */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>High & Critical Risk Incident Rate:</span>
          <span className="font-mono font-semibold text-rose-400">
            {Math.round(((riskDistribution.critical + riskDistribution.high) / total) * 100)}% of scans
          </span>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm" id="chart-scam-categories">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">Threat Vectors by Category</h3>
            <p className="text-xs text-slate-400">Prevalence of detected attack vectors in intelligence database</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ranked</span>
        </div>

        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const barColor =
              cat.riskLevel === 'CRITICAL'
                ? 'bg-rose-500'
                : cat.riskLevel === 'HIGH'
                ? 'bg-orange-500'
                : cat.riskLevel === 'MEDIUM'
                ? 'bg-amber-500'
                : 'bg-emerald-500';

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium truncate max-w-[220px]">
                    {cat.category}
                  </span>
                  <div className="flex items-center space-x-2 font-mono text-slate-400">
                    <span className="text-white font-semibold">{cat.count}</span>
                    <span className="text-[11px] text-slate-500">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
