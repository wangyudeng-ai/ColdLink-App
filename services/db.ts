import {
  StorageUnit,
  TemperatureLog,
  ReminderConfig,
  UnitStatus,
  UnitType,
} from "../types";

const STORAGE_KEYS = {
  UNITS: "coldlink_units",
  LOGS: "coldlink_logs",
  SETTINGS: "coldlink_settings",
};

const INITIAL_UNITS: StorageUnit[] = [
  {
    id: "1",
    name: "1号冷冻库",
    type: UnitType.FREEZER,
    status: UnitStatus.ACTIVE,
    minTemp: -22,
    maxTemp: -18,
    storedItems: "猪肉、牛肉类",
  },
  {
    id: "2",
    name: "2号冷冻库",
    type: UnitType.FREEZER,
    status: UnitStatus.ACTIVE,
    minTemp: -22,
    maxTemp: -18,
    storedItems: "速冻面点",
  },
  {
    id: "3",
    name: "3号保鲜库",
    type: UnitType.COOLER,
    status: UnitStatus.ACTIVE,
    minTemp: 0,
    maxTemp: 4,
    storedItems: "新鲜蔬菜、水果",
  },
  {
    id: "4",
    name: "4号保鲜库",
    type: UnitType.COOLER,
    status: UnitStatus.INACTIVE,
    minTemp: 0,
    maxTemp: 4,
    storedItems: "",
  },
];

export const db = {
  getUnits: (): StorageUnit[] => {
    const data = localStorage.getItem(STORAGE_KEYS.UNITS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(INITIAL_UNITS));
      return INITIAL_UNITS;
    }
    return JSON.parse(data);
  },

  saveUnits: (units: StorageUnit[]) => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  },

  getLogs: (): TemperatureLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    const logs = data ? JSON.parse(data) : [];
    // 兼容旧数据
    return logs.map((l: any) => ({ ...l, synced: l.synced ?? true }));
  },

  addLog: (log: Omit<TemperatureLog, "id" | "synced">) => {
    const logs = db.getLogs();
    const newLog: TemperatureLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      synced: false, // 新录入的数据默认为未同步（离线状态）
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return newLog;
  },

  updateLogs: (logs: TemperatureLog[]) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getReminderConfig: (): ReminderConfig => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { reminderTime: "09:00", enabled: true };
  },

  saveReminderConfig: (config: ReminderConfig) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(config));
  },
};
