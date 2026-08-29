import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { getMyGigPostings } from '../../api/posting.api.js';
import {
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  PAY_RATE_UNITS,
  formatLKR,
  formatDateTime,
} from './posting.constants.js';

// Sample fallback postings for instant preview / offline dev
const SAMPLE_POSTINGS = [
  {
    id: 'gig-1',
    title: 'Weekend Retail Cashier & Shelf Helper',
    category: 'RETAIL',
    arrangementType: 'GIG',
    payKind: 'FIXED_TOTAL',
    payAmount: 3500,
    workersNeeded: 2,
    filledCount: 1,
    status: 'OPEN',
    isUrgent: true,
    startAt: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
    locationAreaLabel: 'Bambalapitiya, Colombo 04',
    locationAddress: 'No. 128, Galle Road, Bambalapitiya, Colombo 04',
    locationLat: 6.8912,
    locationLng: 79.8567,
    postedAsType: 'BUSINESS',
    postedBusinessName: 'Ceylon Urban Retailers Ltd',
    description: 'Assist during Saturday peak shopping rush with cashiering and bag packing.',
  },
  {
    id: 'gig-2',
    title: 'Evening Delivery & Document Dispatch Runner',
    category: 'DELIVERY',
    arrangementType: 'PART_TIME',
    payKind: 'RATE',
    payAmount: 1800,
    payRateUnit: 'DAY',
    schedule: 'Mon–Fri, 4:30 PM – 7:30 PM',
    workersNeeded: 1,
    filledCount: 1,
    status: 'FILLED',
    isUrgent: false,
    startAt: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
    locationAreaLabel: 'Kollupitiya, Colombo 03',
    locationAddress: 'No. 45, Dharmapala Mawatha, Kollupitiya, Colombo 03',
    locationLat: 6.9147,
    locationLng: 79.8516,
    postedAsType: 'INDIVIDUAL',
    description: 'Local package courier around central commercial district.',
  },
  {
    id: 'gig-3',
    title: 'Exhibition Hall Setup & Chair Rigging Crew',
    category: 'EVENT_SETUP',
    arrangementType: 'GIG',
    payKind: 'FIXED_TOTAL',
    payAmount: 5000,
    workersNeeded: 4,
    filledCount: 0,
    status: 'OPEN',
    isUrgent: true,
    startAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    locationAreaLabel: 'Nugegoda, Western Province',
    locationAddress: 'No. 82, High Level Road, Nugegoda',
    locationLat: 6.8649,
    locationLng: 79.8997,
    postedAsType: 'BUSINESS',
    postedBusinessName: 'Apex Event Productions',
    description: 'Help assemble booths and arrange sound and lighting fixtures.',
  },
];

