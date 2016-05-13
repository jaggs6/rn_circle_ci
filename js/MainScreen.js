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
  ListView,
  Text,
  RefreshControl,
  View
} from 'react-native';

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

let ds;

class MainScreen extends Component {

  constructor(props) {
    super(props);
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2)});
    const data = [{
      name: 'Bakerloo',
      lineStatuses: [{statusSeverityDescription: 'ok'}]
    }];
    // console.warn('constructor', data);
    this.state = {
      dataSource: ds.cloneWithRows(data),
      refreshing: false
    };
  }

  _fetchData() {
    fetch('https://api.tfl.gov.uk/Line/Mode/tube/Status') // eslint-disable-line no-undef
      .then(response => response.json())
      .then(responseData => {
        // console.warn('fetch',responseData);
        this.setState({
          dataSource: ds.cloneWithRows(responseData),
          refreshing: false
        });
      });
  }

  componentDidMount() {
    this._fetchData();
  }

  _renderRow(rowData) {
    // console.warn('renderRow', JSON.stringify(rowData));
    return (
      <View style={styles.row}>
        <Text style={styles.rowItem}>{rowData.name}</Text>
        <Text style={styles.rowItem}>{rowData.lineStatuses[0]
          .statusSeverityDescription}</Text>
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchData();
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
    // console.warn('render', JSON.stringify(this.state.dataSource));
  }
}

AppRegistry.registerComponent('rn_circle_ci', () => MainScreen);
