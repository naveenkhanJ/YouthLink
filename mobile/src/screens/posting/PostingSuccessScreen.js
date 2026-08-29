import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  formatLKR,
  formatDateTime,
} from './posting.constants.js';

export default function PostingSuccessScreen({ route, navigation }) {
  const { posting } = route.params || {};

  const categoryObj = GIG_CATEGORIES.find((c) => c.id === posting?.category);
  const arrangementObj = ARRANGEMENT_TYPES.find((a) => a.id === posting?.arrangementType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Celebration Icon Header */}
        <View style={styles.celebrationContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.celebrationIcon}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Gig Posting is Live!</Text>
          <Text style={styles.successSub}>
            Your listing has been created with status <Text style={styles.openStatus}>OPEN</Text> and
            is now accepting applications from local youth.
          </Text>
        </View>

        {/* Notification Fan-Out Confirmation (FR-POST-10) */}
        <View style={styles.fanOutCard}>
          <View style={styles.fanOutHeader}>
            <Text style={styles.fanOutIcon}>📡</Text>
            <Text style={styles.fanOutTitle}>Instant Notification Fan-Out (FR-POST-10)</Text>
          </View>
          <Text style={styles.fanOutBody}>
            {posting?.isUrgent
              ? '⚡ High-Priority Urgent Push: An instant proactive push notification has been broadcast to opted-in youth job-seekers within your search radius (FR-NOTIF-01).'
              : '📢 Area Broadcast: A new gig alert has been dispatched to matching youth job-seekers in the local radius (FR-NOTIF-02).'}
          </Text>
        </View>

        {/* Gig Summary Card */}
        {posting && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeader}>POSTING SUMMARY</Text>

            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {categoryObj?.icon || '🛍️'} {categoryObj?.label || posting.category}
                </Text>
              </View>
              {posting.isUrgent && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>⚡ Urgent</Text>
                </View>
              )}
            </View>

            <Text style={styles.gigTitle}>{posting.title}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Workers Needed:</Text>
              <Text style={styles.infoVal}>
                {posting.workersNeeded} slot{posting.workersNeeded > 1 ? 's' : ''} (0 filled)
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Starts At:</Text>
              <Text style={styles.infoVal}>{formatDateTime(posting.startAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Area:</Text>
              <Text style={styles.infoVal}>{posting.locationAreaLabel}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate('PostingDetail', {
                postingId: posting?.id,
                postingData: posting,
              })
            }
          >
            <Text style={styles.primaryBtnText}>View Gig Details →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('PostingList')}
          >
            <Text style={styles.secondaryBtnText}>Go to My Postings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textBtn}
            onPress={() => navigation.navigate('PostingCreate')}
          >
            <Text style={styles.textBtnText}>+ Post Another Gig</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  celebrationIcon: {
    fontSize: 38,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  openStatus: {
    color: '#15803D',
    fontWeight: '800',
  },
  fanOutCard: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  fanOutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fanOutIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  fanOutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  fanOutBody: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  gigTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoKey: {
    fontSize: 13,
    color: '#64748B',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  textBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  textBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
