/**
 * The app's single navigator.
 *
 * ============================================================================
 * YOU SHOULD NOT NEED TO EDIT THIS FILE.
 *
 * To add a screen, add it to your own module's manifest:
 *   src/screens/<module>/<module>.screens.js
 *
 * Every manifest is collected here automatically, which is the point — four
 * people can add screens in parallel without ever editing the same file.
 * ============================================================================
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";

// DEMO-ONLY (demo/integration-showcase) — the three edits below are the whole
// footprint on this file: this import, demoScreens in the list, and the
// initial route plus the header button. Reverting them restores the original.
// See DEMO.md.
import demoScreens from "../demo/demo.screens";

import accountScreens from "../screens/account/account.screens";
import postingScreens from "../screens/posting/posting.screens";
import discoveryScreens from "../screens/discovery/discovery.screens";
import applicationScreens from "../screens/application/application.screens";
import notificationScreens from "../screens/notification/notification.screens";
import engagementScreens from "../screens/engagement/engagement.screens";
import ratingScreens from "../screens/rating/rating.screens";
import profileScreens from "../screens/profile/profile.screens";
import endorsementScreens from "../screens/endorsement/endorsement.screens";

const Stack = createNativeStackNavigator();

/** Every module's screens, flattened into one list. */
const moduleScreens = [
  ...demoScreens, // DEMO-ONLY — see the note at the top of this file
  ...accountScreens,
  ...postingScreens,
  ...discoveryScreens,
  ...applicationScreens,
  ...notificationScreens,
  ...engagementScreens,
  ...ratingScreens,
  ...profileScreens,
  ...endorsementScreens,
];

// Fails loudly at startup rather than showing a blank screen later, which is
// the confusing symptom of two modules choosing the same screen name.
const names = moduleScreens.map((s) => s.name);
const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
if (duplicates.length > 0) {
  throw new Error(
    `Duplicate screen name(s): ${[...new Set(duplicates)].join(", ")}. ` +
      `Prefix screen names with your module, e.g. "AccountRegister".`,
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      {/* DEMO-ONLY: initialRouteName is "DemoHub" rather than "Home", and
          every screen gets a header button back to the hub — the demo order
          isn't fixed in advance, so any screen has to be one tap from the
          launcher. Revert both to restore the original navigator. */}
      <Stack.Navigator
        initialRouteName="DemoHub"
        screenOptions={({ navigation, route }) =>
          route.name === "DemoHub"
            ? {}
            : {
                headerRight: () => (
                  <Pressable onPress={() => navigation.navigate("DemoHub")}>
                    <Text style={{ color: "#1D4ED8", fontWeight: "600" }}>
                      Demo hub
                    </Text>
                  </Pressable>
                ),
              }
        }
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "YouthLink" }}
        />
        {moduleScreens.map(({ name, component, options }) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
