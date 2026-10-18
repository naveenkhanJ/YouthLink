/**
 * Write a public response — prototype M6 6.4 (FR-RATE-06, user side) — added 2026-10-18.
 *
 * Figma 6.4 (178:48): Chrome/ScreenHeader "Public response" on color/bg/default; content pad
 * 20/16/0/16, gap 12: the context line "Responding to: Saman Stores rated you 5 of 5"
 * (mobile/caption), Input/TextArea, the note "Shown alongside the rating you received. Up to 300
 * characters." (mobile/secondary); a pinned ctaBar with "Post response".
 *
 * Route: RatingResponse { ratingId, counterpartyName, score, current } — opened from 6.3's
 * "Write a public response" and 6.3p's "Edit your response"; `current` pre-fills an edit.
 * The 300-character cap is enforced in the field and on the server. Posting goes back to 6.3,
 * which re-reads and shows the response as 6.3p.
 *
 * FR-RATE-06 keeps this path apart from disputes: a response is the rated party's say, with no
 * moderator or admin involved.
 *
 * States: posting (Button Loading), a failure or offline (FormBanner Kind=Error above the field;
 * the text is kept). An empty response can't be posted (the server refuses it): the button stays
 * enabled and says why on press, per design-system G1.
 */
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import ScreenHeader from "../../components/ScreenHeader";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";
import CtaBar from "../../components/CtaBar";
import FormBanner from "../../components/FormBanner";
import { colors, spacing, typography } from "../../theme/tokens";
import { postPublicResponse } from "../../api/rating.api.js";
import { parseApiError } from "../../api/client.js";

const RESPONSE_CAP = 300;

export default function PublicResponseScreen({ navigation, route }) {
  const { ratingId, counterpartyName, score, current } = route.params || {};
  const [text, setText] = useState(current ?? "");
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  async function post() {
    setError(null);
    if (!text.trim()) {
      setError("Write a response first.");
      return;
    }
    setPosting(true);
    try {
      await postPublicResponse(ratingId, text.trim());
      navigation.goBack();
    } catch (err) {
      setError(parseApiError(err).formError || "Your response couldn't be posted. Try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Public response" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
      >
        {error ? <FormBanner kind="error" message={error} /> : null}
        <Text style={styles.context}>
          Responding to: {counterpartyName} rated you {score} of 5
        </Text>
        <TextArea
          value={text}
          onChangeText={(value) => {
            setText(value);
            setError(null);
          }}
          maxLength={RESPONSE_CAP}
          accessibilityLabel="Your public response"
        />
        <Text style={styles.note}>Shown alongside the rating you received. Up to 300 characters.</Text>
      </KeyboardAwareScrollView>
      <CtaBar>
        <Button title="Post response" onPress={post} loading={posting} />
      </CtaBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  scroll: {
    flex: 1,
  },
  // Figma: content pad 20/16/0/16, gap 12.
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  context: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  note: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
});
