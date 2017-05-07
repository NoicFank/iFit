import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import {
  AppRegistry,
  View,
  Text,
  Image,
  ListView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  WebView
} from 'react-native';
import Header from '../Header.js';
import Navigation from '../../Navigation.js';
import styles from '../Keep/KeepStyles.js';
import FetchDatas from '../Keep/FetchData.js';
import RenderView from '../Keep/RenderView.js'
import LoadingImage from '../../assets/img/loading.gif'


var {width,height} = Dimensions.get('window');
/**
 * 概览
 */
export default class Keep extends Component {

  static navigationOptions = {
    tabBar: {
      label: 'Keep',
      icon: ({ tintColor }) => (
        <Image
          source={require('../../assets/img/keep.png')}
          style={{ height: 18, width: 18 }}
        />
      ),
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
    //this.fetchData = this.fetchData.bind(this); 
  }

  componentDidMount() {
    var self = this;
    /**
     * 读取数据
     */
    storage.load({
      key: 'fittime',
      autoSync: true,
    })
      .then(function (ret) {
        //检测缓存，没有缓存则抛出错误，重新加载缓存
        if (typeof ret !== 'array' || ret.length == 0)
          throw new Error("没有数据");
        self.setState({
          dataSource: self.state.dataSource.cloneWithRows(ret),
          loaded: true,
        });
      })
      .catch(function (err) {
        self.fetchData();
      });
  }


  fetchData() {
    var self = this;
    var currentPage = 1;
    var totalPage = 12;
    FetchDatas.fetchData(self,currentPage,totalPage);
  }

  //加入缓存
  saveData() {
    storage.save({
      key: "keep",
      rawData: this.state.dataSource,
      expires: 1000 * 60 * 5 //缓存过期时间
    });
  }

  /**
   * 返回网页
   */
  render() {
    var self = this;
    if (!this.state.loaded) {
      return RenderView.renderLoadingView(LoadingImage);
    }
    else return RenderView.renderView('Keep', self);
  }

  _pressRow(rowData) {
    var imageUrl = rowData.url;
    Navigation.openWeb({
      title: rowData.title,
      url: imageUrl,
    });
  }

  //渲染返回de1listView的每一个
  _renderRow(rowData, sectionID, rowID) {
    var self = this;
    return (
      <View style={styles.ImageTextContainer}>
        <TouchableOpacity
          style={styles.bigContainer}
          onPress={() => self._pressRow({
            url: rowData[0].url,
            title: rowData[0].title,
          })}>
          <Image style={styles.BigImage}
            source={{ uri: rowData[0].photo }}>
            <Text style={styles.bigTextView}
              numberOfLines={1}>
              {rowData[0].title}
            </Text>
          </Image>
        </TouchableOpacity>
        <View style={styles.line}/>

          {rowData.map(function (ele, i) {
            if (i > 0) {
              return (
                <View key={i} >
                <TouchableOpacity
                  style={ styles.smallContainer}
                  onPress={() => self._pressRow({
                    url: ele.url,
                    title: ele.title,
                  })}>
                  <Image style={styles.smallImage}
                    source={{ uri: ele.photo }} />
                  <Text style={styles.smallTextView} >
                      {ele.title}
                   </Text>
                </TouchableOpacity>
                {
                    (i !== 3)?
                    <View style={styles.line}/>
                    :
                    <View/>
                }
                    
                </View>
              );
            }
          })}
      </View >
    );
  }
}


AppRegistry.registerComponent('Keep', () => Keep);