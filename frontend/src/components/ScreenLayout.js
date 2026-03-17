import React from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from "react-native";
import { theme } from "../theme";

export default function ScreenLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  container: {
    padding: theme.spacing.l
  },
  header: {
    marginBottom: theme.spacing.m
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.muted
  },
  content: {
    gap: theme.spacing.m
  }
});
