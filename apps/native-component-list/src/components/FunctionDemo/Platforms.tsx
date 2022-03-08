import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Platform } from './index.types';

function joinWithCamelCase<T extends string, H extends string>([first, second]: [
  H,
  T
]): `${H}${Capitalize<T>}` {
  return `${first}${second.charAt(0).toUpperCase()}${second.slice(1)}` as `${H}${Capitalize<T>}`;
}

function PlatformIndicator({ platform }: { platform: Platform }) {
  return (
    <View style={[styles.platform, styles[joinWithCamelCase(['platform', platform])]]}>
      <Text style={styles.platformText}>{platform}</Text>
    </View>
  );
}

export default function Platforms({ platforms }: { platforms: Platform[] }) {
  return (
    <View style={styles.container}>
      {platforms.map((platform) => (
        <PlatformIndicator key={platform} platform={platform} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -2,
    left: 0,
    flexDirection: 'row',
  },
  platform: {
    borderRadius: 10,
    paddingHorizontal: 3,
    marginRight: 2,
  },
  platformAndroid: {
    backgroundColor: '#79bf2d',
  },
  platformIos: {
    backgroundColor: '#909090',
  },
  platformWeb: {
    backgroundColor: '#4b4bff',
  },
  platformText: {
    fontSize: 6,
    color: 'white',
  },
});
