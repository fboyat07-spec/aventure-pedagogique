import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    })
  });
}

export async function getAutoPushTokenAsync() {
  if (Platform.OS === "web") {
    return { ok: false, error: "Push auto token is not available on web build." };
  }

  if (!Device.isDevice) {
    return { ok: false, error: "Use a real device to generate a push token." };
  }

  const current = await Notifications.getPermissionsAsync();
  let finalStatus = current.status;
  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") {
    return { ok: false, error: "Notification permission denied." };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX
    });
  }

  try {
    const pushToken = await Notifications.getDevicePushTokenAsync();
    const token = String(pushToken?.data || "");
    if (!token) {
      return { ok: false, error: "Unable to retrieve device push token." };
    }
    return { ok: true, token, platform: Platform.OS };
  } catch (error) {
    return { ok: false, error: "Unable to retrieve device push token." };
  }
}

export function subscribeToPushEvents({ onReceive, onOpen }) {
  if (Platform.OS === "web") return () => {};

  const receiveSub = Notifications.addNotificationReceivedListener((notification) => {
    if (typeof onReceive === "function") {
      onReceive(notification);
    }
  });

  const openSub = Notifications.addNotificationResponseReceivedListener((response) => {
    if (typeof onOpen === "function") {
      onOpen(response);
    }
  });

  return () => {
    receiveSub.remove();
    openSub.remove();
  };
}
