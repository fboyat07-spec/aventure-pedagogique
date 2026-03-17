import React, { useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";
import { getFirebaseIdToken, hasFirebaseConfig } from "../services/firebase";

export default function WelcomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setToken } = useApp();

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      let firebaseToken = "dev";
      if (hasFirebaseConfig()) {
        const token = await getFirebaseIdToken();
        if (token) firebaseToken = token;
      }

      const res = await apiRequest("/auth/session", {
        method: "POST",
        body: JSON.stringify({ firebaseToken })
      });
      setToken(res.token || null);
      navigation.navigate("ParentConsent");
    } catch (err) {
      setError("Unable to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Welcome" subtitle="Learn with AI, play and grow.">
      <InlineMessage type="error" text={error} />
      <PrimaryButton
        label={loading ? "Loading..." : "Start"}
        onPress={handleStart}
        disabled={loading}
      />
      <Text>Parent consent required before learning starts.</Text>
    </ScreenLayout>
  );
}
