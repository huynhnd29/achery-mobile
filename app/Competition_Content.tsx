import React, { Component } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface State {
  scrollY: Animated.Value;
}

export default class ScroCompetition_Content extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  _renderScrollViewContent() {
    const data = Array.from({ length: 30 });
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) => (
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1],
      extrapolate: "clamp",
    });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1],
      extrapolate: "clamp",
    });
    return (
      <SafeAreaView style={styles.fill}>
        <View style={styles.fill}>
          <Animated.ScrollView
            style={styles.fill}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: false }
            )}
          >
            {this._renderScrollViewContent()}
          </Animated.ScrollView>

          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.View
              style={[
                styles.bar,
                { opacity: titleOpacity, transform: [{ scale: titleScale }] },
              ]}
            >
              <Text style={styles.title}>Nội dung thi đấu</Text>
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#777979",
    overflow: "hidden",
    textAlign: "center",
    justifyContent: "center",
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "black",
    fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
});
