import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../theme";

export default function ProgressBar({ value }) {
  const width = Math.max(0, Math.min(100, value || 0));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${width}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.accent
  }
});
