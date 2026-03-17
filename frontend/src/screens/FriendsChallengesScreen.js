import React from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

export default function FriendsChallengesScreen() {
  return (
    <ScreenLayout title="Friends and Challenges" subtitle="Play and learn with friends.">
      <Card>
        <Text>Friends: 12</Text>
        <Text>Pending requests: 2</Text>
        <Text>Active challenges: 1</Text>
      </Card>
      <PrimaryButton label="Create Challenge" onPress={() => {}} />
    </ScreenLayout>
  );
}
