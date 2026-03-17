import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Tag({ label }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  text: {
    fontSize: 12,
    color: "#4338CA"
  }
});
