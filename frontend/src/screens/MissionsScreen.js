import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { theme } from "../theme";

export default function MissionsScreen({ navigation }) {
  return (
    <ScreenLayout title="Missions" subtitle="Narrative map and quests.">
      <Card>
        <Text style={styles.map}>o - o - o - o</Text>
        <Text style={styles.map}>|   |   |   |</Text>
        <Text style={styles.map}>o - o - o - o</Text>
      </Card>
      <Card>
        <Text style={styles.title}>Quest: Forest of Numbers</Text>
        <Text style={styles.muted}>Complete 3 exercises to unlock.</Text>
        <PrimaryButton label="Start Quest" onPress={() => navigation.navigate("Exercise")} />
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
  }
});
