import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { theme } from "../theme";

export default function DiagnosticScreen({ navigation }) {
  return (
    <ScreenLayout title="Diagnostic" subtitle="Find the right starting level.">
      <Card>
        <Text style={styles.question}>What is 3 + 4 ?</Text>
        <View style={styles.choices}>
          <Text style={styles.choice}>6</Text>
          <Text style={styles.choice}>7</Text>
          <Text style={styles.choice}>8</Text>
          <Text style={styles.choice}>9</Text>
        </View>
        <PrimaryButton label="Submit Answer" onPress={() => navigation.navigate("Exercise")} />
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.m
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m
  },
  choice: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8
  }
});
