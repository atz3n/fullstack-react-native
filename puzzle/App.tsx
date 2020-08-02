import React from "react";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  UIManager,
  ViewStyle
} from "react-native";

import { createPuzzle } from "./utils/puzzle";
import { getRandomImage } from "./utils/api";
import Game from "./screens/Game";
import Start from "./screens/Start";
import { Puzzle, ImageType } from "./utils/types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BACKGROUND_COLORS = ["#1B1D34", "#2A2A38"];

interface State {
  size: number;
  puzzle: Puzzle | null;
  image: ImageType | null;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    size: 3,
    puzzle: null,
    image: null
  };

  componentDidMount() {
    this.preloadNextImage();
  }

  async preloadNextImage() {
    const image = await getRandomImage();

    Image.prefetch(image.uri);

    this.setState({ image });
  }

  handleChangeSize = (size: number) => {
    this.setState({ size });
  };

  handleStartGame = () => {
    const { size } = this.state;

    this.setState({ puzzle: createPuzzle(size) });
  };

  handleGameChange = (puzzle: Puzzle) => {
    this.setState({ puzzle });
  };

  handleQuit = () => {
    this.setState({ puzzle: null, image: null });

    this.preloadNextImage();
  };

  render() {
    const { size, puzzle, image } = this.state;

    return (
      <LinearGradient style={styles.background} colors={BACKGROUND_COLORS}>
        <StatusBar barStyle={"light-content"} />
        <SafeAreaView style={styles.container}>
          {!puzzle && (
            <Start
              size={size}
              onStartGame={this.handleStartGame}
              onChangeSize={this.handleChangeSize}
            />
          )}
          {puzzle && (
            <Game
              puzzle={puzzle}
              image={image}
              onChange={this.handleGameChange}
              onQuit={this.handleQuit}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

interface Style {
  background: ViewStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  background: {
    flex: 1
  },
  container: {
    flex: 1,
    marginTop:
      Platform.OS === "android" || parseInt(Platform.Version as string, 10) < 11
        ? Constants.statusBarHeight
        : 0
  }
});
