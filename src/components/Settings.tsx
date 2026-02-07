import React, { useState } from "react";
import { StorageUnit, ReminderConfig, UnitStatus, UnitType } from "../types";
import {
  Bell,
  Trash2,
  Plus,
  Power,
  Edit3,
  X,
  Package,
  PowerOff,
} from "lucide-react";

interface SettingsProps {
  units: StorageUnit[];
  reminderConfig: ReminderConfig;
  onUpdateUnits: (units: StorageUnit[]) => void;
  onUpdateReminder: (config: ReminderConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({
  units,
  reminderConfig,
  onUpdateUnits,
  onUpdateReminder,
}) => {
  const [isEditingReminder, setIsEditingReminder] = useState(false);
  const [tempTime, setTempTime] = useState(reminderConfig.reminderTime);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Form state for unit
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<UnitType>(UnitType.FREEZER);
  const [newStatus, setNewStatus] = useState<UnitStatus>(UnitStatus.ACTIVE);
  const [newMin, setNewMin] = useState("-22");
  const [newMax, setNewMax] = useState("-18");
  const [newItems, setNewItems] = useState("");

  const MAX_UNITS = 20;

  const toggleUnitStatus = (id: string) => {
    const updated = units.map((u) =>
      u.id === id
        ? {
            ...u,
            status:
              u.status === UnitStatus.ACTIVE
                ? UnitStatus.INACTIVE
                : UnitStatus.ACTIVE,
          }
        : u
    );
    onUpdateUnits(updated);
  };

  const deleteUnit = (id: string) => {
    if (window.confirm("确定要删除该冷库吗？相关历史数据可能无法关联。")) {
      onUpdateUnits(units.filter((u) => u.id !== id));
    }
  };

  const openEditModal = (unit: StorageUnit) => {
    setEditingUnitId(unit.id);
    setNewName(unit.name);
    setNewType(unit.type);
    setNewStatus(unit.status);
    setNewMin(unit.minTemp.toString());
    setNewMax(unit.maxTemp.toString());
    setNewItems(unit.storedItems);
    setShowAddModal(true);
  };

  const closeAndResetModal = () => {
    setShowAddModal(false);
    setEditingUnitId(null);
    setNewName("");
    setNewItems("");
    setNewStatus(UnitStatus.ACTIVE);
    setNewMin("-22");
    setNewMax("-18");
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUnitId) {
      const updated = units.map((u) =>
        u.id === editingUnitId
          ? {
              ...u,
              name: newName,
              type: newType,
              status: newStatus,
              minTemp: parseFloat(newMin),
              maxTemp: parseFloat(newMax),
              storedItems: newItems,
            }
          : u
      );
      onUpdateUnits(updated);
    } else {
      if (units.length >= MAX_UNITS) {
        alert(`已达到最大上限 ${MAX_UNITS} 个库，无法添加更多。`);
        return;
      }
      const newUnit: StorageUnit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        type: newType,
        status: newStatus,
        minTemp: parseFloat(newMin),
        maxTemp: parseFloat(newMax),
        storedItems: newItems,
      };
      onUpdateUnits([...units, newUnit]);
    }
    closeAndResetModal();
  };

