
import React from 'react';
import { StorageUnit, TemperatureLog, UnitStatus } from '../types';
import { CheckCircle2, Clock, Package, MapPin, ChevronRight, PowerOff, WifiOff } from 'lucide-react';

interface DashboardProps {
  units: StorageUnit[];
  logs: TemperatureLog[];
  onStartLogging: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ units, logs, onStartLogging }) => {
  const activeUnits = units.filter(u => u.status === UnitStatus.ACTIVE);
  const today = new Date().toISOString().split('T')[0];
  
  const loggedTodayIds = new Set(
    logs.filter(l => l.timestamp.startsWith(today)).map(l => l.unitId)
  );

  const pendingUnits = activeUnits.filter(u => !loggedTodayIds.has(u.id));
  const unsyncedCount = logs.filter(l => !l.synced).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const cardColors = [
    'bg-[#FFF0E6] text-[#FF823C]', // Orange
    'bg-[#E6F5FF] text-[#3CA7FF]', // Blue
    'bg-[#F3E8FF] text-[#9D59FF]', // Purple
    'bg-[#E9FBF0] text-[#27AE60]', // Green
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1C1E] tracking-tight">{getGreeting()}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-slate-500 font-medium">今天还有 {pendingUnits.length} 项登记任务</p>
            {unsyncedCount > 0 && (
              <>
                <span className="text-slate-300 text-xs">|</span>
                <span className="text-xs font-bold text-orange-500 flex items-center">
                  <WifiOff size={10} className="mr-1"/> {unsyncedCount} 条记录待同步
                </span>
              </>
            )}
          </div>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center">
            <span className="text-[10px] text-[#6C5CE7] font-bold uppercase">Today</span>
            <span className="text-lg font-bold">{new Date().getDate()}</span>
        </div>
      </header>

      {/* Horizontal Scroll Area for Tasks */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">今日任务</h2>
          <span className="text-xs font-bold text-[#6C5CE7] bg-[#F3F0FF] px-3 py-1 rounded-full">进行中</span>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
          {pendingUnits.length > 0 ? (
            pendingUnits.map((unit, index) => (
              <div 
                key={unit.id}
                onClick={onStartLogging}
                className={`flex-shrink-0 w-44 p-5 rounded-[32px] flex flex-col space-y-4 cursor-pointer custom-shadow transform transition-transform hover:scale-105 active:scale-95 ${cardColors[index % cardColors.length]}`}
              >
                <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 truncate">{unit.name}</h3>
                  <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider">{unit.type === 'FREEZER' ? '冷冻' : '保鲜'}</p>
                </div>
                {unit.storedItems && (
                  <div className="text-[11px] font-medium bg-white/30 p-2 rounded-xl truncate">
                    {unit.storedItems}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full bg-[#E9FBF0] p-6 rounded-[32px] flex items-center justify-center space-x-3 text-[#27AE60]">
               <CheckCircle2 size={24} />
               <span className="font-bold">所有冷库已录入完成</span>
            </div>
          )}
        </div>
      </section>

      {/* Summary List Area */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">所有冷库状态</h2>
          <button className="text-sm font-bold text-[#6C5CE7]">查看全部</button>
        </div>

        <div className="space-y-3">
          {units.map(unit => {
            const isInactive = unit.status === UnitStatus.INACTIVE;
            const isDone = loggedTodayIds.has(unit.id);
            const latestLog = logs.filter(l => l.unitId === unit.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
            const isWarning = latestLog && (latestLog.temperature > unit.maxTemp || latestLog.temperature < unit.minTemp);

            return (
              <div key={unit.id} className={`bg-white p-4 rounded-[28px] border border-slate-100 flex items-center justify-between transition-all ${isInactive ? 'opacity-60 grayscale-[0.5]' : 'hover:border-[#6C5CE7]/30'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isInactive ? 'bg-slate-100 text-slate-400' :
                    isDone ? 'bg-[#E9FBF0] text-[#27AE60]' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {isInactive ? <PowerOff size={24} /> : isDone ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-800 text-sm">{unit.name}</h4>
                      {isInactive && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase">停用中</span>}
                    </div>
                    <div className="flex items-center text-[10px] text-slate-400 mt-0.5 space-x-2">
                       <span className="flex items-center"><Package size={10} className="mr-0.5"/> {unit.storedItems || '空'}</span>
                       <span className="flex items-center"><MapPin size={10} className="mr-0.5"/> {unit.minTemp}~{unit.maxTemp}°C</span>
                    </div>
                  </div>
                </div>
                {!isInactive && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-base font-extrabold ${isWarning ? 'text-red-500 animate-pulse' : 'text-[#6C5CE7]'}`}>
                        {latestLog ? `${latestLog.temperature}°C` : '--'}
                      </p>
                      {latestLog && (
                        <p className="text-[10px] text-slate-300">{new Date(latestLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-slate-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
