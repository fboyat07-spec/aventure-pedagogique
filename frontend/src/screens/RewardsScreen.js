import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import { theme } from "../theme";

export default function RewardsScreen() {
  return (
    <ScreenLayout title="Rewards" subtitle="XP, levels, and badges.">
      <Card>
        <Text style={styles.title}>Level 4</Text>
        <ProgressBar value={60} />
        <Text style={styles.muted}>1200 / 1500 XP</Text>
      </Card>
      <Card>
        <Text style={styles.title}>Badges</Text>
        <View style={styles.row}>
          <Text>Star</Text>
          <Text>Explorer</Text>
          <Text>Helper</Text>
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
