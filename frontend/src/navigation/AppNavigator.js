import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomeScreen from "../screens/WelcomeScreen";
import ParentConsentScreen from "../screens/ParentConsentScreen";
import ChildProfileScreen from "../screens/ChildProfileScreen";
import OnboardingGoalsScreen from "../screens/OnboardingGoalsScreen";
import HomeScreen from "../screens/HomeScreen";
import MissionsScreen from "../screens/MissionsScreen";
import TutorChatScreen from "../screens/TutorChatScreen";
import RewardsScreen from "../screens/RewardsScreen";
import ProgressScreen from "../screens/ProgressScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DiagnosticScreen from "../screens/DiagnosticScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import StreakScreen from "../screens/StreakScreen";
import LeaderboardsScreen from "../screens/LeaderboardsScreen";
import FriendsChallengesScreen from "../screens/FriendsChallengesScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Tutor" component={TutorChatScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ParentConsent" component={ParentConsentScreen} />
      <Stack.Screen name="ChildProfile" component={ChildProfileScreen} />
      <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Diagnostic" component={DiagnosticScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
      <Stack.Screen name="FriendsChallenges" component={FriendsChallengesScreen} />
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
    </Stack.Navigator>
  );
}
