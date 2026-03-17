import React from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

export default function ParentDashboardScreen() {
  return (
    <ScreenLayout title="Parent Dashboard" subtitle="Weekly summary and recommendations.">
      <Card>
        <Text>This week: 4 sessions, 52 min</Text>
        <Text>Mastery: +6%</Text>
        <Text>Recommendation: Fractions review</Text>
      </Card>
      <PrimaryButton label="Share Report" onPress={() => {}} />
    </ScreenLayout>
  );
}
