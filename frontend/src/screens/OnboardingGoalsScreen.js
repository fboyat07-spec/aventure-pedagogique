import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function OnboardingGoalsScreen({ navigation }) {
  const { token, setUser } = useApp();
  const [selected, setSelected] = useState("missions_5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = [
    { id: "missions_5", label: "5 missions/week" },
    { id: "challenges_3", label: "3 challenges/week" },
    { id: "minutes_10_daily", label: "10 min/day" }
  ];

  const handleContinue = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest("/users/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ weeklyGoal: selected })
      });
      if (res.user) setUser(res.user);
      navigation.navigate("Main");
    } catch (err) {
      setError("Unable to save your goal right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Choose a Goal" subtitle="Pick a weekly goal to personalize progress.">
      <InlineMessage type="error" text={error} />
      <Card>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={[styles.option, selected === option.id && styles.optionSelected]}
            onPress={() => setSelected(option.id)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </Pressable>
        ))}
      </Card>
      <PrimaryButton
        label={loading ? "Saving..." : "Enter App"}
        onPress={handleContinue}
        disabled={loading}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: theme.spacing.s
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "#E8F1FF"
  },
  optionText: {
    fontWeight: "600"
  }
});
