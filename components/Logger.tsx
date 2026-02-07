
import React, { useState } from 'react';
import { StorageUnit, UnitStatus } from '../types';
import { Save, ChevronLeft, MapPin, Package, Thermometer } from 'lucide-react';

interface LoggerProps {
  units: StorageUnit[];
  onSave: (unitId: string, temperature: number) => void;
  onCancel: () => void;
}

const Logger: React.FC<LoggerProps> = ({ units, onSave, onCancel }) => {
  const activeUnits = units.filter(u => u.status === UnitStatus.ACTIVE);
  const [selectedUnitId, setSelectedUnitId] = useState(activeUnits[0]?.id || '');
  const [temp, setTemp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUnit = units.find(u => u.id === selectedUnitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || temp === '') return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(selectedUnitId, parseFloat(temp));
      setTemp('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between">
        <button onClick={onCancel} className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-[#1A1C1E]">登记今日温度</h1>
        <div className="w-10"></div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-8 shadow-xl border border-white/50 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block px-1">选择冷库</label>
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {activeUnits.map(unit => (
              <button
                key={unit.id}
                type="button"
                onClick={() => setSelectedUnitId(unit.id)}
                className={`flex-shrink-0 px-6 py-4 rounded-[24px] text-sm font-bold transition-all border-2 ${
                  selectedUnitId === unit.id 
                    ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-lg shadow-purple-100 scale-105' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                }`}
              >
                {unit.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
          <div className="flex justify-between items-center px-1">
             <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">输入实测值</label>
             {selectedUnit && (
               <div className="text-[10px] font-bold text-[#6C5CE7] bg-[#F3F0FF] px-2 py-1 rounded-lg">
                 标准: {selectedUnit.minTemp} ~ {selectedUnit.maxTemp}°C
               </div>
             )}
          </div>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder="0.0"
              className="w-full text-6xl font-black bg-transparent border-none p-4 text-[#1A1C1E] focus:ring-0 placeholder:text-slate-100 text-center"
            />
            <span className="absolute right-4 text-3xl font-bold text-slate-300">°C</span>
          </div>
          {selectedUnit?.storedItems && (
            <div className="flex justify-center">
               <span className="text-[11px] text-slate-400 flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                  <Package size={12} className="mr-1"/> 存放: {selectedUnit.storedItems}
               </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || temp === ''}
          className={`w-full py-5 rounded-[28px] font-bold text-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
            isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-[#6C5CE7] text-white shadow-2xl shadow-purple-200 hover:bg-[#5B4BC4]'
          }`}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Save size={20} />
              <span>保存数据</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center">
         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">* 所有数据均会被实时加密并永久记录</p>
      </div>
    </div>
  );
};

export default Logger;
