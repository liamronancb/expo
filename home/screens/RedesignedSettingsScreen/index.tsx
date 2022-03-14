import { Spacer, View } from 'expo-dev-client-components';
import * as Tracking from 'expo-tracking-transparency';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import ScrollView from '../../components/NavigationScrollView';
import { ConstantsSection } from './ConstantsSection';
import { DevMenuGestureSection } from './DevMenuGestureSection';
import { SignOutSection } from './SignOutSection';
import { ThemeSection } from './ThemeSection';
import { TrackingSection } from './TrackingSection';

export function RedesignedSettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
      <View flex="1" padding="medium">
        <ThemeSection />
        <Spacer.Vertical size="medium" />
        {Platform.OS === 'ios' && (
          <>
            <DevMenuGestureSection />
            <Spacer.Vertical size="medium" />
          </>
        )}
        {Tracking.isAvailable() && (
          <>
            <TrackingSection />
            <Spacer.Vertical size="medium" />
          </>
        )}
        <ConstantsSection />
        <Spacer.Vertical size="medium" />
        {/* TODO: remove signout from settings screen and move to account modal */}
        <SignOutSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
