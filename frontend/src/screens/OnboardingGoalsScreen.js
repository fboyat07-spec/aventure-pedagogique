import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { theme } from "../theme";

export default function OnboardingGoalsScreen({ navigation }) {
  return (
    <ScreenLayout title="Choose a Goal" subtitle="Pick a weekly goal to personalize progress.">
      <Card>
        <View style={styles.option}><Text>5 missions</Text></View>
        <View style={styles.option}><Text>3 challenges</Text></View>
        <View style={styles.option}><Text>10 min daily</Text></View>
      </Card>
      <PrimaryButton label="Enter App" onPress={() => navigation.navigate("Main")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: theme.spacing.s
  }
});
