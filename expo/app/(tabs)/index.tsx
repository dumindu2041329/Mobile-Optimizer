import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { CircularProgress } from '@/components/CircularProgress';
import { StatCard } from '@/components/StatCard';
import { colors } from '@/constants/colors';
import { useOptimizationStore } from '@/store/optimizationStore';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import { useOptimization } from '@/hooks/useOptimization';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { 
  HardDrive, 
  Battery, 
  Zap, 
  Smartphone, 
  Clock, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const { 
    lastOptimized, 
    batteryOptimized,
    storageOptimized,
    performanceOptimized,
    completeOptimization
  } = useOptimizationStore();
  
  const { deviceInfo, batteryInfo, storageInfo, loading, refreshBatteryInfo, refreshStorageInfo } = useDeviceInfo();
  const { systemInfo } = useSystemInfo();
  const { isOptimizing, progress, optimizeAll } = useOptimization();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate overall device health score (0-100)
  const storageScore = storageInfo ? ((storageInfo.freeSpace / storageInfo.totalSpace) * 100) : 50;
  const batteryScore = batteryInfo ? batteryInfo.level : 50;
  const performanceScore = 100 - systemInfo.cpuUsage;
  const overallScore = Math.round((storageScore + batteryScore + performanceScore) / 3);
  
  const handleOptimize = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    try {
      const result = await optimizeAll();
      
      completeOptimization('full', result);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Optimization Complete",
        `Successfully optimized your device!\n\n` +
        `• ${result.spaceFreed}MB storage freed\n` +
        `• ${result.batteryImprovement}% battery improvement\n` +
        `• ${result.performanceImprovement}% performance boost`,
        [{ text: "Great!" }]
      );
      
      // Refresh device info after optimization
      await refreshBatteryInfo();
      await refreshStorageInfo();
      
    } catch (error) {
      Alert.alert("Error", "Failed to optimize device. Please try again.");
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshBatteryInfo(),
      refreshStorageInfo(),
    ]);
    setRefreshing(false);
  };
  
  const allOptimized = batteryOptimized && storageOptimized && performanceOptimized;
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading device information...</Text>
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
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>
            {allOptimized 
              ? "Your device is fully optimized" 
              : "Let's optimize your device"}
          </Text>
        </View>
        
        <Card style={styles.healthCard}>
          <View style={styles.healthCardContent}>
            <View style={styles.healthScoreContainer}>
              <CircularProgress 
                size={120} 
                progress={overallScore}
                color={getHealthColor(overallScore)}
              >
                <Text style={styles.scoreValue}>{overallScore}</Text>
                <Text style={styles.scoreLabel}>Health Score</Text>
              </CircularProgress>
            </View>
            
            <View style={styles.healthDetails}>
              <Text style={styles.healthTitle}>Device Health</Text>
              <Text style={styles.healthSubtitle}>
                {getHealthMessage(overallScore)}
              </Text>
              <Text style={styles.lastOptimized}>
                Last optimized: {lastOptimized}
              </Text>
              
              {isOptimizing ? (
                <View style={styles.optimizingContainer}>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={styles.optimizingText}>
                    Optimizing... {progress}%
                  </Text>
                </View>
              ) : (
                <Button 
                  title={allOptimized ? "Optimize Again" : "Optimize Now"} 
                  onPress={handleOptimize}
                  icon={<Zap size={16} color={colors.background} />}
                />
              )}
            </View>
          </View>
        </Card>
        
        <View style={styles.refreshContainer}>
          <Text style={styles.sectionTitle}>Device Status</Text>
          <Button
            title=""
            onPress={handleRefresh}
            variant="outline"
            size="small"
            style={styles.refreshButton}
            icon={<RefreshCw size={16} color={colors.primary} />}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatCard
            title="Storage"
            value={storageInfo ? `${storageInfo.freeSpace.toFixed(1)} GB Free` : 'Loading...'}
            subtitle={storageInfo ? `${storageInfo.usedSpace.toFixed(1)} GB Used` : ''}
            icon={<HardDrive size={20} color={colors.primary} />}
            color={colors.primary}
          />
          <StatCard
            title="Battery"
            value={batteryInfo ? `${batteryInfo.level}%` : 'Loading...'}
            subtitle={batteryInfo ? batteryInfo.status : ''}
            icon={<Battery size={20} color={colors.secondary} />}
            color={colors.secondary}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatCard
            title="Performance"
            value={`${100 - systemInfo.cpuUsage}%`}
            subtitle={`CPU: ${systemInfo.cpuUsage}% used`}
            icon={<Zap size={20} color={colors.warning} />}
            color={colors.warning}
          />
          <StatCard
            title="Device"
            value={deviceInfo?.model || 'Unknown'}
            subtitle={deviceInfo ? `${deviceInfo.os} ${deviceInfo.osVersion}` : 'Loading...'}
            icon={<Smartphone size={20} color={colors.success} />}
            color={colors.success}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Optimization Status</Text>
        
        <Card>
          <View style={styles.optimizationItem}>
            <View style={styles.optimizationIcon}>
              <HardDrive size={20} color={storageOptimized ? colors.success : colors.textSecondary} />
            </View>
            <View style={styles.optimizationInfo}>
              <Text style={styles.optimizationTitle}>Storage Cleanup</Text>
              <Text style={styles.optimizationSubtitle}>
                {storageOptimized 
                  ? "Storage optimized, cache cleared" 
                  : "Clean up cache and temporary files"}
              </Text>
            </View>
            {storageOptimized && (
              <CheckCircle2 size={20} color={colors.success} />
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.optimizationItem}>
            <View style={styles.optimizationIcon}>
              <Battery size={20} color={batteryOptimized ? colors.success : colors.textSecondary} />
            </View>
            <View style={styles.optimizationInfo}>
              <Text style={styles.optimizationTitle}>Battery Optimization</Text>
              <Text style={styles.optimizationSubtitle}>
                {batteryOptimized 
                  ? "Battery settings optimized" 
                  : "Optimize power management settings"}
              </Text>
            </View>
            {batteryOptimized && (
              <CheckCircle2 size={20} color={colors.success} />
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.optimizationItem}>
            <View style={styles.optimizationIcon}>
              <Zap size={20} color={performanceOptimized ? colors.success : colors.textSecondary} />
            </View>
            <View style={styles.optimizationInfo}>
              <Text style={styles.optimizationTitle}>Performance Boost</Text>
              <Text style={styles.optimizationSubtitle}>
                {performanceOptimized 
                  ? "System performance optimized" 
                  : "Clear memory and optimize processes"}
              </Text>
            </View>
            {performanceOptimized && (
              <CheckCircle2 size={20} color={colors.success} />
            )}
          </View>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            PhoneOptimizer v1.0 • Real-time monitoring
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions
const getHealthColor = (score: number) => {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.warning;
  return colors.secondary;
};

const getHealthMessage = (score: number) => {
  if (score >= 80) return "Your device is in excellent condition";
  if (score >= 60) return "Your device is in good condition";
  if (score >= 40) return "Your device needs optimization";
  return "Your device needs immediate attention";
};

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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  healthCard: {
    marginBottom: 24,
  },
  healthCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreContainer: {
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -4,
  },
  healthDetails: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  healthSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  lastOptimized: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  optimizingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  optimizingText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  refreshContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 8,
  },
  optimizationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optimizationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optimizationInfo: {
    flex: 1,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  optimizationSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});