import React from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";

export default function SettingsScreen() {
  return (
    <ScreenLayout title="Settings" subtitle="Manage your account.">
      <Card>
        <Text>Profile</Text>
        <Text>Notifications</Text>
        <Text>Privacy</Text>
        <Text>Offline Packs</Text>
        <Text>Account</Text>
      </Card>
    </ScreenLayout>
  );
}
