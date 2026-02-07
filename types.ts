
export enum UnitStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum UnitType {
  FREEZER = 'FREEZER',
  COOLER = 'COOLER'
}

export interface StorageUnit {
  id: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  minTemp: number;
  maxTemp: number;
  storedItems: string;
}

export interface TemperatureLog {
  id: string;
  unitId: string;
  temperature: number;
  timestamp: string;
  recordedBy: string;
  synced: boolean; // 新增：标记是否已上传至服务器
}

export interface ReminderConfig {
  reminderTime: string;
  enabled: boolean;
}

export type AppView = 'dashboard' | 'log' | 'analytics' | 'settings';
