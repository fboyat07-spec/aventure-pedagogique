import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { theme } from "../theme";

export default function StreakScreen() {
  return (
    <ScreenLayout title="Streak" subtitle="Keep your habit going.">
      <Card>
        <Text>Mon Tue Wed Thu Fri Sat Sun</Text>
        <Text style={styles.muted}>X X X X X - -</Text>
      </Card>
      <PrimaryButton label="Use Recovery" onPress={() => {}} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  muted: {
    color: theme.colors.muted,
    marginTop: theme.spacing.s
  }
});