  const handleTimeSave = () => {
    onUpdateReminder({ ...reminderConfig, reminderTime: tempTime });
    setIsEditingReminder(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">系统设置</h1>
        <p className="text-slate-500">管理冷库资产及系统提醒行为</p>
      </header>

      {/* Reminder Section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">每日登记提醒</h2>
              <p className="text-sm text-slate-500">
                在固定时间提醒进行温度记录
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateReminder({
                ...reminderConfig,
                enabled: !reminderConfig.enabled,
              })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              reminderConfig.enabled ? "bg-[#6C5CE7]" : "bg-slate-200"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                reminderConfig.enabled ? "left-7" : "left-1"
              }`}
            ></div>
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-sm">提醒时间</span>
            {isEditingReminder ? (
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  className="bg-white border-none rounded-lg p-1 text-lg font-bold"
                />
                <button
                  onClick={handleTimeSave}
                  className="px-3 py-1 bg-[#6C5CE7] text-white rounded-lg text-sm font-bold"
                >
                  保存
                </button>
              </div>
            ) : (
              <div className="text-xl font-bold mt-1 text-slate-800">
                {reminderConfig.reminderTime}
              </div>
            )}
          </div>
          {!isEditingReminder && (
            <button
              onClick={() => setIsEditingReminder(true)}
              className="text-[#6C5CE7] text-sm font-bold hover:underline"
            >
              修改
            </button>
          )}
        </div>
      </section>

      {/* Units Management */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-lg">冷库列表管理</h2>
            <p className="text-xs text-slate-400">
              目前已有 {units.length}/{MAX_UNITS} 个冷库
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={units.length >= MAX_UNITS}
            className={`flex items-center space-x-1 text-sm px-4 py-2 rounded-xl transition-all font-bold ${
              units.length >= MAX_UNITS
                ? "bg-slate-100 text-slate-400"
                : "bg-[#6C5CE7] text-white hover:bg-[#5B4BC4] shadow-md shadow-purple-100"
            }`}
          >
            <Plus size={16} />
            <span>添加新库</span>
          </button>
        </div>

        <div className="space-y-4">
          {units.map((unit) => {
            const isActive = unit.status === UnitStatus.ACTIVE;
            return (
              <div
                key={unit.id}
                className={`p-4 rounded-3xl border border-slate-50 bg-slate-50/50 flex flex-col space-y-3 transition-opacity ${
                  !isActive ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                        !isActive
                          ? "bg-slate-200 text-slate-400"
                          : unit.type === UnitType.FREEZER
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {unit.type === UnitType.FREEZER ? "冷" : "保"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-800">
                          {unit.name}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isActive ? "在使用中" : "已停用"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        标准: {unit.minTemp} ~ {unit.maxTemp}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleUnitStatus(unit.id)}
                      title={isActive ? "暂停使用" : "恢复使用"}
                      className={`p-2 rounded-xl transition-all ${
                        isActive
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-slate-400 bg-white hover:bg-slate-100"
                      }`}
                    >
                      {isActive ? <Power size={20} /> : <PowerOff size={20} />}
                    </button>
                    <button
                      onClick={() => openEditModal(unit)}
                      className="p-2 text-slate-400 bg-white rounded-xl hover:text-[#6C5CE7] hover:bg-purple-50 transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => deleteUnit(unit.id)}
                      className="p-2 text-slate-400 bg-white rounded-xl hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {unit.storedItems && (
                  <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 bg-white/60 p-2.5 rounded-2xl">
                    <Package
                      size={14}
                      className="text-slate-400 flex-shrink-0"
                    />
                    <span className="truncate">内容：{unit.storedItems}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingUnitId ? "修改冷库" : "添加冷库"}
              </h2>
              <button
                onClick={closeAndResetModal}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveUnit} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      冷库名称
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="例如：5号冷冻库"
                      className="w-full bg-white border-none rounded-2xl p-4 font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      存放物品
                    </label>
                    <input
                      type="text"
                      value={newItems}
                      onChange={(e) => setNewItems(e.target.value)}
                      placeholder="例如：猪肉、冷冻蔬菜..."
                      className="w-full bg-white border-none rounded-2xl p-4 font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      类型
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewType(UnitType.FREEZER);
                          setNewMin("-22");
                          setNewMax("-18");
                        }}
                        className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                          newType === UnitType.FREEZER
                            ? "border-[#6C5CE7] bg-purple-50 text-[#6C5CE7]"
                            : "border-slate-100 text-slate-400"
                        }`}
                      >
                        冷冻
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewType(UnitType.COOLER);
                          setNewMin("0");
                          setNewMax("4");
                        }}
                        className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                          newType === UnitType.COOLER
                            ? "border-[#6C5CE7] bg-purple-50 text-[#6C5CE7]"
                            : "border-slate-100 text-slate-400"
                        }`}
                      >
                        保鲜
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      状态
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewStatus(UnitStatus.ACTIVE)}
                        className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                          newStatus === UnitStatus.ACTIVE
                            ? "border-green-600 bg-green-50 text-green-600"
                            : "border-slate-100 text-slate-400"
                        }`}
                      >
                        在使用
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewStatus(UnitStatus.INACTIVE)}
                        className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                          newStatus === UnitStatus.INACTIVE
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-slate-100 text-slate-400"
                        }`}
                      >
                        已停用
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      最低温 (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newMin}
                      onChange={(e) => setNewMin(e.target.value)}
                      className="w-full bg-white border-none rounded-2xl p-3 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      最高温 (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newMax}
                      onChange={(e) => setNewMax(e.target.value)}
                      className="w-full bg-white border-none rounded-2xl p-3 font-bold text-center"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-[#6C5CE7] text-white rounded-[24px] font-black text-lg hover:bg-[#5B4BC4] shadow-xl shadow-purple-200 transition-all active:scale-95"
              >
                {editingUnitId ? "保存修改" : "确认添加"}
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="text-center py-6 opacity-30">
        <p className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">
          ColdLink v1.1.5 Enterprise
        </p>
      </section>
    </div>
  );
};

export default Settings;
