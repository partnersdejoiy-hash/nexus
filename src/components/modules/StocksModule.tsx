'use client';

import React from 'react';

const STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 138.50, change: +3.42, percent: '+2.53%', volume: '48.2M', cap: '$3.40T' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 224.30, change: +1.80, percent: '+0.81%', volume: '32.1M', cap: '$3.42T' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 254.10, change: -2.15, percent: '-0.84%', volume: '54.8M', cap: '$810B' },
  { symbol: 'MSFT', name: 'Microsoft', price: 428.90, change: +2.10, percent: '+0.49%', volume: '18.4M', cap: '$3.18T' },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 64250.0, change: +1450.0, percent: '+2.31%', volume: '$28B', cap: '$1.26T' },
];

export const StocksModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈 MARKET INTELLIGENCE & STOCKS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time equities, sector allocation & 3D floor grid overlay</p>
        </div>
        <div className="rounded bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-800">
          PORTFOLIO: $142,850.00 (+18.4%)
        </div>
      </div>

      {/* Ticker Row */}
      <div className="grid grid-cols-5 gap-3">
        {STOCKS.map((stock) => (
          <div key={stock.symbol} className="rounded-xl glass-panel p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{stock.symbol}</span>
              <span className={`text-[10px] font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.percent}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100">${stock.price.toFixed(2)}</div>
            <div className="text-[9px] text-slate-500">Vol: {stock.volume}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Allocation & Sector Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl glass-panel p-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-200">SECTOR EXPOSURE</h3>
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Semiconductors (NVDA, TSM)</span>
                <span className="text-cyan-400 font-bold">42%</span>
              </div>
              <div className="h-2 rounded bg-slate-900 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Software & AI Platforms (MSFT, AMZN)</span>
                <span className="text-purple-400 font-bold">28%</span>
              </div>
              <div className="h-2 rounded bg-slate-900 overflow-hidden">
                <div className="h-full bg-purple-400 rounded" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Digital Assets & Crypto (BTC, ETH)</span>
                <span className="text-amber-400 font-bold">18%</span>
              </div>
              <div className="h-2 rounded bg-slate-900 overflow-hidden">
                <div className="h-full bg-amber-400 rounded" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Financial Summary */}
        <div className="rounded-xl glass-panel p-4 flex flex-col gap-2 border border-cyan-500/30">
          <h3 className="text-sm font-bold text-cyan-300">GEMINI MARKET BREAKDOWN</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Semiconductor momentum remains strong following key AI data center expansion announcements. NVIDIA portfolio weight is driving +14.2% quarterly alpha. Risk parameters are within optimal thresholds."
          </p>
        </div>
      </div>
    </div>
  );
};
