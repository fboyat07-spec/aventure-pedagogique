import React, { useEffect, useMemo, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import ProgressBar from "../components/ProgressBar";
import { apiRequest, trackEvent } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function DiagnosticScreen({ navigation }) {
  const { token } = useApp();
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest("/diagnostics/start", {
      method: "POST",
      token,
      body: JSON.stringify({ domain: "math", level: 1 })
    })
      .then((res) => {
        if (!active) return;
        setSessionId(res.session?.id || "");
        setQuestion(res.question || null);
        setProgress(0);
      })
      .catch(() => {
        if (!active) return;
        setError("Unable to start diagnostic right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const canSubmit = useMemo(() => Boolean(sessionId && selected && question), [sessionId, selected, question]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const answerRes = await apiRequest("/diagnostics/answer", {
        method: "POST",
        token,
        body: JSON.stringify({ sessionId, answer: selected })
      });

      setProgress(answerRes.progress || 0);
      setSelected("");

      if (answerRes.done) {
        const finish = await apiRequest("/diagnostics/finish", {
          method: "POST",
          token,
          body: JSON.stringify({ sessionId })
        });
        trackEvent({
          token,
          type: "diagnostic_completed",
          metadata: { placement: finish.placement, skillId: finish.recommendedSkill }
        });
        setResult(finish);
        setQuestion(null);
        return;
      }

      setQuestion(answerRes.nextQuestion || null);
    } catch (err) {
      setError("Unable to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout title="Diagnostic" subtitle="Find your best starting level.">
      <InlineMessage type="error" text={error} />

      <Card>
        <Text style={styles.progressLabel}>Progress {progress}%</Text>
        <ProgressBar value={progress} />
      </Card>

      <Card>
        <Text style={styles.question}>{question?.prompt || (loading ? "Loading..." : "No question available.")}</Text>
        <View style={styles.choices}>
          {(question?.choices || []).map((choice) => {
            const active = selected === choice;
            return (
              <Pressable
                key={choice}
                style={[styles.choice, active && styles.choiceActive]}
                onPress={() => setSelected(choice)}
              >
                <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{choice}</Text>
              </Pressable>
            );
          })}
        </View>
        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Placement: {result.placement}</Text>
            <Text style={styles.resultSubtitle}>Recommended skill: {result.recommendedSkill}</Text>
            <PrimaryButton label="Start Exercise" onPress={() => navigation.navigate("Exercise")} />
          </View>
        ) : (
          <PrimaryButton
            label={submitting ? "Submitting..." : "Submit Answer"}
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
          />
        )}
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  progressLabel: {
    fontWeight: "600",
    marginBottom: theme.spacing.s
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.m
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m
  },
  choice: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8
  },
  choiceActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8"
  },
  choiceText: {
    color: theme.colors.text
  },
  choiceTextActive: {
    color: "#FFFFFF"
  },
  resultBox: {
    gap: theme.spacing.s
  },
  resultTitle: {
    fontWeight: "700"
  },
  resultSubtitle: {
    color: theme.colors.muted
  }
});
