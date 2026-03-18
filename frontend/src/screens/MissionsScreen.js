import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { apiRequest, trackEvent } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function MissionsScreen({ navigation }) {
  const { token } = useApp();
  const [quest, setQuest] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/quests/active?skillId=math.multiplication.1&difficulty=2", { token })
      .then((res) => {
        if (!mounted) return;
        const item = Array.isArray(res.items) ? res.items[0] : null;
        setQuest(item || null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load quests.");
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleComplete = async () => {
    if (!quest?.id) return;

    try {
      await apiRequest("/quests/complete", {
        method: "POST",
        token,
        body: JSON.stringify({ skillId: "math.multiplication.1", score: 1 })
      });
      await apiRequest("/gamification/reward", {
        method: "POST",
        token,
        body: JSON.stringify({ xp: quest.rewardXp || 20, reason: "quest_complete" })
      });
      trackEvent({
        token,
        type: "quest_completed",
        metadata: { world: quest.world, rewardXp: quest.rewardXp || 20 }
      });
      setStatusMessage("Quest completed. Reward added.");
    } catch (err) {
      setError("Unable to complete quest right now.");
    }
  };

  return (
    <ScreenLayout title="Missions" subtitle="Narrative map and quests.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.map}>o - o - o - o</Text>
        <Text style={styles.map}>|   |   |   |</Text>
        <Text style={styles.map}>o - o - o - o</Text>
      </Card>
      <Card>
        <Text style={styles.title}>{quest?.title || "Quest loading..."}</Text>
        <Text style={styles.muted}>{quest?.objective || "Complete missions to unlock this quest."}</Text>
        {quest?.world ? <Text style={styles.badge}>World: {quest.world}</Text> : null}
        {quest?.rewardXp ? <Text style={styles.badge}>Reward: {quest.rewardXp} XP</Text> : null}
        <InlineMessage type="info" text={statusMessage} />
        <PrimaryButton label="Start Quest" onPress={() => navigation.navigate("Exercise")} />
        <PrimaryButton label="Complete Quest" onPress={handleComplete} />
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  map: {
    fontFamily: "monospace",
    color: theme.colors.muted
  },
  title: {
    fontWeight: "700",
    marginBottom: theme.spacing.s
  },
  muted: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.s
  },
  badge: {
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    fontWeight: "600"
  }
});
