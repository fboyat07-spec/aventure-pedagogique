import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Tag from "../components/Tag";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function HomeScreen({ navigation }) {
  const { token, child, user } = useApp();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiRequest("/skills", { token })
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res.items) ? res.items : [];
        setCount(items.length);
        setError("");
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load skills right now.");
        setCount(0);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <ScreenLayout title="Home" subtitle="Daily mission and quick stats.">
      <InlineMessage type="error" text={error} />
      {child ? (
        <Card>
          <Text style={styles.sectionTitle}>Welcome back, {child.name}</Text>
          <Text style={styles.muted}>
            Goal: {user?.weeklyGoal ? user.weeklyGoal.replace(/_/g, " ") : "not set yet"}
          </Text>
        </Card>
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>Daily mission</Text>
        <Text style={styles.muted}>Fractions - 3 min</Text>
        <View style={styles.row}>
          <Tag label="Quick" />
          <Tag label="Math" />
        </View>
        <ProgressBar value={40} />
        <PrimaryButton label="Continue" onPress={() => navigation.navigate("Exercise")} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.stat}>Streak: 5 days</Text>
          <Text style={styles.stat}>XP: 1200</Text>
        </View>
        <Text style={styles.muted}>{loading ? "Loading skills..." : `Skills loaded: ${count}`}</Text>
      </Card>

      <PrimaryButton label="Start Diagnostic" onPress={() => navigation.navigate("Diagnostic")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "700",
    marginBottom: theme.spacing.s
  },
  muted: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.s
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.s
  },
  stat: {
    fontWeight: "600"
  }
});
