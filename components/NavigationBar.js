import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NavigationBar = (props) => {
  const { onBack, title, renderRightTitle } = props;
  const rightTitle = renderRightTitle ? renderRightTitle() : <View />;
  return (
    <View style={styles.navigation}>
      <TouchableOpacity onPress={onBack} style={styles.left}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        { rightTitle }
      </View>
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
    width: 64,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    width: 64,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default NavigationBar;
