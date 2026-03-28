export const storageData = {
  total: 128, // GB
  used: 87.3,
  free: 40.7,
  categories: [
    { name: "Photos & Videos", size: 32.4, color: "#4A6FFF" },
    { name: "Apps", size: 28.7, color: "#FF6B6B" },
    { name: "System", size: 14.2, color: "#FFC107" },
    { name: "Documents", size: 8.1, color: "#4CAF50" },
    { name: "Other", size: 3.9, color: "#6C757D" },
  ],
  largeFiles: [
    { name: "Vacation Videos", size: 4.2, path: "DCIM/Camera/VID_20250312" },
    { name: "Podcast Downloads", size: 3.8, path: "Podcasts/Downloads" },
    { name: "Photo Library Backup", size: 2.7, path: "DCIM/Backups" },
    { name: "Game Assets", size: 2.3, path: "Android/data/com.game" },
  ],
  unusedApps: [
    { name: "Weather Pro", lastUsed: "3 months ago", size: 245 },
    { name: "Fitness Tracker", lastUsed: "2 months ago", size: 180 },
    { name: "Scanner App", lastUsed: "6 months ago", size: 120 },
    { name: "Old Game", lastUsed: "1 year ago", size: 1200 },
  ],
};

export const batteryData = {
  level: 78,
  status: "Discharging",
  temperature: 32,
  health: 92,
  estimatedTimeRemaining: 340, // minutes
  highConsumptionApps: [
    { name: "Social Media App", consumption: 18 },
    { name: "Navigation", consumption: 15 },
    { name: "Video Streaming", consumption: 12 },
    { name: "Game", consumption: 10 },
  ],
  usageHistory: [
    { hour: "00:00", level: 100 },
    { hour: "02:00", level: 96 },
    { hour: "04:00", level: 93 },
    { hour: "06:00", level: 89 },
    { hour: "08:00", level: 85 },
    { hour: "10:00", level: 82 },
    { hour: "12:00", level: 78 },
  ],
};

export const performanceData = {
  cpuUsage: 42,
  ramTotal: 8, // GB
  ramUsed: 5.3,
  ramFree: 2.7,
  temperature: 38, // Celsius
  runningProcesses: 47,
  backgroundApps: [
    { name: "Social Media App", memory: 420 }, // MB
    { name: "Email Client", memory: 380 },
    { name: "Music Player", memory: 310 },
    { name: "Navigation", memory: 290 },
    { name: "Cloud Sync", memory: 210 },
  ],
};

export const appData = {
  installedApps: [
    { name: "Social Media App", size: 245, lastUsed: "Today", category: "Social" },
    { name: "Email Client", size: 180, lastUsed: "Today", category: "Productivity" },
    { name: "Music Player", size: 310, lastUsed: "Yesterday", category: "Entertainment" },
    { name: "Navigation", size: 290, lastUsed: "3 days ago", category: "Travel" },
    { name: "Cloud Sync", size: 210, lastUsed: "Today", category: "Productivity" },
    { name: "Weather Pro", size: 245, lastUsed: "3 months ago", category: "Weather" },
    { name: "Fitness Tracker", size: 180, lastUsed: "2 months ago", category: "Health" },
    { name: "Scanner App", size: 120, lastUsed: "6 months ago", category: "Utilities" },
    { name: "Old Game", size: 1200, lastUsed: "1 year ago", category: "Games" },
  ],
  appUsageStats: [
    { name: "Social Media App", timeUsed: 124 }, // minutes per day
    { name: "Email Client", timeUsed: 45 },
    { name: "Music Player", timeUsed: 67 },
    { name: "Navigation", timeUsed: 38 },
    { name: "Cloud Sync", timeUsed: 12 },
  ],
};

export const deviceInfo = {
  model: "iPhone 14 Pro",
  os: "iOS 16.5",
  processor: "A16 Bionic",
  ram: "8 GB",
  storage: "128 GB",
  batteryCapacity: "3200 mAh",
  lastOptimized: "2 days ago",
};