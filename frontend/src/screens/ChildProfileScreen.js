import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { theme } from "../theme";

export default function ChildProfileScreen({ navigation }) {
  return (
    <ScreenLayout title="Child Profile" subtitle="Create a profile to personalize learning.">
      <Card>
        <Text style={styles.field}>Name: __________</Text>
        <Text style={styles.field}>Age: 6 - 14</Text>
        <Text style={styles.field}>Grade: ________</Text>
        <Text style={styles.field}>Interests: ________</Text>
      </Card>
      <PrimaryButton label="Continue" onPress={() => navigation.navigate("OnboardingGoals")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: theme.spacing.s
  }
});
