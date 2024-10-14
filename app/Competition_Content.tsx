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
    const events = [
      "70m Women Recurve (1 dây)",
      "Toàn năng (70 mx 2) Men Recurve (1 dây)",
      "90m Men Compound (3 dây)",
      "90m Men Recurve (1 dây)",
      "Đôi Nam Cung 1 dây",
      "Đôi Nữ Cung 1 dây",
      "Đôi Nam - Nữ Cung 1 dây",
      "90m Men Compound (3 dây)",
      "90m Men Recurve (1 dây)",
      "70m Women Recurve (1 dây)",
      "70m Women Recurve (1 dây)",
      "Đôi Nam Cung 1 dây",
      "Đôi Nữ Cung 1 dây",
      "Đôi Nam - Nữ Cung 1 dây",
      "90m Men Compound (3 dây)",
      "90m Men Recurve (1 dây)",
      "70m Women Recurve (1 dây)",
      "Đôi Nam Cung 1 dây",
      "Đôi Nữ Cung 1 dây",
      "Đôi Nam - Nữ Cung 1 dây",
    ];
    return (
      <View style={styles.scrollViewContent}>
        {events.map((event, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.textEvent}>{event}</Text>
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
    height: 50,
    margin: 8,
    padding: 8,
    paddingLeft: 16,
    backgroundColor: "#ffffff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#d7e1e1",
    overflow: "hidden",
    textAlign: "center",
    justifyContent: "center",
  },
  textEvent: {
    fontSize: 17,
    fontWeight: "bold",
  },
  bar: {
    marginTop: 14,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
});
