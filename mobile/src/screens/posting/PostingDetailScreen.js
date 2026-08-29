import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LocationDisplay from '../../components/LocationDisplay.js';
import { getGigPosting } from '../../api/posting.api.js';
import {
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  PAY_RATE_UNITS,
  formatLKR,
  formatDateTime,
} from './posting.constants.js';

export default function PostingDetailScreen({ route, navigation }) {
  const { postingId, postingData } = route.params || {};
  const [posting, setPosting] = useState(postingData || null);
  const [loading, setLoading] = useState(!postingData);
  const [withdrawn, setWithdrawn] = useState(postingData?.status === 'WITHDRAWN');

  useEffect(() => {
    if (!postingData && postingId) {
      getGigPosting(postingId)
        .then((res) => {
          if (res?.posting) {
            setPosting(res.posting);
            setWithdrawn(res.posting.status === 'WITHDRAWN');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [postingId, postingData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading posting details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!posting) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Posting Not Found</Text>
          <Text style={styles.errorSub}>The requested gig listing could not be loaded.</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('PostingList')}
          >
            <Text style={styles.backBtnText}>← Back to My Postings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryObj = GIG_CATEGORIES.find((c) => c.id === posting.category);
  const arrangementObj = ARRANGEMENT_TYPES.find((a) => a.id === posting.arrangementType);
  const rateUnitObj = PAY_RATE_UNITS.find((u) => u.id === posting.payRateUnit);

  const filledCount = posting.filledCount || 0;
  const workersNeeded = posting.workersNeeded || 1;
  const currentStatus = withdrawn ? 'WITHDRAWN' : posting.status || 'OPEN';

  // Handle Withdraw Action (FR-POST-12)
  const handleWithdraw = () => {
    if (filledCount > 0) {
      Alert.alert(
        'Cannot Withdraw Directly',
        'At least one worker has already been selected for this gig. Please manage or cancel individual worker engagements directly (FR-POST-12 / FR-ENG-05).',
        [{ text: 'Understood' }],
      );
      return;
    }

    Alert.alert(
      'Withdraw Gig Posting (FR-POST-12)',
      'Are you sure you want to withdraw this posting? It will be immediately removed from active search and browse results.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw Posting',
          style: 'destructive',
          onPress: () => {
            setWithdrawn(true);
            Alert.alert('Posting Withdrawn', 'Your gig posting has been withdrawn successfully.');
          },
        },
      ],
    );
  };

  // Pay description
  let payStr = 'Unpaid';
  if (posting.payKind === 'FIXED_TOTAL') {
    payStr = `${formatLKR(posting.payAmount)} fixed total`;
  } else if (posting.payKind === 'RATE') {
    payStr = `${formatLKR(posting.payAmount)} ${rateUnitObj?.short || '/unit'}`;
  } else if (posting.payKind === 'STIPEND') {
    payStr = `${formatLKR(posting.payAmount)} /month stipend`;
  } else if (posting.payKind === 'PAID') {
    payStr = `${formatLKR(posting.payAmount)} /month`;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status & Urgency Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusGroup}>
            <View
              style={[
                styles.statusPill,
                currentStatus === 'OPEN' && styles.statusOpen,
                currentStatus === 'FILLED' && styles.statusFilled,
                currentStatus === 'WITHDRAWN' && styles.statusWithdrawn,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  currentStatus === 'OPEN' && styles.statusOpenText,
                  currentStatus === 'FILLED' && styles.statusFilledText,
                  currentStatus === 'WITHDRAWN' && styles.statusWithdrawnText,
                ]}
              >
                ● {currentStatus}
              </Text>
            </View>

            {posting.isUrgent && (
              <View style={styles.urgentPill}>
                <Text style={styles.urgentPillText}>⚡ Urgent Gig</Text>
              </View>
            )}
          </View>

          <Text style={styles.arrangementLabel}>
            {arrangementObj?.label || posting.arrangementType}
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>
              {categoryObj?.icon || '🛍️'} {categoryObj?.label || posting.category}
            </Text>
          </View>

          <Text style={styles.titleText}>{posting.title}</Text>
          <Text style={styles.descText}>{posting.description}</Text>
        </View>

        {/* Slot-fill Progress Card (FR-POST-14) */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>SLOT FILL STATUS (FR-POST-14)</Text>
          <View style={styles.slotFillHeader}>
            <Text style={styles.slotFillText}>
              {filledCount} of {workersNeeded} slots filled
            </Text>
            <Text style={styles.slotFillPercent}>
              {Math.round((filledCount / workersNeeded) * 100)}%
            </Text>
          </View>

          <View style={styles.slotProgressTrack}>
            <View
              style={[
                styles.slotProgressFill,
                { width: `${Math.min(100, (filledCount / workersNeeded) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.slotHelpText}>
            {filledCount === workersNeeded
              ? 'All slots filled. Listing is closed to new applicants (FR-POST-18).'
              : `Accepting applications for ${workersNeeded - filledCount} remaining slot(s).`}
          </Text>
        </View>

        {/* Key Logistics */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>COMPENSATION & TIMING</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Stated Pay (per worker):</Text>
            <Text style={styles.payText}>{payStr}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Start Date & Time:</Text>
            <Text style={styles.detailVal}>{formatDateTime(posting.startAt)}</Text>
          </View>

          {posting.schedule && (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Schedule:</Text>
              <Text style={styles.detailVal}>{posting.schedule}</Text>
            </View>
          )}
        </View>

        {/* Poster Identity (FR-POST-16) */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>EMPLOYER PROFILE (FR-POST-16)</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Posted As:</Text>
            <Text style={styles.detailVal}>
              {posting.postedAsType === 'BUSINESS'
                ? '🏢 Registered Business'
                : '👤 Individual / Household'}
            </Text>
          </View>
          {posting.postedAsType === 'BUSINESS' && posting.postedBusinessName && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.businessNameText}>{posting.postedBusinessName}</Text>
              {posting.postedBusinessBio && (
                <Text style={styles.businessBioText}>{posting.postedBusinessBio}</Text>
              )}
            </View>
          )}
        </View>

        {/* Precise Location Card (FR-POST-08) */}
        {/* As the employer who posted this gig, exact address is released */}
        <LocationDisplay
          locationAreaLabel={posting.locationAreaLabel}
          locationAddress={posting.locationAddress}
          isPreciseLocationReleased={true}
          locationLat={posting.locationLat}
          locationLng={posting.locationLng}
        />

        {/* Withdraw Section (FR-POST-12) */}
        {currentStatus === 'OPEN' && (
          <View style={styles.withdrawCard}>
            <Text style={styles.withdrawTitle}>Listing Actions (FR-POST-12)</Text>
            <Text style={styles.withdrawSub}>
              You can withdraw this posting at any time before any worker slot is filled.
            </Text>
            <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
              <Text style={styles.withdrawBtnText}>Withdraw Gig Posting</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusOpen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusOpenText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  statusFilled: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  statusFilledText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '800',
  },
  statusWithdrawn: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusWithdrawnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  urgentPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentPillText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
  },
  arrangementLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  categoryRow: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  titleText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  slotFillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  slotFillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  slotFillPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  slotProgressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  slotProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  slotHelpText: {
    fontSize: 12,
    color: '#64748B',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailKey: {
    fontSize: 13,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  payText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  businessNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  businessBioText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  withdrawCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  withdrawTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 4,
  },
  withdrawSub: {
    fontSize: 12,
    color: '#881337',
    lineHeight: 18,
    marginBottom: 12,
  },
  withdrawBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  errorSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
