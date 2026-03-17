import React from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

export default function LeaderboardsScreen() {
  return (
    <ScreenLayout title="Leaderboards" subtitle="See how you rank.">
      <Card>
        <Text>1. Maya - 2100</Text>
        <Text>2. Alex - 2050</Text>
        <Text>3. Leo - 1980</Text>
      </Card>
      <PrimaryButton label="Challenge a Friend" onPress={() => {}} />
    </ScreenLayout>
  );
}
