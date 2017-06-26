import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
} from 'react-native'
import Interactable from 'react-native-interactable'

const People = ['red', 'green', 'blue', 'purple', 'orange']

var SWIPE_THRESHOLD = 120

export default class Cards extends Component {

  _deltaX = new Animated.Value(0)
  
  state = {
    person: People[0],
  }

  _goToNextPerson() {
    console.log('_goToNextPerson()')
    let currentPersonIdx = People.indexOf(this.state.person)
    let newIdx = currentPersonIdx + 1
    let newPerson = People[newIdx > People.length - 1 ? 0 : newIdx]

    console.log('currentPerson:', this.state.person)
    console.log('newPerson:', newPerson)

    this.setState({ person: newPerson })
  }

  componentDidMount() {
    console.log('_componentDidMount()')
  }

  componentWillMount() {
    console.log('_componentWillMount()')
  }

  _resetState() {
    console.log('_resetState()')
    this._deltaX.setValue(0)
    this._goToNextPerson()

    // TODO: replace with changePosition(), when published as npm module
    // https://github.com/wix/react-native-interactable#interactableview-methods
    // this.refs.myCard.changePosition({x: 0, y: 0})
    this.refs.myCard.snapTo({index: 1})
  }

  _onCardSnap(event) {
    const snapPointId = event.nativeEvent.id
    const snapPointIndex = event.nativeEvent.index
    console.log(`card index is ${snapPointIndex}`)
    console.log(`card state is ${snapPointId}`)
    snapPointId != 'undecided' && this._resetState()
  }


  render() {
    console.log('render()')
    console.log(this.state)
    return (
      <View style={styles.container}>
        <Interactable.View ref="myCard" style={styles.container}
          horizontalOnly={true}
          snapPoints={[
            { x: 390, id: 'keep'}, 
            { x: 0, damping: 0.8, id: 'undecided' },
            { x: -390, id: 'trash' }, 
          ]}
          onSnap={this._onCardSnap.bind(this)}
          animatedValueX={this._deltaX} >

          <Animated.View
            style={[styles.card, { backgroundColor: this.state.person }, {
              transform: [{
                rotate: this._deltaX.interpolate({
                  inputRange: [-200, 0, 200],
                  outputRange: ['-30deg', '0deg', '30deg'],
                })
              }]
            }, {
              opacity: this._deltaX.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: [0.5, 1, 0.5],
                })
              }
            ]} >

            <Animated.View style={[styles.overlay, {backgroundColor: '#de6d77'}, {
              opacity: this._deltaX.interpolate({
                inputRange: [-120, 0],
                outputRange: [0.8, 0],
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }]}>
              <Text style={styles.overlayText}>Trash</Text>
            </Animated.View>

            <Animated.View style={[styles.overlay, {backgroundColor: '#2f9a5d'}, {
              opacity: this._deltaX.interpolate({
                inputRange: [0, 120],
                outputRange: [0, 0.8],
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }]}>
              <Text style={styles.overlayText}>Keep</Text>
            </Animated.View>
          </Animated.View>
        </Interactable.View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
    overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayText: {
    fontSize: 60,
    color: 'white'
  },
})

