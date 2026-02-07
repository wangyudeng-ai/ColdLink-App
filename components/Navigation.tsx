
import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Thermometer, LineChart, Settings, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', label: '概览', icon: LayoutDashboard },
    { id: 'analytics', label: '趋势', icon: LineChart },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl rounded-[32px] px-6 py-3 flex justify-between items-center z-50 shadow-2xl border border-white/50 md:top-0 md:left-0 md:translate-x-0 md:flex-col md:w-24 md:h-full md:rounded-none md:py-10">
      <div className="hidden md:block mb-12">
        <div className="w-12 h-12 bg-[#6C5CE7] rounded-2xl flex items-center justify-center text-white font-bold">CL</div>
      </div>

      <button
        onClick={() => onViewChange('dashboard')}
        className={`p-3 rounded-2xl transition-all ${currentView === 'dashboard' ? 'text-[#6C5CE7] bg-[#F3F0FF]' : 'text-slate-400'}`}
      >
        <LayoutDashboard size={24} />
      </button>

      <button
        onClick={() => onViewChange('analytics')}
        className={`p-3 rounded-2xl transition-all ${currentView === 'analytics' ? 'text-[#6C5CE7] bg-[#F3F0FF]' : 'text-slate-400'}`}
      >
        <LineChart size={24} />
      </button>

      {/* Main Action Button - Floating Center */}
      <button
        onClick={() => onViewChange('log')}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${
          currentView === 'log' ? 'active-nav' : 'bg-[#6C5CE7] text-white shadow-lg shadow-purple-200'
        }`}
      >
        <Plus size={28} />
      </button>

      <button
        onClick={() => onViewChange('settings')}
        className={`p-3 rounded-2xl transition-all ${currentView === 'settings' ? 'text-[#6C5CE7] bg-[#F3F0FF]' : 'text-slate-400'}`}
      >
        <Settings size={24} />
      </button>
      
      <div className="hidden md:block mt-auto text-[10px] text-slate-300 font-bold uppercase tracking-widest">ColdLink</div>
    </nav>
  );
};

export default Navigation;
