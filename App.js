import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory';
import logger from 'redux-logger';
import 'rxjs';

import Groups from './containers/Groups';
import GroupForum from './containers/GroupForum';
import Topic from './containers/Topic';
import Discover from './containers/Discover';
import Browser from './containers/Browser';
import reducers from './reducers';
import epics from './epics';

const history = createHistory({
  getUserConfirmation: NativeRouter.defaultProps.getUserConfirmation
});

const epicMiddleware = createEpicMiddleware(epics);
const middlewares = [logger, epicMiddleware, routerMiddleware(history)];

const store = createStore(reducers, undefined, compose(
  applyMiddleware(...middlewares)
));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <View style={styles.container}>
            <Route exact path="/" component={Groups} />
            <Route exact path="/discover" component={Discover} />
            <Route exact path="/group/:name" component={GroupForum} />
            <Route exact path="/group/topic/:id" component={Topic} />
            <Route exact path="/browser" component={Browser} />
          </View>
        </ConnectedRouter>
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
