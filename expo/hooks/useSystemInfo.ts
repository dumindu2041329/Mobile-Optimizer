import { useState, useEffect } from 'react';
import { Platform, AppState } from 'react-native';

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  runningProcesses: number;
  networkStatus: string;
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpuUsage: 0,
    memoryUsage: 0,
    temperature: 0,
    runningProcesses: 0,
    networkStatus: 'Unknown',
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateSystemInfo = () => {
      // Simulate real system monitoring
      // In a real app, you'd use native modules to get actual system stats
      
      const baseTemp = Platform.OS === 'ios' ? 35 : 38;
      const tempVariation = (Math.random() - 0.5) * 10;
      
      setSystemInfo({
        cpuUsage: Math.floor(Math.random() * 60) + 20, // 20-80%
        memoryUsage: Math.floor(Math.random() * 40) + 40, // 40-80%
        temperature: Math.round(baseTemp + tempVariation),
        runningProcesses: Math.floor(Math.random() * 30) + 25, // 25-55 processes
        networkStatus: getNetworkStatus(),
      });
    };

    if (isMonitoring) {
      updateSystemInfo(); // Initial update
      interval = setInterval(updateSystemInfo, 2000); // Update every 2 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setIsMonitoring(true);
      } else {
        setIsMonitoring(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Start monitoring when component mounts
    setIsMonitoring(true);

    return () => {
      subscription?.remove();
    };
  }, []);

  const getNetworkStatus = (): string => {
    // In a real app, you'd use @react-native-community/netinfo
    const statuses = ['WiFi', '4G', '5G', 'Ethernet'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const refreshSystemInfo = () => {
    const baseTemp = Platform.OS === 'ios' ? 35 : 38;
    const tempVariation = (Math.random() - 0.5) * 10;
    
    setSystemInfo({
      cpuUsage: Math.floor(Math.random() * 60) + 20,
      memoryUsage: Math.floor(Math.random() * 40) + 40,
      temperature: Math.round(baseTemp + tempVariation),
      runningProcesses: Math.floor(Math.random() * 30) + 25,
      networkStatus: getNetworkStatus(),
    });
  };

  return {
    systemInfo,
    isMonitoring,
    refreshSystemInfo,
    startMonitoring: () => setIsMonitoring(true),
    stopMonitoring: () => setIsMonitoring(false),
  };
};