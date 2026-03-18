import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import { apiRequest } from "../services/api";
import { useApp } from "../state/AppContext";

export default function ParentDashboardScreen() {
  const { token } = useApp();
  const [report, setReport] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([
      apiRequest("/parents/summary", { token }),
      apiRequest("/parents/recommendations", { token })
    ])
      .then(([summaryRes, recRes]) => {
        if (!mounted) return;
        setReport(summaryRes.report || null);
        setRecommendations(Array.isArray(recRes.items) ? recRes.items.slice(0, 3) : []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load parent dashboard.");
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <ScreenLayout title="Parent Dashboard" subtitle="Weekly summary and recommendations.">
      <InlineMessage type="error" text={error} />
      <Card>
        <Text>This week: {report?.sessions ?? 0} sessions, {report?.weeklyMinutes ?? 0} min</Text>
        <Text>Math: {report?.mathProgress ?? 0}%</Text>
        <Text>Reading: {report?.readingProgress ?? 0}%</Text>
      </Card>
      <Card>
        <Text>Top recommendations:</Text>
        {recommendations.length ? (
          recommendations.map((item) => <Text key={item.skillId || item.label}>- {item.label}</Text>)
        ) : (
          <Text>- Keep regular daily practice.</Text>
        )}
      </Card>
      <PrimaryButton label="Share Report" onPress={() => {}} />
    </ScreenLayout>
  );
}
