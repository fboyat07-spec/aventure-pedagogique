import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export default function InlineMessage({ type = "info", text }) {
  if (!text) return null;
  return (
    <View style={[styles.box, type === "error" && styles.error]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: theme.spacing.m,
    borderRadius: 10,
    backgroundColor: "#E8F1FF"
  },
  error: {
    backgroundColor: "#FDECEC"
  },
  text: {
    color: theme.colors.text
  }
});
