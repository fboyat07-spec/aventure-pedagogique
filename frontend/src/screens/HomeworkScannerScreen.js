import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import { scanHomework, trackEvent } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function HomeworkScannerScreen() {
  const { token, child } = useApp();
  const [imageUrl, setImageUrl] = useState("");
  const [instruction, setInstruction] = useState("Explique cet exercice simplement.");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const res = await scanHomework({ token, imageUrl: imageUrl.trim(), instruction });
      setAnalysis(res.analysis || null);
      trackEvent({
        token,
        childId: child?.id,
        type: "homework_scan",
        metadata: { source: res.analysis?.source || "unknown" }
      });
    } catch (err) {
      setError("Unable to analyze this image right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Homework Scanner" subtitle="Paste an image URL to get AI feedback.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
          placeholder="https://.../homework.jpg"
        />

        <Text style={styles.label}>Instruction (optional)</Text>
        <TextInput
          style={styles.input}
          value={instruction}
          onChangeText={setInstruction}
          placeholder="Ex: corrige comme un prof de CE2"
        />

        <PrimaryButton
          label={loading ? "Analyzing..." : "Analyze Homework"}
          onPress={handleScan}
          disabled={loading || !imageUrl.trim()}
        />
      </Card>

      {analysis ? (
        <Card>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.muted}>{analysis.summary}</Text>

          <Text style={styles.title}>Strengths</Text>
          {(analysis.strengths || []).map((item) => (
            <Text key={`s_${item}`}>- {item}</Text>
          ))}

          <Text style={styles.title}>Mistakes</Text>
          {(analysis.mistakes || []).map((item) => (
            <Text key={`m_${item}`}>- {item}</Text>
          ))}

          <Text style={styles.title}>Next Steps</Text>
          {(analysis.nextSteps || []).map((item) => (
            <Text key={`n_${item}`}>- {item}</Text>
          ))}

          <View style={styles.footer}>
            <Text style={styles.meta}>Source: {analysis.source || "unknown"}</Text>
          </View>
        </Card>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: theme.spacing.s
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 10,
    marginBottom: theme.spacing.m
  },
  title: {
    fontWeight: "700",
    marginBottom: theme.spacing.s,
    marginTop: theme.spacing.s
  },
  muted: {
    color: theme.colors.muted
  },
  footer: {
    marginTop: theme.spacing.m
  },
  meta: {
    color: theme.colors.muted,
    fontSize: 12
  }
});
