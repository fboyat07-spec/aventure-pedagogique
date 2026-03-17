import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { theme } from "../theme";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";

export default function TutorChatScreen() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useApp();

  const handleSend = async () => {
    if (!message) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/tutor/chat", {
        method: "POST",
        token,
        body: JSON.stringify({ message })
      });
      setReply(res.reply || "");
    } catch (err) {
      setError("Tutor is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="AI Tutor" subtitle="Ask for help anytime.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.line}>You: {message || "..."}</Text>
        {reply ? <Text style={styles.line}>Tutor: {reply}</Text> : null}
      </Card>
      <View style={styles.row}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your question"
          style={styles.input}
        />
        <PrimaryButton label={loading ? "Sending..." : "Send"} onPress={handleSend} disabled={loading} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  line: {
    marginBottom: theme.spacing.s
  },
  row: {
    gap: theme.spacing.s
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: theme.spacing.m
  }
});
