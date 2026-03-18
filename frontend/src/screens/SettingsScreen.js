import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Switch, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import {
  fetchNotificationPreferences,
  syncOfflinePayload,
  trackEvent,
  updateNotificationPreferences
} from "../services/api";
import { clearOfflineQueue, getOfflineQueue } from "../services/offlineQueue";
import { useApp } from "../state/AppContext";
import { theme } from "../theme";

export default function SettingsScreen({ navigation }) {
  const { token, child } = useApp();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchNotificationPreferences({ token })
      .then((res) => {
        if (!mounted) return;
        setEnabled(Boolean(res.preferences?.enabled));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load notification settings.");
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleToggleNotifications = async (value) => {
    setLoading(true);
    setError("");
    setStatus("");
    setEnabled(value);

    try {
      await updateNotificationPreferences({
        token,
        updates: { enabled: value }
      });
      setStatus(value ? "Smart notifications enabled." : "Smart notifications disabled.");
      trackEvent({
        token,
        childId: child?.id,
        type: "notification_pref_changed",
        metadata: { enabled: value }
      });
    } catch (err) {
      setError("Unable to update notification preferences.");
      setEnabled(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOffline = async () => {
    setSyncing(true);
    setError("");
    setStatus("");
    try {
      const queue = getOfflineQueue();
      if (!queue.length) {
        setStatus("No offline data to sync.");
        return;
      }

      const res = await syncOfflinePayload({
        token,
        payload: { events: queue }
      });

      clearOfflineQueue();
      setStatus(`Offline sync complete: ${res.synced?.events || 0} events uploaded.`);
    } catch (err) {
      setError("Offline sync failed. Try again later.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScreenLayout title="Settings" subtitle="Manage notifications, sync, and tools.">
      <InlineMessage type="error" text={error} />
      <InlineMessage type="info" text={status} />

      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Smart Notifications</Text>
          <Switch value={enabled} onValueChange={handleToggleNotifications} disabled={loading} />
        </View>
        <Text style={styles.muted}>Adaptive reminders based on activity and progress.</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Offline Sync</Text>
        <Text style={styles.muted}>Upload offline activity logs when connection is back.</Text>
        <PrimaryButton
          label={syncing ? "Syncing..." : "Sync Offline Data"}
          onPress={handleSyncOffline}
          disabled={syncing}
        />
      </Card>

      <Card>
        <Text style={styles.label}>Homework Scanner</Text>
        <Text style={styles.muted}>Scan a homework photo URL and get AI feedback.</Text>
        <PrimaryButton
          label="Open Scanner"
          onPress={() => navigation.navigate("HomeworkScanner")}
        />
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.s
  },
  label: {
    fontWeight: "700"
  },
  muted: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.s
  }
});
