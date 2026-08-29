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

import HomeScreen from "../screens/HomeScreen";

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
      <Stack.Navigator initialRouteName="Home">
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
