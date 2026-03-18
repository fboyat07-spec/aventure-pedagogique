import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider, useApp } from "./src/state/AppContext";
import { markNotificationOpened, reportClientError, trackEvent } from "./src/services/api";
import { subscribeToPushEvents } from "./src/services/pushNotifications";

function PushBridge() {
  const { token, child } = useApp();

  useEffect(() => {
    const unsubscribe = subscribeToPushEvents({
      onReceive: (notification) => {
        trackEvent({
          token,
          childId: child?.id,
          type: "notification_received",
          metadata: {
            title: notification?.request?.content?.title || "",
            route: notification?.request?.content?.data?.route || "Home"
          }
        });
      },
      onOpen: (response) => {
        const route = response?.notification?.request?.content?.data?.route || "Home";
        markNotificationOpened({ token, type: "push", route });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [token, child?.id]);

  useEffect(() => {
    const previousHandler = globalThis?.ErrorUtils?.getGlobalHandler?.();
    if (!globalThis?.ErrorUtils?.setGlobalHandler) return undefined;

    globalThis.ErrorUtils.setGlobalHandler((error, isFatal) => {
      reportClientError({
        token,
        message: isFatal ? "fatal_client_error" : "client_error",
        stack: String(error?.stack || ""),
        context: { path: "App", fatal: Boolean(isFatal) }
      });
      if (typeof previousHandler === "function") {
        previousHandler(error, isFatal);
      }
    });

    return () => {
      if (typeof previousHandler === "function") {
        globalThis.ErrorUtils.setGlobalHandler(previousHandler);
      }
    };
  }, [token]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <PushBridge />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
