import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * MapPinDisplay — Visual pin component for FR-POST-08.
 *
 * Renders two visual states:
 * 1. Coarse area pin (suburb/general zone halo) for public browsers & unselected applicants.
 * 2. Precise drop pin (exact pinpoint) for the Employer and Selected Worker.
 *
 * @param {Object} props
 * @param {boolean} props.isPrecise - Whether the precise address/coordinates are released.
 * @param {string} [props.areaLabel] - Coarse area name (e.g. "Bambalapitiya, Colombo 04").
 * @param {number} [props.latitude] - Latitude coordinate.
 * @param {number} [props.longitude] - Longitude coordinate.
 */
export default function MapPinDisplay({
  isPrecise = false,
  areaLabel = '',
  latitude,
  longitude,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.mapCanvas, isPrecise ? styles.canvasPrecise : styles.canvasCoarse]}>
        {/* Map Grid / Subtle background decoration */}
        <View style={styles.gridLineHorizontal} />
        <View style={styles.gridLineVertical} />

        {isPrecise ? (
          // Exact Pin State
          <View style={styles.preciseMarkerContainer}>
            <View style={styles.precisePinPulse} />
            <View style={styles.precisePinHead}>
              <View style={styles.precisePinDot} />
            </View>
            <View style={styles.precisePinPoint} />
            <View style={styles.preciseBadge}>
              <Text style={styles.preciseBadgeText}>Exact Location</Text>
            </View>
          </View>
        ) : (
          // Coarse Area Circle State
          <View style={styles.coarseMarkerContainer}>
            <View style={styles.coarseOuterRing} />
            <View style={styles.coarseInnerCircle}>
              <Text style={styles.coarseIcon}>📍</Text>
            </View>
            <View style={styles.coarseBadge}>
              <Text style={styles.coarseBadgeText}>General Area Only</Text>
            </View>
          </View>
        )}
      </View>

      {/* Coordinate & Area summary footer */}
      <View style={styles.footer}>
        <Text style={styles.areaText}>
          {areaLabel || 'Location unavailable'}
        </Text>
        {latitude != null && longitude != null && (
          <Text style={styles.coordText}>
            {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
            {!isPrecise && ' (approximate zone)'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  mapCanvas: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  canvasCoarse: {
    backgroundColor: '#F0FDF4',
  },
  canvasPrecise: {
    backgroundColor: '#EFF6FF',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  // Precise Pin Marker Styles
  preciseMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  precisePinPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  precisePinHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  precisePinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  precisePinPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2563EB',
    marginTop: -1,
  },
  preciseBadge: {
    marginTop: 6,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  preciseBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Coarse Marker Styles
  coarseMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coarseOuterRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#059669',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  coarseInnerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  coarseIcon: {
    fontSize: 18,
  },
  coarseBadge: {
    marginTop: 8,
    backgroundColor: '#065F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  coarseBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  // Footer Styles
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  areaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  coordText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
