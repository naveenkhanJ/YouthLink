import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapPinDisplay from './MapPinDisplay.js';

/**
 * LocationDisplay — Coarse-area vs Precise-address display component for FR-POST-08 & FR-APPLY-07.
 *
 * Handles both states:
 * - Coarse state: Shows suburb-level area label and privacy explanation.
 * - Precise state: Shows exact street address, precise map pin, and confirmation badge.
 *
 * @param {Object} props
 * @param {string} props.locationAreaLabel - Coarse area label (e.g. "Bambalapitiya, Colombo 04").
 * @param {string|null} [props.locationAddress] - Precise street address (null if unselected/unprivileged).
 * @param {boolean} [props.isPreciseLocationReleased] - Explicit flag indicating if address is revealed.
 * @param {number} [props.locationLat] - Latitude.
 * @param {number} [props.locationLng] - Longitude.
 */
export default function LocationDisplay({
  locationAreaLabel,
  locationAddress = null,
  isPreciseLocationReleased = false,
  locationLat,
  locationLng,
}) {
  // Address is considered released if explicit flag is true or if locationAddress string is provided
  const isPrecise = Boolean(isPreciseLocationReleased || locationAddress);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>LOCATION</Text>

      {/* Main Map Visual Component */}
      <MapPinDisplay
        isPrecise={isPrecise}
        areaLabel={locationAreaLabel}
        latitude={locationLat}
        longitude={locationLng}
      />

      {/* Detail Card Below Map */}
      <View style={styles.card}>
        {isPrecise ? (
          // PRECISE RELEASED VIEW (Employer & Selected Worker)
          <View>
            <View style={styles.statusRow}>
              <View style={styles.precisePill}>
                <Text style={styles.precisePillText}>✓ Exact Address Released</Text>
              </View>
            </View>

            <Text style={styles.addressLabel}>Street Address</Text>
            <Text style={styles.addressValue}>{locationAddress}</Text>

            <Text style={styles.areaSubLabel}>Area / Suburb</Text>
            <Text style={styles.areaValue}>{locationAreaLabel}</Text>

            <View style={styles.infoBoxPrecise}>
              <Text style={styles.infoTextPrecise}>
                📍 You have access to the exact venue address as a selected participant. Use this for arrival coordination.
              </Text>
            </View>
          </View>
        ) : (
          // COARSE PUBLIC VIEW (Browsers & Unselected Applicants)
          <View>
            <View style={styles.statusRow}>
              <View style={styles.coarsePill}>
                <Text style={styles.coarsePillText}>🔒 Privacy Protected</Text>
              </View>
            </View>

            <Text style={styles.addressLabel}>General Area</Text>
            <Text style={styles.areaValue}>{locationAreaLabel || 'Location specified on map'}</Text>

            <View style={styles.infoBoxCoarse}>
              <Text style={styles.infoTextCoarse}>
                Exact street address remains private until you are selected for this gig by the employer (FR-POST-08).
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  precisePill: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  precisePillText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  coarsePill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coarsePillText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  addressLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  addressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    lineHeight: 22,
  },
  areaSubLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  areaValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  infoBoxPrecise: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  infoTextPrecise: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  infoBoxCoarse: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#94A3B8',
  },
  infoTextCoarse: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
