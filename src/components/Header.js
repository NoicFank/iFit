import React from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

const Header = ({title,img,leftClick}) =>(
    <View style={styles.header}>
        <TouchableOpacity 
         onPress={()=>{
             //打开抽屉
             global.navigation.navigation.navigate('DrawerOpen')
         }}
        >
            <Image source={require('../assets/img/menu.png')} style={styles.left}/>
        </TouchableOpacity>
        
        <Text style = {styles.title}>
            {title}
        </Text>
    </View>
);

var styles = StyleSheet.create({
    left:{
        height:15,
        width:25,
    },
    header:{
        backgroundColor:'#FFCC33',
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        elevation:5
    },
    title:{
        flex:1,
        textAlign:'center',
        fontSize:18,
        fontWeight:'200',
        color:'#ffffff',
        margin:8
    }
});

export default Header;