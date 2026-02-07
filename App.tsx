
import React, { useState, useEffect } from 'react';
import { StorageUnit, TemperatureLog, ReminderConfig, AppView } from './types';
import { db } from './services/db';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Logger from './components/Logger';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { CloudOff, CloudCheck, CloudUpload } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [reminder, setReminder] = useState<ReminderConfig>({ reminderTime: '09:00', enabled: true });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setUnits(db.getUnits());
    setLogs(db.getLogs());
    setReminder(db.getReminderConfig());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 模拟自动同步逻辑
  useEffect(() => {
    if (isOnline && logs.some(l => !l.synced)) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        const syncedLogs = logs.map(l => ({ ...l, synced: true }));
        setLogs(syncedLogs);
        db.updateLogs(syncedLogs);
        setIsSyncing(false);
        console.log('数据已自动同步至云端');
      }, 2000); // 模拟2秒的网络上传延迟
      return () => clearTimeout(timer);
    }
  }, [isOnline, logs]);

  const handleSaveLog = (unitId: string, temperature: number) => {
    const newLog = db.addLog({
      unitId,
      temperature,
      timestamp: new Date().toISOString(),
      recordedBy: '老板'
    });
    setLogs([...db.getLogs()]);
    setView('dashboard');
  };

  const handleUpdateUnits = (newUnits: StorageUnit[]) => {
    setUnits(newUnits);
    db.saveUnits(newUnits);
  };

  const handleUpdateReminder = (newReminder: ReminderConfig) => {
    setReminder(newReminder);
    db.saveReminderConfig(newReminder);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard units={units} logs={logs} onStartLogging={() => setView('log')} />;
      case 'log':
        return <Logger units={units} onSave={handleSaveLog} onCancel={() => setView('dashboard')} />;
      case 'analytics':
        return <Analytics units={units} logs={logs} />;
      case 'settings':
        return (
          <Settings 
            units={units} 
            reminderConfig={reminder} 
            onUpdateUnits={handleUpdateUnits} 
            onUpdateReminder={handleUpdateReminder} 
          />
        );
      default:
        return <Dashboard units={units} logs={logs} onStartLogging={() => setView('log')} />;
    }
  };

  return (
    <div className="min-h-screen pb-32 pt-8 px-4 md:pb-0 md:pl-32 md:pt-16 max-w-7xl mx-auto">
      {/* 离线状态指示器 */}
      <div className="fixed top-4 right-4 z-[100] flex items-center space-x-2 px-3 py-1.5 rounded-full glass-card border-white/40 shadow-lg">
        {isSyncing ? (
          <div className="flex items-center text-[#6C5CE7] space-x-2">
            <CloudUpload size={16} className="animate-bounce" />
            <span className="text-[10px] font-bold">同步中...</span>
          </div>
        ) : !isOnline ? (
          <div className="flex items-center text-orange-500 space-x-2">
            <CloudOff size={16} />
            <span className="text-[10px] font-bold">离线模式 (数据本地暂存)</span>
          </div>
        ) : (
          <div className="flex items-center text-green-500 space-x-2">
            <CloudCheck size={16} />
            <span className="text-[10px] font-bold">云端已同步</span>
          </div>
        )}
      </div>

      <Navigation currentView={view} onViewChange={setView} />
      <div className="max-w-xl mx-auto md:max-w-full">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
