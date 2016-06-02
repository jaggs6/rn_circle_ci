/**
 * Created by jagdeep on 12/05/2016.
 */
/**
 * @providesModule MainScreen
 * @flow
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RefreshableList from 'RefreshableList';
import ScrollabeList from 'react-native-scrollable-list';

const data = [{
  name: 'Bakerloo',
  lineStatuses: [{statusSeverityDescription: 'ok'}]
}];

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowItem: {
    flex: 1,
    margin: 10
  }
});

const StatusRow = rowData => (
    <View style={styles.row}>
      <Text style={styles.rowItem}>
        {rowData.name}</Text>
      <Text style={styles.rowItem}>
        {rowData.lineStatuses[0].statusSeverityDescription}</Text>
    </View>
  );

class MainScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: data
    };
  }

  _fetchData() {
    return fetch('https://api.tfl.gov.uk/Line/Mode/tube/Status') // eslint-disable-line no-undef
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          data: responseData
        });
      });
  }

  componentDidMount() {
    this._fetchData();
  }

  render() {
    return (
      <View style={styles.container}>
        <RefreshableList
          data={this.state.data}
          row={StatusRow}
          onRefresh={this._fetchData.bind(this)} />
      </View>
    );
  }
}

AppRegistry.registerComponent('rn_circle_ci', () => MainScreen);
