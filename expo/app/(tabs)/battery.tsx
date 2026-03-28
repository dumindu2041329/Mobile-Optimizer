import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ListItem } from '@/components/ListItem';
import { CircularProgress } from '@/components/CircularProgress';
import { colors } from '@/constants/colors';
import { useOptimizationStore } from '@/store/optimizationStore';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import { useOptimization } from '@/hooks/useOptimization';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  Clock, 
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Smartphone
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function BatteryScreen() {
  const { 
    batteryOptimized,
    completeOptimization
  } = useOptimizationStore();
  
  const { batteryInfo, refreshBatteryInfo } = useDeviceInfo();
  const { isOptimizing, progress, optimizeBattery } = useOptimization();
  
  const [optimizationComplete, setOptimizationComplete] = useState(batteryOptimized);
  const [refreshing, setRefreshing] = useState(false);
  const [batteryHealth, setBatteryHealth] = useState(92);
  const [temperature, setTemperature] = useState(35);
  
  useEffect(() => {
    // Simulate battery health and temperature readings
    const updateBatteryMetrics = () => {
      setBatteryHealth(Math.floor(Math.random() * 20) + 80); // 80-100%
      setTemperature(Math.floor(Math.random() * 15) + 30); // 30-45°C
    };
    
    updateBatteryMetrics();
    const interval = setInterval(updateBatteryMetrics, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Get battery color based on level
  const getBatteryColor = (level: number) => {
    if (level > 50) return colors.success;
    if (level > 20) return colors.warning;
    return colors.secondary;
  };
  
  // Get battery icon based on status
  const BatteryIcon = batteryInfo?.status === 'Charging' ? BatteryCharging : Battery;
  
  // Estimate time remaining based on battery level and usage
  const estimateTimeRemaining = (level: number) => {
    if (batteryInfo?.status === 'Charging') {
      const timeToFull = Math.floor((100 - level) * 1.5); // Rough estimate
      return `${Math.floor(timeToFull / 60)}h ${timeToFull % 60}m to full`;
    } else {
      const timeRemaining = Math.floor(level * 4.5); // Rough estimate
      return `${Math.floor(timeRemaining / 60)}h ${timeRemaining % 60}m remaining`;
    }
  };
  
  const handleOptimize = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      const result = await optimizeBattery();
      
      setOptimizationComplete(true);
      completeOptimization('battery', result);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Battery Optimized",
        `Successfully optimized battery usage!\n\nEstimated ${result.batteryImprovement}% longer battery life.`,
        [{ text: "Great!" }]
      );
      
      await refreshBatteryInfo();
      
    } catch (error) {
      Alert.alert("Error", "Failed to optimize battery. Please try again.");
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBatteryInfo();
    setRefreshing(false);
  };
  
  if (!batteryInfo) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text>Loading battery information...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Card style={styles.batteryCard}>
          <View style={styles.batteryHeader}>
            <View style={styles.batteryLevel}>
              <CircularProgress 
                size={120} 
                progress={batteryInfo.level}
                color={getBatteryColor(batteryInfo.level)}
              >
                <BatteryIcon size={32} color={getBatteryColor(batteryInfo.level)} />
                <Text style={styles.batteryPercentage}>{batteryInfo.level}%</Text>
              </CircularProgress>
            </View>
            
            <View style={styles.batteryInfo}>
              <Text style={styles.batteryStatus}>
                {batteryInfo.status}
              </Text>
              
              <View style={styles.timeRemainingContainer}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.timeRemaining}>
                  {estimateTimeRemaining(batteryInfo.level)}
                </Text>
              </View>
              
              {batteryInfo.lowPowerMode && (
                <View style={styles.lowPowerContainer}>
                  <AlertTriangle size={16} color={colors.warning} />
                  <Text style={styles.lowPowerText}>Low Power Mode Active</Text>
                </View>
              )}
              
              <View style={styles.batteryHealthContainer}>
                <Text style={styles.batteryHealthLabel}>Battery Health</Text>
                <ProgressBar 
                  progress={batteryHealth} 
                  height={6}
                  color={getBatteryColor(batteryHealth)}
                  showPercentage={false}
                />
                <Text style={styles.batteryHealthValue}>
                  {batteryHealth}% - {batteryHealth > 80 ? 'Good' : 'Fair'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.batteryActions}>
            {isOptimizing ? (
              <View style={styles.optimizingContainer}>
                <Text style={styles.optimizingText}>Optimizing Battery...</Text>
                <ProgressBar progress={progress} color={colors.primary} />
              </View>
            ) : optimizationComplete ? (
              <View style={styles.optimizedContainer}>
                <CheckCircle size={20} color={colors.success} />
                <Text style={styles.optimizedText}>Battery Optimized</Text>
              </View>
            ) : (
              <Button 
                title="Optimize Battery" 
                onPress={handleOptimize}
                icon={<Zap size={16} color={colors.background} />}
              />
            )}
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Battery Health</Text>
        
        <Card>
          <View style={styles.healthItem}>
            <View style={styles.healthIconContainer}>
              <Thermometer size={20} color={colors.warning} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>Temperature</Text>
              <Text style={styles.healthValue}>
                {temperature}°C
                {temperature > 40 ? 
                  <Text style={styles.warningText}> (High)</Text> : 
                  <Text style={styles.normalText}> (Normal)</Text>
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.healthItem}>
            <View style={styles.healthIconContainer}>
              <Battery size={20} color={colors.primary} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>Battery Health</Text>
              <Text style={styles.healthValue}>
                {batteryHealth}%
                {batteryHealth > 80 ? 
                  <Text style={styles.normalText}> (Good)</Text> : 
                  <Text style={styles.warningText}> (Fair)</Text>
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.healthItem}>
            <View style={styles.healthIconContainer}>
              <Zap size={20} color={colors.success} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>Charging Cycles</Text>
              <Text style={styles.healthValue}>
                {Math.floor(Math.random() * 200) + 200} cycles
                <Text style={styles.normalText}> (Normal)</Text>
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.healthItem}>
            <View style={styles.healthIconContainer}>
              <Smartphone size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>Power State</Text>
              <Text style={styles.healthValue}>
                {batteryInfo.powerState?.batteryState === 1 ? 'Unplugged' : 
                 batteryInfo.powerState?.batteryState === 2 ? 'Charging' : 
                 batteryInfo.powerState?.batteryState === 3 ? 'Full' : 'Unknown'}
              </Text>
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Battery Optimization Tips</Text>
        
        <Card>
          <ListItem
            title="Reduce Screen Brightness"
            subtitle="Lower brightness to save battery"
            leftIcon={<AlertTriangle size={20} color={colors.warning} />}
          />
          
          <ListItem
            title="Enable Low Power Mode"
            subtitle={batteryInfo.lowPowerMode ? "Already enabled" : "Reduce background activity"}
            leftIcon={<AlertTriangle size={20} color={batteryInfo.lowPowerMode ? colors.success : colors.warning} />}
          />
          
          <ListItem
            title="Close Background Apps"
            subtitle="Apps running in background consume battery"
            leftIcon={<AlertTriangle size={20} color={colors.warning} />}
          />
          
          <ListItem
            title="Turn Off Location Services"
            subtitle="When not needed to save battery"
            leftIcon={<AlertTriangle size={20} color={colors.warning} />}
            showBorder={false}
          />
        </Card>
        
        <Text style={styles.sectionTitle}>Real-time Monitoring</Text>
        
        <Card>
          <ListItem
            title="Battery Level"
            subtitle="Current charge level"
            leftIcon={<Battery size={20} color={getBatteryColor(batteryInfo.level)} />}
            rightContent={<Text style={styles.valueText}>{batteryInfo.level}%</Text>}
          />
          
          <ListItem
            title="Charging Status"
            subtitle="Current power state"
            leftIcon={<BatteryCharging size={20} color={colors.primary} />}
            rightContent={<Text style={styles.valueText}>{batteryInfo.status}</Text>}
          />
          
          <ListItem
            title="Temperature"
            subtitle="Battery temperature"
            leftIcon={<Thermometer size={20} color={colors.warning} />}
            rightContent={<Text style={styles.valueText}>{temperature}°C</Text>}
            showBorder={false}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  batteryCard: {
    marginBottom: 24,
  },
  batteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryLevel: {
    marginRight: 16,
  },
  batteryPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  timeRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeRemaining: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  lowPowerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lowPowerText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 6,
    fontWeight: '500',
  },
  batteryHealthContainer: {
    marginTop: 4,
  },
  batteryHealthLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  batteryHealthValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  batteryActions: {
    marginTop: 16,
  },
  optimizingContainer: {
    marginTop: 8,
  },
  optimizingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 8,
  },
  optimizedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: `${colors.success}10`,
    borderRadius: 8,
  },
  optimizedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  healthIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  healthValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  warningText: {
    color: colors.warning,
  },
  normalText: {
    color: colors.success,
  },
  valueText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});