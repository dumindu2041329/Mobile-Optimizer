import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ListItem } from '@/components/ListItem';
import { colors } from '@/constants/colors';
import { appData } from '@/constants/mockData';
import { 
  AppWindow, 
  Search, 
  Clock, 
  Trash2, 
  Filter,
  X,
  ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AppsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'size', 'lastUsed'
  
  // Get unique categories
  const categories = ['All', ...new Set(appData.installedApps.map(app => app.category))];
  
  // Filter apps based on search query and category
  const filteredApps = appData.installedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Sort apps
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      return b.size - a.size;
    } else if (sortBy === 'lastUsed') {
      // Simple sort for "lastUsed" string values
      if (a.lastUsed.includes('Today')) return -1;
      if (b.lastUsed.includes('Today')) return 1;
      if (a.lastUsed.includes('Yesterday')) return -1;
      if (b.lastUsed.includes('Yesterday')) return 1;
      return a.lastUsed.localeCompare(b.lastUsed);
    }
    return 0;
  });
  
  const handleUninstall = (appName: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Uninstall App",
      `Are you sure you want to uninstall ${appName}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Uninstall", 
          style: "destructive",
          onPress: () => {
            // In a real app, this would actually uninstall the app
            Alert.alert("Success", `${appName} has been uninstalled.`);
          }
        }
      ]
    );
  };
  
  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search apps..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => {
                Alert.alert(
                  "Sort By",
                  "Choose sorting option",
                  [
                    { text: "Name", onPress: () => setSortBy('name') },
                    { text: "Size", onPress: () => setSortBy('size') },
                    { text: "Last Used", onPress: () => setSortBy('lastUsed') },
                    { text: "Cancel", style: "cancel" }
                  ]
                );
              }}
            >
              <Filter size={16} color={colors.textSecondary} />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Apps' : selectedCategory} 
          ({sortedApps.length})
        </Text>
        
        <Card>
          {sortedApps.map((app, index) => (
            <ListItem
              key={index}
              title={app.name}
              subtitle={`${formatSize(app.size)} • Last used: ${app.lastUsed}`}
              leftIcon={
                <View style={[styles.appIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={styles.appIconText}>{app.name.charAt(0)}</Text>
                </View>
              }
              rightContent={
                <TouchableOpacity 
                  style={styles.uninstallButton}
                  onPress={() => handleUninstall(app.name)}
                >
                  <Trash2 size={16} color={colors.secondary} />
                </TouchableOpacity>
              }
              showBorder={index !== sortedApps.length - 1}
            />
          ))}
          
          {sortedApps.length === 0 && (
            <View style={styles.emptyContainer}>
              <AppWindow size={48} color={colors.border} />
              <Text style={styles.emptyText}>No apps found</Text>
            </View>
          )}
        </Card>
        
        <Text style={styles.sectionTitle}>App Usage Statistics</Text>
        
        <Card>
          {appData.appUsageStats.map((app, index) => (
            <ListItem
              key={index}
              title={app.name}
              subtitle={`${Math.floor(app.timeUsed / 60)}h ${app.timeUsed % 60}m today`}
              leftIcon={
                <View style={[styles.appIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={styles.appIconText}>{app.name.charAt(0)}</Text>
                </View>
              }
              rightContent={
                <View style={styles.usageIndicator}>
                  <View 
                    style={[
                      styles.usageBar, 
                      { 
                        width: `${Math.min(app.timeUsed / 2, 100)}%`,
                        backgroundColor: app.timeUsed > 90 ? colors.secondary : colors.primary
                      }
                    ]} 
                  />
                </View>
              }
              showBorder={index !== appData.appUsageStats.length - 1}
            />
          ))}
        </Card>
        
        <Text style={styles.sectionTitle}>Recommendations</Text>
        
        <Card>
          <ListItem
            title="Unused Apps"
            subtitle="4 apps not used in the last 3 months"
            leftIcon={<Clock size={20} color={colors.warning} />}
            rightContent={<ChevronRight size={20} color={colors.textSecondary} />}
          />
          
          <ListItem
            title="Large Apps"
            subtitle="3 apps using more than 1 GB of storage"
            leftIcon={<AppWindow size={20} color={colors.primary} />}
            rightContent={<ChevronRight size={20} color={colors.textSecondary} />}
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.background,
  },
  sortContainer: {
    marginLeft: 'auto',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  sortText: {
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  uninstallButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  usageIndicator: {
    width: 80,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  usageBar: {
    height: '100%',
    borderRadius: 4,
  },
});