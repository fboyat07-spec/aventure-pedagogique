import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";

export default function ProgressScreen({ navigation }) {
  const { token } = useApp();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/parents/summary", { token })
      .then((res) => {
        if (!mounted) return;
        setReport(res.report || null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load progress.");
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <ScreenLayout title="Progress" subtitle="Skill mastery and reviews.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text>Math {report?.mathProgress ?? 0}%</Text>
        <ProgressBar value={report?.mathProgress ?? 0} />
        <Text>Reading {report?.readingProgress ?? 0}%</Text>
        <ProgressBar value={report?.readingProgress ?? 0} />
      </Card>
      <PrimaryButton label="View Streak" onPress={() => navigation.navigate("Streak")} />
    </ScreenLayout>
  );
}
