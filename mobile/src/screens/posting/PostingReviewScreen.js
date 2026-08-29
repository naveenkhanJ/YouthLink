import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LocationDisplay from '../../components/LocationDisplay.js';
import { createGigPosting } from '../../api/posting.api.js';
import {
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  PAY_RATE_UNITS,
  formatLKR,
  formatDateTime,
} from './posting.constants.js';

export default function PostingReviewScreen({ route, navigation }) {
  const { formData } = route.params || {};
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!formData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>No posting details found to review.</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('PostingCreate')}
          >
            <Text style={styles.backBtnText}>Create a Posting</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Lookups for user-friendly labels
  const categoryObj = GIG_CATEGORIES.find((c) => c.id === formData.category);
  const arrangementObj = ARRANGEMENT_TYPES.find((a) => a.id === formData.arrangementType);
  const rateUnitObj = PAY_RATE_UNITS.find((u) => u.id === formData.payRateUnit);

  // Pay display calculation
  let payDisplayString = 'Unpaid Internship';
  let totalCommitment = null;

  if (formData.payKind === 'FIXED_TOTAL') {
    payDisplayString = `${formatLKR(formData.payAmount)} fixed total per worker`;
    totalCommitment = formData.payAmount * formData.workersNeeded;
  } else if (formData.payKind === 'RATE') {
    payDisplayString = `${formatLKR(formData.payAmount)} ${rateUnitObj?.short || '/unit'} per worker`;
  } else if (formData.payKind === 'STIPEND') {
    payDisplayString = `${formatLKR(formData.payAmount)} monthly stipend per worker`;
    totalCommitment = formData.payAmount * formData.workersNeeded;
  } else if (formData.payKind === 'PAID') {
    payDisplayString = `${formatLKR(formData.payAmount)} monthly salary per worker`;
    totalCommitment = formData.payAmount * formData.workersNeeded;
  }

  const handlePublish = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createGigPosting(formData);
      setSubmitting(false);

      const createdPosting = response.posting || {
        ...formData,
        id: 'gig-' + Date.now(),
        status: 'OPEN',
        filledCount: 0,
        createdAt: new Date().toISOString(),
      };

      // Navigate to success screen
      navigation.navigate('PostingSuccess', { posting: createdPosting });
    } catch (err) {
      setSubmitting(false);
      const msg =
        err.message ||
        (err.fields ? Object.values(err.fields).join('\n') : 'Could not publish gig posting.');
      setErrorMessage(msg);
      Alert.alert('Submission Error', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.reviewBanner}>
          <Text style={styles.reviewBannerTitle}>Review Before Publishing (FR-POST-09)</Text>
          <Text style={styles.reviewBannerSub}>
            Verify all information below. Once published, your listing becomes immediately visible to
            matching youth job-seekers.
          </Text>
        </View>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* 1. Core Summary Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeIcon}>{categoryObj?.icon || '🛍️'}</Text>
              <Text style={styles.categoryBadgeText}>
                {categoryObj?.label || formData.category}
              </Text>
            </View>
            <View style={styles.arrangementBadge}>
              <Text style={styles.arrangementBadgeText}>
                {arrangementObj?.label || formData.arrangementType}
              </Text>
            </View>
          </View>

          <Text style={styles.titleText}>{formData.title}</Text>
          <Text style={styles.descriptionText}>{formData.description}</Text>
        </View>

        {/* 2. Computed Previews Card (FR-POST-07 & FR-POST-08) */}
        <View style={styles.card}>
          <Text style={styles.cardSectionHeader}>COMPUTED PREVIEWS (NON-EDITABLE)</Text>

          {/* Urgency Status Preview */}
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Computed Urgency (FR-POST-07):</Text>
            {formData.isUrgent ? (
              <View style={styles.urgentPill}>
                <Text style={styles.urgentPillText}>⚡ URGENT GIG (24h–48h window)</Text>
              </View>
            ) : (
              <View style={styles.standardPill}>
                <Text style={styles.standardPillText}>📅 Standard Schedule</Text>
              </View>
            )}
          </View>
          <Text style={styles.previewNote}>
            {formData.isUrgent
              ? 'Starts within 24–48 hours of posting; prioritized in browse sorting and instant notification pushes.'
              : 'Starts outside the 24–48h urgency window.'}
          </Text>

          <View style={styles.divider} />

          {/* Public Location Preview via LocationDisplay (FR-POST-08) */}
          <Text style={styles.previewLabel}>Public Location View (Job-Seeker Perspective):</Text>
          <LocationDisplay
            locationAreaLabel={formData.locationAreaLabel}
            locationAddress={null} // deliberately null to demonstrate coarse preview
            isPreciseLocationReleased={false}
            locationLat={formData.locationLat}
            locationLng={formData.locationLng}
          />
        </View>

        {/* 3. Schedule, Slots & Pay Details */}
        <View style={styles.card}>
          <Text style={styles.cardSectionHeader}>SLOTS & COMPENSATION</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Workers Needed (Slots):</Text>
            <Text style={styles.detailVal}>{formData.workersNeeded} worker(s)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Start Date & Time:</Text>
            <Text style={styles.detailValHighlight}>{formatDateTime(formData.startAt)}</Text>
          </View>

          {formData.schedule && (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Recurring Schedule:</Text>
              <Text style={styles.detailVal}>{formData.schedule}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Stated Pay Rate:</Text>
            <Text style={styles.payHighlightText}>{payDisplayString}</Text>
          </View>

          {totalCommitment != null && (
            <View style={styles.totalBox}>
              <Text style={styles.totalBoxLabel}>
                Total Employer Pay Commitment ({formData.workersNeeded} slots):
              </Text>
              <Text style={styles.totalBoxValue}>{formatLKR(totalCommitment)}</Text>
              <Text style={styles.totalBoxNote}>
                Stated pay applies per worker ({formatLKR(formData.payAmount)} × {formData.workersNeeded}{' '}
                workers = {formatLKR(totalCommitment)}).
              </Text>
            </View>
          )}
        </View>

        {/* 4. Poster Identity Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionHeader}>POSTED AS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Account Type:</Text>
            <Text style={styles.detailVal}>
              {formData.postedAsType === 'BUSINESS'
                ? '🏢 Registered Business'
                : '👤 Individual / Household'}
            </Text>
          </View>

          {formData.postedAsType === 'BUSINESS' && formData.postedBusinessName && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.detailKey}>Business Name:</Text>
              <Text style={styles.detailVal}>{formData.postedBusinessName}</Text>
              {formData.postedBusinessBio && (
                <Text style={styles.bioText}>{formData.postedBusinessBio}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.editBtnText}>← Edit Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.publishBtn, submitting && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.publishBtnText}>Publish Gig Now 🚀</Text>
          )}
        </TouchableOpacity>
      </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  reviewBanner: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  reviewBannerSub: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryBadgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  arrangementBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  arrangementBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  urgentPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentPillText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
  },
  standardPill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  standardPillText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  previewNote: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
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
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  detailValHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  payHighlightText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  totalBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    marginTop: 8,
  },
  totalBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  totalBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 2,
  },
  totalBoxNote: {
    fontSize: 11,
    color: '#166534',
    marginTop: 4,
  },
  bioText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  publishBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  publishBtnDisabled: {
    opacity: 0.7,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
});
