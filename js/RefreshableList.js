
/**
* @providesModule RefreshableList
* @flow
*/

import React, {Component} from 'react';
import {ListView, RefreshControl} from 'react-native';

class RefreshableList extends Component {
  constructor(props) {
    super(props);

    const {data, row, onRefresh, ...other} = props;
    this.otherProps = other;
    this.row = row;
    this.onRefresh = onRefresh;

    this._ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this._ds.cloneWithRows(data),
      refreshing: false
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.data !== props.data) {
      this.setState({
        dataSource: this._ds.cloneWithRows(props.data)
      });
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.onRefresh().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const Row = this.row;
    return (
      <ListView
        {...this.otherProps}
        dataSource={this.state.dataSource}
        renderRow={data => <Row {...data} />}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }
}

export default RefreshableList;
