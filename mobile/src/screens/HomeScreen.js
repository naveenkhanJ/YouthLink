/**
 * Home & Module Launch Hub
 */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Branding */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>YL</Text>
          </View>
          <Text style={styles.title}>YouthLink</Text>
          <Text style={styles.subtitle}>
            Empowering Sri Lankan youth with verified gigs & decent work opportunities
          </Text>
        </View>

        {/* Module Section: Gig Posting (FR-POST — Lahiru) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionBadge}>SLICE B • GIG POSTING</Text>
            <Text style={styles.sectionTitle}>Employer Posting Flow</Text>
          </View>

          <Text style={styles.sectionDesc}>
            Create, review, and manage verified gig listings with lead-time validation, computed
            urgency, and privacy protection.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('PostingCreate')}
            >
              <Text style={styles.primaryBtnText}>+ Create a Gig Posting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('PostingList')}
            >
              <Text style={styles.secondaryBtnText}>📋 View My Postings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Highlights */}
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsHeading}>Verified Mechanics Built:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <Text style={styles.featureText}>
              <Text style={styles.bold}>Category Allow-List (FR-POST-02):</Text> 7 curated,
              youth-safe task categories with no free text.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>
              <Text style={styles.bold}>Urgency Computation (FR-POST-07):</Text> Automatically
              flagged for jobs starting in 24h–48h.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>
              <Text style={styles.bold}>Location Privacy (FR-POST-08):</Text> Coarse general-area
              map halo for public; exact address released upon selection.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>
              <Text style={styles.bold}>Multi-Slot Fill Tracking (FR-POST-14):</Text> Plain "X of Y
              filled" status tracking.
            </Text>
          </View>
        </View>

        <StatusBar style="dark" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: '#64748B',
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  btnRow: {
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  highlightsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#1E293B',
  },
});
