
/**
* @providesModule ScrollableList
* @flow
*/

import React, {Component} from 'react';
import {ListView, RefreshControl} from 'react-native';

class ScrollableList extends Component {
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

    if (typeof this.onRefresh() === 'object' &&
     typeof this.onRefresh().then === 'function') {
      this.onRefresh().then(this.setState({refreshing: false}));
    } else {
      this.onRefresh();
      this.setState({refreshing: false});
    }
  }

  refreshControl() {
    return (<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)}/>);
  }

  render() {
    const Row = this.row;
    return (
      <ListView
        {...this.otherProps}
        dataSource={this.state.dataSource}
        renderRow={(data, sectionID, rowID, highlightRow) => (
          <Row
            {...data}
            sectionID={sectionID}
            rowID={rowID}
            highlightRow={highlightRow}
          />
        )}
        refreshControl={this.onRefresh ? this.refreshControl() : null}
      />
    );
  }
}

export default ScrollableList;
