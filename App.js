import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';

import Groups from './containers/Groups';
import GroupForum from './containers/GroupForum';
import Topic from './containers/Topic';

export default class App extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Route exact path="/" component={Groups} />
          <Route exact path="/group/:name" component={GroupForum} />
          <Route path="/group/topic/:id" component={Topic} />
        </View>
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
