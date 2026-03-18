import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function RewardsScreen() {
  const { token } = useApp();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/gamification/status", { token })
      .then((res) => {
        if (!mounted) return;
        setProfile(res.profile || null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load rewards status.");
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const currentXp = Number(profile?.xp || 0);
  const level = Number(profile?.level || 1);
  const levelStart = (level - 1) * 250;
  const nextLevelAt = level * 250;
  const progress = Math.round(((currentXp - levelStart) / Math.max(nextLevelAt - levelStart, 1)) * 100);

  return (
    <ScreenLayout title="Rewards" subtitle="XP, levels, and badges.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.title}>Level {level}</Text>
        <ProgressBar value={Math.max(0, Math.min(100, progress))} />
        <Text style={styles.muted}>
          {currentXp} / {nextLevelAt} XP
        </Text>
      </Card>
      <Card>
        <Text style={styles.title}>Badges</Text>
        <View style={styles.row}>
          {(profile?.badges?.length ? profile.badges : ["Starter"]).map((badge) => (
            <Text key={badge}>{badge}</Text>
          ))}
        </View>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
    marginBottom: theme.spacing.s
  },
  muted: {
    color: theme.colors.muted,
    marginTop: theme.spacing.s
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.m
  }
});
