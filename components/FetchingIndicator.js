import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const FetchingIndicator = () => (
  <View style={styles.container}>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FetchingIndicator;
