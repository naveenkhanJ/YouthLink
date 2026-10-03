/**
 * Posting published (prototype 2.9e urgent, 2.9et not urgent; FR-POST-10) — Lahiru.
 *
 * A centred success screen: the whole screen is one short block, so its button stays
 * with the message instead of in a pinned ctaBar (design-system.md §5, "Where the
 * action is deliberately not pinned"). The body says what the posting being urgent
 * (or not) set in motion — the urgent push to opted-in youth nearby (FR-NOTIF-01), or
 * the ordinary new-gig alert (FR-NOTIF-02) — using the server's own isUrgent.
 */
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, spacing, typography } from '../../theme/tokens';
import Button from '../../components/Button';

const URGENT_BODY =
  "It starts within 48 hours, so it was marked urgent — an urgent push went out to opted-in youth nearby, and it's flagged in Browse.";
const STANDARD_BODY =
  "It starts in more than 48 hours, so it's listed normally — youth nearby see it in Browse, and a new-gig alert goes to those who haven't turned them off.";

export default function PostingSuccessScreen({ route, navigation }) {
  const { posting } = route.params || {};

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* successGlyph 56x56: a 3px ring in color/state/success with a 3.5px check. */}
        <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
          <Circle cx={28} cy={28} r={26.5} stroke={colors.state.success} strokeWidth={3} />
          <Path
            d="M16 29L25 38L41 19"
            stroke={colors.state.success}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.title}>Your gig is live</Text>
        <Text style={styles.body}>{posting?.isUrgent ? URGENT_BODY : STANDARD_BODY}</Text>
        <Button title="View my postings" onPress={() => navigation.navigate('PostingList')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // Figma: vertical block centred in the 800 frame, pad 0/24/0/24, gap 14.
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: 14,
  },
  title: {
    ...typography.display,
    color: colors.text.primary,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
