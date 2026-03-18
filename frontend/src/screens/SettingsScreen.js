import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Switch, TextInput, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import InlineMessage from "../components/InlineMessage";
import {
  fetchOpsStatus,
  fetchNotificationPreferences,
  listPushDevices,
  registerPushDevice,
  reportClientError,
  sendSmartNudgePush,
  sendTestPush,
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
  const [pushLoading, setPushLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [registeredDevices, setRegisteredDevices] = useState(0);
  const [ops, setOps] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchNotificationPreferences({ token }),
      fetchOpsStatus({ token }),
      listPushDevices({ token })
    ])
      .then(([prefsRes, opsRes, devicesRes]) => {
        if (!mounted) return;
        setEnabled(Boolean(prefsRes.preferences?.enabled));
        setOps(opsRes || null);
        setRegisteredDevices(Array.isArray(devicesRes.items) ? devicesRes.items.length : 0);
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
      reportClientError({
        token,
        message: "offline_sync_failed",
        stack: String(err?.message || ""),
        context: { path: "SettingsScreen", queueSize: getOfflineQueue().length }
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleRegisterToken = async () => {
    if (!deviceToken.trim()) {
      setError("Please paste a valid FCM token.");
      return;
    }
    setPushLoading(true);
    setError("");
    setStatus("");
    try {
      await registerPushDevice({
        token,
        deviceToken: deviceToken.trim(),
        platform: "manual"
      });
      const devicesRes = await listPushDevices({ token });
      setRegisteredDevices(Array.isArray(devicesRes.items) ? devicesRes.items.length : registeredDevices);
      setStatus("Device token registered.");
    } catch (err) {
      setError("Unable to register push token.");
    } finally {
      setPushLoading(false);
    }
  };

  const handleSendTestPush = async () => {
    setPushLoading(true);
    setError("");
    setStatus("");
    try {
      const res = await sendTestPush({ token });
      setStatus(`Test push sent: ${res.report?.success || 0} success, ${res.report?.failed || 0} failed.`);
    } catch (err) {
      setError("Unable to send test push.");
    } finally {
      setPushLoading(false);
    }
  };

  const handleSendNudgePush = async () => {
    setPushLoading(true);
    setError("");
    setStatus("");
    try {
      const res = await sendSmartNudgePush({ token, childName: child?.name || "" });
      setStatus(`Smart nudge push sent: ${res.report?.success || 0} success.`);
    } catch (err) {
      setError("Unable to send smart nudge push.");
    } finally {
      setPushLoading(false);
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
        <Text style={styles.label}>FCM Push Devices</Text>
        <Text style={styles.muted}>Registered devices: {registeredDevices}</Text>
        <TextInput
          style={styles.input}
          value={deviceToken}
          onChangeText={setDeviceToken}
          autoCapitalize="none"
          placeholder="Paste FCM token here"
        />
        <PrimaryButton
          label={pushLoading ? "Working..." : "Register Device Token"}
          onPress={handleRegisterToken}
          disabled={pushLoading}
        />
        <PrimaryButton
          label={pushLoading ? "Working..." : "Send Test Push"}
          onPress={handleSendTestPush}
          disabled={pushLoading}
        />
        <PrimaryButton
          label={pushLoading ? "Working..." : "Send Smart Nudge Push"}
          onPress={handleSendNudgePush}
          disabled={pushLoading}
        />
      </Card>

      <Card>
        <Text style={styles.label}>System Status</Text>
        <Text style={styles.muted}>
          OpenAI: {ops?.services?.openai ? "ready" : "offline"} | Firebase:{" "}
          {ops?.services?.firebase ? "ready" : "offline"}
        </Text>
        <Text style={styles.muted}>Version: {ops?.version || "dev"}</Text>
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
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 10,
    marginBottom: theme.spacing.s
  }
});
