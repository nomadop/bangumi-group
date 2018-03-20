import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NavigationBar = (props) => {
  return (
    <View style={styles.navigation}>
      <TouchableOpacity onPress={props.onBack} style={styles.left}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.right} />
    </View>
  )
};

const styles = StyleSheet.create({
  navigation: {
    height: 64,
    borderColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 16,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  left: {
    width: 48,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    width: 48,
  },
});

export default NavigationBar;
