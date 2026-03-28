import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ListItem } from '@/components/ListItem';
import { CircularProgress } from '@/components/CircularProgress';
import { colors } from '@/constants/colors';
import { performanceData } from '@/constants/mockData';
import { useOptimizationStore } from '@/store/optimizationStore';
import { 
  Zap, 
  Cpu, 
  HardDrive, 
  Thermometer,
  CheckCircle,
  X
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function PerformanceScreen() {
  const { 
    performanceOptimized,
    startOptimization,
    completeOptimization
  } = useOptimizationStore();
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(performanceOptimized);
  const [progress, setProgress] = useState(0);
  
  // Calculate RAM usage percentage
  const ramUsagePercentage = (performanceData.ramUsed / performanceData.ramTotal) * 100;
  
  // Get performance score (inverse of CPU usage)
  const performanceScore = 100 - performanceData.cpuUsage;
  
  // Get color based on performance score
  const getPerformanceColor = (score: number) => {
    if (score >= 70) return colors.success;
    if (score >= 40) return colors.warning;
    return colors.secondary;
  };
  
  const handleOptimize = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    startOptimization('performance');
    setIsOptimizing(true);
    setProgress(0);
    
    // Simulate optimization progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          setOptimizationComplete(true);
          completeOptimization('performance', { performanceImprovement: 22 });
          
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          Alert.alert(
            "Performance Optimized",
            "Successfully optimized device performance. Your device is now 22% faster!",
            [{ text: "Great!" }]
          );
          
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <View style={styles.performanceScore}>
              <CircularProgress 
                size={120} 
                progress={performanceScore}
                color={getPerformanceColor(performanceScore)}
              >
                <Zap size={28} color={getPerformanceColor(performanceScore)} />
                <Text style={styles.scoreValue}>{performanceScore}%</Text>
              </CircularProgress>
            </View>
            
            <View style={styles.performanceInfo}>
              <Text style={styles.performanceTitle}>
                Performance Score
              </Text>
              <Text style={styles.performanceSubtitle}>
                {performanceScore >= 70 ? 'Good' : performanceScore >= 40 ? 'Fair' : 'Poor'}
              </Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Cpu size={16} color={colors.textSecondary} />
                  <Text style={styles.statText}>
                    CPU: {performanceData.cpuUsage}% used
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <HardDrive size={16} color={colors.textSecondary} />
                  <Text style={styles.statText}>
                    RAM: {performanceData.ramUsed.toFixed(1)} GB used
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Thermometer size={16} color={colors.textSecondary} />
                  <Text style={styles.statText}>
                    Temp: {performanceData.temperature}°C
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.performanceActions}>
            {isOptimizing ? (
              <View style={styles.optimizingContainer}>
                <Text style={styles.optimizingText}>Optimizing Performance...</Text>
                <ProgressBar progress={progress} color={colors.primary} />
              </View>
            ) : optimizationComplete ? (
              <View style={styles.optimizedContainer}>
                <CheckCircle size={20} color={colors.success} />
                <Text style={styles.optimizedText}>Performance Optimized</Text>
              </View>
            ) : (
              <Button 
                title="Boost Performance" 
                onPress={handleOptimize}
                icon={<Zap size={16} color={colors.background} />}
              />
            )}
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Memory Usage</Text>
        
        <Card>
          <View style={styles.memoryHeader}>
            <View style={styles.memoryIconContainer}>
              <HardDrive size={24} color={colors.primary} />
            </View>
            <View style={styles.memoryInfo}>
              <Text style={styles.memoryTitle}>RAM Memory</Text>
              <Text style={styles.memorySubtitle}>
                {performanceData.ramUsed.toFixed(1)} GB used of {performanceData.ramTotal} GB
              </Text>
            </View>
          </View>
          
          <View style={styles.memoryBarContainer}>
            <ProgressBar 
              progress={ramUsagePercentage} 
              height={12}
              color={ramUsagePercentage > 80 ? colors.secondary : colors.primary}
              label="RAM Usage"
            />
            <View style={styles.memoryDetails}>
              <Text style={styles.memoryDetailText}>
                {performanceData.ramFree.toFixed(1)} GB Free
              </Text>
              <Text style={styles.memoryDetailText}>
                {performanceData.ramUsed.toFixed(1)} GB Used
              </Text>
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Background Apps</Text>
        
        <Card>
          <View style={styles.backgroundAppsHeader}>
            <Text style={styles.backgroundAppsTitle}>
              {performanceData.backgroundApps.length} Apps Running in Background
            </Text>
            <Text style={styles.backgroundAppsSubtitle}>
              {performanceData.runningProcesses} processes active
            </Text>
          </View>
          
          {performanceData.backgroundApps.map((app, index) => (
            <ListItem
              key={index}
              title={app.name}
              subtitle={`${app.memory} MB of RAM`}
              leftIcon={
                <View style={[styles.appIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={styles.appIconText}>{app.name.charAt(0)}</Text>
                </View>
              }
              rightContent={
                <View style={styles.closeButton}>
                  <X size={16} color={colors.textSecondary} />
                </View>
              }
              showBorder={index !== performanceData.backgroundApps.length - 1}
            />
          ))}
        </Card>
        
        <Text style={styles.sectionTitle}>Performance Tips</Text>
        
        <Card>
          <ListItem
            title="Close Unused Apps"
            subtitle="Free up memory and processing power"
            leftIcon={<Zap size={20} color={colors.primary} />}
          />
          
          <ListItem
            title="Restart Device Regularly"
            subtitle="Clears memory and refreshes system"
            leftIcon={<Zap size={20} color={colors.primary} />}
          />
          
          <ListItem
            title="Update System Software"
            subtitle="Latest updates often include performance improvements"
            leftIcon={<Zap size={20} color={colors.primary} />}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  performanceCard: {
    marginBottom: 24,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceScore: {
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  performanceInfo: {
    flex: 1,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  performanceSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statsContainer: {
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  performanceActions: {
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
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  memoryInfo: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  memorySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memoryBarContainer: {
    marginTop: 8,
  },
  memoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  memoryDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  backgroundAppsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backgroundAppsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  backgroundAppsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});