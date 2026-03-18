import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, StyleSheet, View, Pressable, Platform } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { theme } from "../theme";
import { apiRequest, trackEvent } from "../services/api";
import { useApp } from "../state/AppContext";

export default function TutorChatScreen() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const { token } = useApp();

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return undefined;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      if (transcript) setMessage(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => {
      try {
        recognition.stop();
      } catch (err) {
        // no-op
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setError("");
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      setListening(false);
      setError("Microphone unavailable. Check browser permissions.");
    }
  };

  const speakReply = () => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      setError("Voice output is currently available on web browser only.");
      return;
    }

    if (!reply) return;

    const synth = window.speechSynthesis;
    if (!synth) {
      setError("Text-to-speech is not supported on this browser.");
      return;
    }

    synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(reply);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    synth.speak(utterance);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/tutor/chat", {
        method: "POST",
        token,
        body: JSON.stringify({ message: message.trim() })
      });
      setReply(res.reply || "");
      setSource(res.source || "");
      trackEvent({
        token,
        type: "tutor_message",
        metadata: { source: res.source || "unknown", inputLength: message.trim().length }
      });
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
        {source ? <Text style={styles.meta}>Source: {source}</Text> : null}
      </Card>
      <View style={styles.voiceRow}>
        <Pressable
          style={[styles.voiceButton, !voiceSupported && styles.voiceButtonDisabled]}
          onPress={toggleListening}
          disabled={!voiceSupported}
        >
          <Text style={styles.voiceButtonText}>{listening ? "Stop mic" : "Voice input"}</Text>
        </Pressable>
        <Pressable
          style={[styles.voiceButton, !reply && styles.voiceButtonDisabled]}
          onPress={speakReply}
          disabled={!reply}
        >
          <Text style={styles.voiceButtonText}>Read answer</Text>
        </Pressable>
      </View>
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
  meta: {
    color: theme.colors.muted,
    fontSize: 12
  },
  row: {
    gap: theme.spacing.s
  },
  voiceRow: {
    flexDirection: "row",
    gap: theme.spacing.s,
    marginBottom: theme.spacing.s
  },
  voiceButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  voiceButtonDisabled: {
    opacity: 0.45
  },
  voiceButtonText: {
    color: theme.colors.text,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: theme.spacing.m
  }
});
