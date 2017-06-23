// some gesture tests

import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native'


var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window')

var BOX_DIMENSIONS = 100

export default class DragBox extends Component {
  state = {
    pan: new Animated.ValueXY(),
    text: 'swipe box left/right to choose'
  }

  getStyle() {
    return [
      styles.box,
      {
        // just change x and y position (= simple drag)
        // transform: this.state.pan.getTranslateTransform()

        // interpolate position to transform rotation
        transform: [
          { translateX: this.state.pan.x },
          { translateY: this.state.pan.y },
          {
            rotate: this.state.pan.x.interpolate({
              inputRange: [-200, 0, 200],
              outputRange: ['-30deg', '0deg', '30deg']
            })
          }
        ]
      },
      // interpolate position to change opacity
      {
        opacity: this.state.pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [0.2, 1, 0.2]
        })
      },
      // change color based on x position
      {
        backgroundColor: this.state.pan.x.interpolate({
          inputRange: [-100, 0, 100],
          outputRange: ['rgba(255,0,0,1)', 'rgba(0,0,255,1)', 'rgba(0,255,0,1)']
        })
      }
    ]
  }

  componentWillMount() {
    this._animatedValueX = 0
    this._animatedValueY = 0
    this.state.pan.x.addListener(value => this._animatedValueX = value.value)
    this.state.pan.y.addListener(value => this._animatedValueY = value.value)

    this._panResponder = PanResponder.create({
      onMoveSholdSetResponderCapture: () => true, // allow movement
      onMoveShouldSetPanResponderCapture: () => true, // allow dragging
      onResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this._animatedValueX, y: this._animatedValueY})
        this.state.pan.setValue({x: 0, y: 0}) // apply delta changes on this initial value
      },
      onPanResponderMove: Animated.event([
        null,                                           // ignore raw event arg
        { dx: this.state.pan.x, dy: this.state.pan.y }  // gestureState arg
      ]), // function to handle the movement and set offsets
      onPanResponderRelease: () => {
        // re-set the default positioning (= stay at position)
        // this.state.pan.flattenOffset()

        // Spring back to original position (= centered)
        Animated.spring(this.state.pan, {
          toValue: 0,
        }).start()

        // change text according to swipe
        // swipe left: rejected | swipe right: approved
        if (this._animatedValueX > 0) {
          this.setState({ text: 'approved' })
        } else {
          this.setState({ text: 'rejected' })
        }
      }
    })
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners()
    this.state.pan.y.removeAllListeners()
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={this.getStyle()} {...this._panResponder.panHandlers}
        />
        <Text style={styles.text}>
          {this.state.text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: BOX_DIMENSIONS,
    height: BOX_DIMENSIONS,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 20,
    color: 'green',
    marginTop: 30
  }
})
