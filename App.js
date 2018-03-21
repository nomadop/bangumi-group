import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import 'rxjs';

import Groups from './containers/Groups';
import GroupForum from './containers/GroupForum';
import Topic from './containers/Topic';
import Discover from './containers/Discover';
import reducers from './reducers';
import epics from './epics';

const epicMiddleware = createEpicMiddleware(epics);
const middlewares = [logger, epicMiddleware];

const store = createStore(reducers, undefined, compose(
  applyMiddleware(...middlewares)
));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={styles.container}>
            <Route exact path="/" component={Groups} />
            <Route exact path="/discover" component={Discover} />
            <Route exact path="/group/:name" component={GroupForum} />
            <Route path="/group/topic/:id" component={Topic} />
          </View>
        </NativeRouter>
      </Provider>
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
