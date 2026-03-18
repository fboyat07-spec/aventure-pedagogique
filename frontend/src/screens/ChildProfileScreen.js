import React, { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function ChildProfileScreen({ navigation }) {
  const { token, setChild } = useApp();
  const [name, setName] = useState("");
  const [age, setAge] = useState("8");
  const [grade, setGrade] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setError("");
    const parsedAge = Number(age);
    if (!name.trim() || !Number.isInteger(parsedAge) || parsedAge < 6 || parsedAge > 14) {
      setError("Please enter a valid name and an age between 6 and 14.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        age: parsedAge,
        grade: grade.trim(),
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      const res = await apiRequest("/children", {
        method: "POST",
        token,
        body: JSON.stringify(payload)
      });
      setChild(res.child || null);
      navigation.navigate("OnboardingGoals");
    } catch (err) {
      setError("Unable to save the profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Child Profile" subtitle="Create a profile to personalize learning.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Ex: Lina"
        />

        <Text style={styles.label}>Age (6-14)</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Ex: 8"
        />

        <Text style={styles.label}>Grade</Text>
        <TextInput
          style={styles.input}
          value={grade}
          onChangeText={setGrade}
          placeholder="Ex: CE2"
        />

        <Text style={styles.label}>Interests (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={interests}
          onChangeText={setInterests}
          placeholder="Ex: Dinosaurs, Space, Drawing"
        />
      </Card>
      <PrimaryButton label={loading ? "Saving..." : "Continue"} onPress={handleContinue} disabled={loading} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: theme.spacing.s
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 10,
    marginBottom: theme.spacing.m,
    color: theme.colors.text
  }
});
