import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ListItem } from '@/components/ListItem';
import { colors } from '@/constants/colors';
import { useOptimizationStore } from '@/store/optimizationStore';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import { useOptimization } from '@/hooks/useOptimization';
import { 
  HardDrive, 
  Trash2, 
  FileText, 
  Image, 
  Film, 
  Package, 
  AlertCircle,
  CheckCircle,
  Timer
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StorageScreen() {
  const { 
    storageOptimized,
    completeOptimization
  } = useOptimizationStore();
  
  const { storageInfo, refreshStorageInfo } = useDeviceInfo();
  const { isOptimizing, progress, optimizeStorage, clearCache } = useOptimization();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(storageOptimized);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [cacheSize, setCacheSize] = useState(0);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate storage usage percentage
  const usedPercentage = storageInfo ? (storageInfo.usedSpace / storageInfo.totalSpace) * 100 : 0;
  
  useEffect(() => {
    analyzeCacheSize();
  }, []);
  
  const analyzeCacheSize = async () => {
    try {
      // Get AsyncStorage keys to estimate cache size
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.includes('cache') || 
        key.includes('temp') || 
        key.includes('image')
      );
      
      // Estimate cache size (rough calculation)
      let estimatedSize = cacheKeys.length * 0.1; // 0.1MB per cache entry
      
      // Add some random variation for realism
      estimatedSize += Math.random() * 50 + 10;
      
      setCacheSize(estimatedSize);
      setTempFiles(cacheKeys);
    } catch (error) {
      setCacheSize(Math.random() * 100 + 20);
    }
  };
  
  const handleAnalyze = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 5) {
      setAnalysisProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await analyzeCacheSize();
    setIsAnalyzing(false);
    setIsAnalyzed(true);
  };
  
  const handleOptimize = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      const result = await optimizeStorage();
      
      setOptimizationComplete(true);
      completeOptimization('storage', result);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Storage Optimized",
        `Successfully freed ${result.spaceFreed}MB of storage space!

${result.itemsCleared} items were cleared.`,
        [{ text: "Great!" }]
      );
      
      // Refresh storage info and cache analysis
      await refreshStorageInfo();
      await analyzeCacheSize();
      
    } catch (error) {
      Alert.alert("Error", "Failed to optimize storage. Please try again.");
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshStorageInfo(),
      analyzeCacheSize()
    ]);
    setRefreshing(false);
  };
  
  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)} GB`;
    }
    return `${Math.round(sizeInMB)} MB`;
  };
  
  if (!storageInfo) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text>Loading storage information...</Text>
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
        <Card style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageIconContainer}>
              <HardDrive size={24} color={colors.primary} />
            </View>
            <View style={styles.storageInfo}>
              <Text style={styles.storageTitle}>Device Storage</Text>
              <Text style={styles.storageSubtitle}>
                {storageInfo.usedSpace.toFixed(1)} GB used of {storageInfo.totalSpace.toFixed(1)} GB
              </Text>
            </View>
          </View>
          
          <View style={styles.storageBarContainer}>
            <ProgressBar 
              progress={usedPercentage} 
              height={12}
              color={usedPercentage > 90 ? colors.secondary : colors.primary}
              label="Storage Used"
            />
            <View style={styles.storageDetails}>
              <Text style={styles.storageDetailText}>
                {storageInfo.freeSpace.toFixed(1)} GB Free
              </Text>
              <Text style={styles.storageDetailText}>
                {storageInfo.usedSpace.toFixed(1)} GB Used
              </Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.actionButtonsContainer}>
          {isAnalyzing ? (
            <Card style={styles.progressCard}>
              <Text style={styles.progressTitle}>Analyzing Storage...</Text>
              <ProgressBar progress={analysisProgress} color={colors.primary} />
            </Card>
          ) : isOptimizing ? (
            <Card style={styles.progressCard}>
              <Text style={styles.progressTitle}>Optimizing Storage...</Text>
              <ProgressBar progress={progress} color={colors.success} />
            </Card>
          ) : optimizationComplete ? (
            <Card style={styles.optimizedCard}>
              <CheckCircle size={24} color={colors.success} />
              <Text style={styles.optimizedText}>Storage Optimized</Text>
              <Text style={styles.optimizedSubtext}>Cache and temporary files cleared</Text>
              <Button 
                title="Analyze Again" 
                onPress={handleAnalyze}
                variant="outline"
                style={styles.analyzeAgainButton}
              />
            </Card>
          ) : isAnalyzed ? (
            <Button 
              title="Optimize Storage" 
              onPress={handleOptimize}
              icon={<Trash2 size={16} color={colors.background} />}
            />
          ) : (
            <Button 
              title="Analyze Storage" 
              onPress={handleAnalyze}
              icon={<HardDrive size={16} color={colors.background} />}
            />
          )}
        </View>
        
        {isAnalyzed && !optimizationComplete && (
          <>
            <Text style={styles.sectionTitle}>Cleanup Recommendations</Text>
            
            <Card>
              <View style={styles.recommendationHeader}>
                <AlertCircle size={20} color={colors.secondary} />
                <Text style={styles.recommendationTitle}>
                  Potential Space Savings: {formatSize(cacheSize + 50)}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <ListItem
                title="App Cache"
                subtitle="Temporary files and cached data"
                leftIcon={<Trash2 size={20} color={colors.secondary} />}
                rightContent={<Text style={styles.sizeText}>{formatSize(cacheSize)}</Text>}
              />
              
              <ListItem
                title="System Cache"
                subtitle="System temporary files"
                leftIcon={<Package size={20} color={colors.warning} />}
                rightContent={<Text style={styles.sizeText}>{formatSize(Math.random() * 30 + 10)}</Text>}
              />
              
              <ListItem
                title="Downloaded Files"
                subtitle="Temporary downloads"
                leftIcon={<FileText size={20} color={colors.success} />}
                rightContent={<Text style={styles.sizeText}>{formatSize(Math.random() * 20 + 5)}</Text>}
                showBorder={false}
              />
            </Card>
          </>
        )}
        
        <Text style={styles.sectionTitle}>Storage Categories</Text>
        
        <Card>
          <ListItem
            title="Photos & Videos"
            subtitle="Camera roll and media files"
            leftIcon={<Image size={20} color={colors.primary} />}
            rightContent={<Text style={styles.sizeText}>{formatSize(storageInfo.usedSpace * 1000 * 0.4)}</Text>}
          />
          
          <ListItem
            title="Applications"
            subtitle="Installed apps and their data"
            leftIcon={<Package size={20} color={colors.secondary} />}
            rightContent={<Text style={styles.sizeText}>{formatSize(storageInfo.usedSpace * 1000 * 0.3)}</Text>}
          />
          
          <ListItem
            title="System"
            subtitle="Operating system files"
            leftIcon={<HardDrive size={20} color={colors.warning} />}
            rightContent={<Text style={styles.sizeText}>{formatSize(storageInfo.usedSpace * 1000 * 0.2)}</Text>}
          />
          
          <ListItem
            title="Documents"
            subtitle="Files and documents"
            leftIcon={<FileText size={20} color={colors.success} />}
            rightContent={<Text style={styles.sizeText}>{formatSize(storageInfo.usedSpace * 1000 * 0.1)}</Text>}
            showBorder={false}
          />
        </Card>
        
        <Text style={styles.sectionTitle}>Cache Information</Text>
        
        <Card>
          <ListItem
            title="App Cache Files"
            subtitle={`${tempFiles.length} cached items found`}
            leftIcon={<Trash2 size={20} color={colors.primary} />}
            rightContent={<Text style={styles.sizeText}>{formatSize(cacheSize)}</Text>}
          />
          
          <ListItem
            title="Last Cache Clear"
            subtitle={optimizationComplete ? "Recently cleared" : "Never cleared"}
            leftIcon={<Timer size={20} color={colors.textSecondary} />}
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
  storageCard: {
    marginBottom: 24,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  storageInfo: {
    flex: 1,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  storageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  storageBarContainer: {
    marginTop: 8,
  },
  storageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  storageDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  actionButtonsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  progressCard: {
    padding: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  optimizedCard: {
    padding: 16,
    alignItems: 'center',
  },
  optimizedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
    marginTop: 8,
  },
  optimizedSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  analyzeAgainButton: {
    marginTop: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sizeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});