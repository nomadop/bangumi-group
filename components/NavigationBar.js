import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NavigationBar = (props) => {
  const { onBack, title, renderRightTitle } = props;
  const leftTitle = onBack ? <Text>Back</Text> : <View />;
  const rightTitle = renderRightTitle ? renderRightTitle() : <View />;
  return (
    <View style={styles.navigation}>
      <TouchableOpacity onPress={onBack} style={styles.left}>
        { leftTitle }
      </TouchableOpacity>
      <View style={styles.title}>
        <Text>{title}</Text>
      </View>
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
    alignItems: 'stretch',
    paddingTop: 16,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  left: {
    width: 64,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 64,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default NavigationBar;
