import React, { useMemo, useState } from "react";
import { StorageUnit, TemperatureLog } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
// Fix: Splitting imports can help resolve TypeScript resolution issues where specific named exports from the 'date-fns' package root are not being correctly detected by the compiler.
import { format } from "date-fns";
import { subDays } from "date-fns";
import { isWithinInterval } from "date-fns";
import { startOfDay } from "date-fns";
import { endOfDay } from "date-fns";
import { parseISO } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Filter } from "lucide-react";

interface AnalyticsProps {
  units: StorageUnit[];
  logs: TemperatureLog[];
}

const Analytics: React.FC<AnalyticsProps> = ({ units, logs }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    units[0]?.id || ""
  );
  const [startDateStr, setStartDateStr] = useState(
    format(subDays(new Date(), 6), "yyyy-MM-dd")
  );
  const [endDateStr, setEndDateStr] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const chartData = useMemo(() => {
    const start = startOfDay(parseISO(startDateStr));
    const end = endOfDay(parseISO(endDateStr));

    const filteredLogs = logs
      .filter((l) => l.unitId === selectedUnitId)
      .filter((l) => {
        const logDate = new Date(l.timestamp);
        return isWithinInterval(logDate, { start, end });
      })
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return filteredLogs.map((l) => ({
      time: format(new Date(l.timestamp), "MM-dd HH:mm"),
      temp: l.temperature,
      timestamp: l.timestamp,
    }));
  }, [logs, selectedUnitId, startDateStr, endDateStr]);

  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  const setFixedRange = (days: number) => {
    setStartDateStr(format(subDays(new Date(), days - 1), "yyyy-MM-dd"));
    setEndDateStr(format(new Date(), "yyyy-MM-dd"));
    setIsRangeOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1C1E] tracking-tight">
            趋势分析
          </h1>
          <p className="text-slate-500 font-medium">
            监测冷库历史温度波动的核心看板
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center space-x-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 hover:border-[#6C5CE7]/30 transition-all group"
          >
            <div className="p-2 bg-[#F3F0FF] text-[#6C5CE7] rounded-xl group-hover:scale-110 transition-transform">
              <CalendarIcon size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                选择日期范围
              </p>
              <p className="text-sm font-bold text-slate-700">
                {startDateStr} 至 {endDateStr}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-300 transition-transform ${
                isRangeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isRangeOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-[32px] shadow-2xl border border-slate-50 p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFixedRange(d)}
                      className="py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-500 hover:bg-[#F3F0FF] hover:text-[#6C5CE7] transition-colors"
                    >
                      {d}天
                    </button>
                  ))}
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">
                      开始日期
                    </label>
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">
                      结束日期
                    </label>
                    <input
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsRangeOpen(false)}
                  className="w-full py-3 bg-[#6C5CE7] text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-100"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="bg-white rounded-[40px] p-8 shadow-xl border border-white/50 space-y-8">
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 p-2 bg-slate-50 rounded-xl text-slate-400">
            <Filter size={18} />
          </div>
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedUnitId === unit.id
                  ? "bg-[#6C5CE7] text-white shadow-lg shadow-purple-100"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              }`}
            >
              {unit.name}
            </button>
          ))}
        </div>

        <div className="h-[350px] w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  unit="°C"
                  domain={[
                    (dataMin) => Math.floor(dataMin - 1),
                    (dataMax) => Math.ceil(dataMax + 1),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#6C5CE7",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#94a3b8",
                    fontSize: "10px",
                    marginBottom: "4px",
                  }}
                />
                {selectedUnit && (
                  <>
                    <ReferenceLine
                      y={selectedUnit.maxTemp}
                      label={{
                        position: "right",
                        value: "MAX",
                        fill: "#FF823C",
                        fontSize: 8,
                        fontWeight: "bold",
                      }}
                      stroke="#FF823C"
                      strokeDasharray="5 5"
                      opacity={0.5}
                    />
                    <ReferenceLine
                      y={selectedUnit.minTemp}
                      label={{
                        position: "right",
                        value: "MIN",
                        fill: "#3CA7FF",
                        fontSize: 8,
                        fontWeight: "bold",
                      }}
                      stroke="#3CA7FF"
                      strokeDasharray="5 5"
                      opacity={0.5}
                    />
                  </>
                )}
                <Line
                  type="monotone"
                  name="实测温度"
                  dataKey="temp"
                  stroke="#6C5CE7"
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 4,
                    stroke: "#fff",
                    fill: "#6C5CE7",
                  }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center">
                <CalendarIcon size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-400">暂无历史记录</p>
                <p className="text-[10px] uppercase tracking-widest mt-1">
                  请尝试调整筛选范围
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "平均温度",
            val:
              chartData.length > 0
                ? (
                    chartData.reduce((acc, curr) => acc + curr.temp, 0) /
                    chartData.length
                  ).toFixed(1) + "°C"
                : "--",
            color: "text-slate-700",
          },
          {
            label: "最高温度",
            val:
              chartData.length > 0
                ? Math.max(...chartData.map((d) => d.temp)) + "°C"
                : "--",
            color: "text-[#FF823C]",
          },
          {
            label: "最低温度",
            val:
              chartData.length > 0
                ? Math.min(...chartData.map((d) => d.temp)) + "°C"
                : "--",
            color: "text-[#3CA7FF]",
          },
          {
            label: "记录点数",
            val: chartData.length + " 次",
            color: "text-[#6C5CE7]",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
