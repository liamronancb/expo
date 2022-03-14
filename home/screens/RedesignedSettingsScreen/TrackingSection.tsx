import { Text, View } from 'expo-dev-client-components';
import * as Tracking from 'expo-tracking-transparency';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import { PressableOpacity } from '../../components/PressableOpacity';
import { RedesignedSectionHeader } from '../../components/RedesignedSectionHeader';

export function TrackingSection() {
  const [showTrackingItem, setShowTrackingItem] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const { status } = await Tracking.getTrackingPermissionsAsync();
      setShowTrackingItem(status === 'undetermined');
    })();
  }, [showTrackingItem]);

  return showTrackingItem ? (
    <View>
      <RedesignedSectionHeader header="Tracking" />

      <View bg="default" overflow="hidden" rounded="large" border="hairline">
        <PressableOpacity
          onPress={async () => {
            const { status } = await Tracking.requestTrackingPermissionsAsync();
            setShowTrackingItem(status === 'undetermined');
          }}
          containerProps={{ bg: 'default' }}>
          <View padding="medium">
            <Text size="medium">Allow access to app-related data for tracking</Text>
          </View>
        </PressableOpacity>
      </View>

      <TouchableOpacity onPress={handleLearnMorePress}>
        <View py="small" px="medium">
          <Text size="small" color="link">
            Learn more about what data Expo collects and why.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://expo.io/privacy-explained');
}
