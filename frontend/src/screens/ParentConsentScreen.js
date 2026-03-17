import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { theme } from "../theme";

export default function ParentConsentScreen({ navigation }) {
  return (
    <ScreenLayout title="Parent Consent" subtitle="Review data use and protections.">
      <Card>
        <Text style={styles.item}>- Privacy by default</Text>
        <Text style={styles.item}>- Minimal data collection</Text>
        <Text style={styles.item}>- Parent dashboard visibility</Text>
      </Card>
      <PrimaryButton label="Accept" onPress={() => navigation.navigate("ChildProfile")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: theme.spacing.s
  }
});
