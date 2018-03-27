import React from 'react';
import { connect } from 'react-redux'
import { View, WebView, StyleSheet } from 'react-native';

import { browser as mapStateToProps } from '../selectors';
import { browser as browserActions } from '../actions';

import NavigationBar from '../components/NavigationBar';

const Browser = (props) => {
  const { history, uri, title, loadStart, loadDone, setTitle } = props;
  const handleMessage = (event) => {
    setTitle(event.nativeEvent.data);
    loadDone();
  };
  return (
    <View style={styles.container}>
      <NavigationBar title={title} onBack={() => history.goBack()} />
      <WebView
        source={{ uri }}
        onLoadStart={loadStart}
        onLoadEnd={loadDone}
        injectedJavaScript="window.postMessage(document.title)"
        onMessage={handleMessage}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fetchingIndicator: {
    flex: 0,
    height: 64,
  },
});

const mapDispatchToProps = {
  loadStart: browserActions.load.start,
  loadDone: browserActions.load.done,
  setTitle: browserActions.setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
