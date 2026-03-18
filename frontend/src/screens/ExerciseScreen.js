import React, { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { theme } from "../theme";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";

export default function ExerciseScreen() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("info");
  const [exercise, setExercise] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useApp();

  useEffect(() => {
    let mounted = true;
    apiRequest("/exercises/generate", {
      method: "POST",
      token,
      body: JSON.stringify({ skillId: "math.addition.1", difficulty: 1 })
    })
      .then((res) => {
        if (!mounted) return;
        const item = Array.isArray(res.items) ? res.items[0] : null;
        setExercise(item || null);
        setAnswer("");
        setFeedback("");
        setFeedbackType("info");
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load exercise.");
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSubmit = async () => {
    if (!exercise?.id) return;
    if (!answer.trim()) {
      setFeedbackType("error");
      setFeedback("Please enter an answer first.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest("/exercises/submit", {
        method: "POST",
        token,
        body: JSON.stringify({ exerciseId: exercise.id, answer })
      });

      if (result.isCorrect) {
        setFeedbackType("info");
        setFeedback("Great job! Correct answer.");
      } else {
        setFeedbackType("error");
        setFeedback(
          result.correctAnswer
            ? `Good try. Correct answer: ${result.correctAnswer}`
            : "Good try. Check your answer and try again."
        );
      }
    } catch (err) {
      setFeedbackType("error");
      setFeedback("Unable to submit answer right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout title="Exercise" subtitle="Solve the prompt below.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.question}>{exercise?.prompt || "Loading..."}</Text>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="Type your answer"
          style={styles.input}
          keyboardType="number-pad"
        />
        <PrimaryButton
          label={submitting ? "Submitting..." : "Submit"}
          onPress={handleSubmit}
          disabled={submitting}
        />
        <InlineMessage type={feedbackType} text={feedback} />
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.m
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m
  }
});
