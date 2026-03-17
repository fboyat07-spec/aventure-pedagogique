import React from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

export default function ProgressScreen({ navigation }) {
  return (
    <ScreenLayout title="Progress" subtitle="Skill mastery and reviews.">
      <Card>
        <Text>Math 70%</Text>
        <ProgressBar value={70} />
        <Text>Reading 55%</Text>
        <ProgressBar value={55} />
      </Card>
      <PrimaryButton label="View Streak" onPress={() => navigation.navigate("Streak")} />
    </ScreenLayout>
  );
}