export default function PostingListScreen({ navigation }) {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchPostings = useCallback(async () => {
    try {
      const res = await getMyGigPostings();
      if (res?.postings && Array.isArray(res.postings) && res.postings.length > 0) {
        setPostings(res.postings);
      } else {
        // Use sample postings if backend returns empty or in dev environment
        setPostings(SAMPLE_POSTINGS);
      }
    } catch (err) {
      // Fallback for development without running backend
      setPostings(SAMPLE_POSTINGS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPostings();
  };

  // Filtered Postings
  const filteredPostings = postings.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    return p.status === selectedFilter;
  });

  const renderPostingCard = ({ item }) => {
    const categoryObj = GIG_CATEGORIES.find((c) => c.id === item.category);
    const arrangementObj = ARRANGEMENT_TYPES.find((a) => a.id === item.arrangementType);
    const rateUnitObj = PAY_RATE_UNITS.find((u) => u.id === item.payRateUnit);

    // Pay format string
    let payStr = 'Unpaid';
    if (item.payKind === 'FIXED_TOTAL') payStr = `${formatLKR(item.payAmount)} total`;
    else if (item.payKind === 'RATE') payStr = `${formatLKR(item.payAmount)} ${rateUnitObj?.short || '/unit'}`;
    else if (item.payKind === 'STIPEND') payStr = `${formatLKR(item.payAmount)} /mo stipend`;
    else if (item.payKind === 'PAID') payStr = `${formatLKR(item.payAmount)} /mo`;

    // Status Pill style
    const isFilled = item.status === 'FILLED';
    const isOpen = item.status === 'OPEN';
    const isWithdrawn = item.status === 'WITHDRAWN';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('PostingDetail', {
            postingId: item.id,
            postingData: item,
          })
        }
      >
        {/* Card Header Tags */}
        <View style={styles.cardHeader}>
          <View style={styles.leftTags}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>
                {categoryObj?.icon || '🛍️'} {categoryObj?.label || item.category}
              </Text>
            </View>
            {item.isUrgent && (
              <View style={styles.urgentChip}>
                <Text style={styles.urgentChipText}>⚡ Urgent</Text>
              </View>
            )}
          </View>

          {/* Status Badge (FR-POST-18) */}
          <View
            style={[
              styles.statusPill,
              isOpen && styles.statusOpen,
              isFilled && styles.statusFilled,
              isWithdrawn && styles.statusWithdrawn,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                isOpen && styles.statusOpenText,
                isFilled && styles.statusFilledText,
                isWithdrawn && styles.statusWithdrawnText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Slot-fill Status (FR-POST-14) */}
        <View style={styles.slotContainer}>
          <View style={styles.slotRow}>
            <Text style={styles.slotLabel}>
              👥 Slot Status:{' '}
              <Text style={styles.slotValue}>
                {item.filledCount || 0} of {item.workersNeeded} filled (FR-POST-14)
              </Text>
            </Text>
            <Text style={styles.arrangementTag}>{arrangementObj?.label || item.arrangementType}</Text>
          </View>

          {/* Slot Progress Bar */}
          <View style={styles.slotProgressTrack}>
            <View
              style={[
                styles.slotProgressFill,
                {
                  width: `${Math.min(
                    100,
                    ((item.filledCount || 0) / (item.workersNeeded || 1)) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Details Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerKey}>Pay (per worker):</Text>
            <Text style={styles.footerPay}>{payStr}</Text>
          </View>

          <View style={styles.footerItem}>
            <Text style={styles.footerKey}>Starts:</Text>
            <Text style={styles.footerVal}>{formatDateTime(item.startAt)}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.locationText}>📍 {item.locationAreaLabel}</Text>
          <Text style={styles.viewMoreText}>Manage Gig →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Action Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenHeading}>My Gig Postings</Text>
          <Text style={styles.screenSub}>Manage your active and previous listings</Text>
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('PostingCreate')}
        >
          <Text style={styles.createBtnText}>+ Post a Gig</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['ALL', 'OPEN', 'FILLED', 'WITHDRAWN'].map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, isSelected && styles.filterTabSelected]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isSelected && styles.filterTabTextSelected,
                ]}
              >
                {filter === 'ALL' ? 'All Gigs' : filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading your postings...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPostings}
          renderItem={renderPostingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No postings in "{selectedFilter}"</Text>
              <Text style={styles.emptySub}>
                Create a new gig posting to connect with enthusiastic local youth looking for work.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('PostingCreate')}
              >
                <Text style={styles.emptyBtnText}>Create Your First Gig</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  screenSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  createBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  filterTabSelected: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  categoryChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  urgentChip: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentChipText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusOpen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusOpenText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
  },
  statusFilled: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  statusFilledText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '800',
  },
  statusWithdrawn: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusWithdrawnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  slotContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  slotLabel: {
    fontSize: 12,
    color: '#475569',
  },
  slotValue: {
    fontWeight: '700',
    color: '#0F172A',
  },
  arrangementTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  slotProgressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  slotProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerItem: {
    flex: 1,
  },
  footerKey: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  footerPay: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  footerVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
