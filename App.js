import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ImageBackground, Alert } from 'react-native';
import { Animated } from 'react-native';
import JUNGLE_IMAGE from './assets/bg.jpg'
export default function App() {
  const [playerY, setPlayerY] = useState(new Animated.Value(300));
  const [obstacleY, setObstacleY] = useState(new Animated.Value(0));
  const [obstacleX, setObstacleX] = useState(Math.random() * 300);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacleX(Math.random() * 300);
      Animated.timing(obstacleY, {
        toValue: 600,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        setObstacleY(new Animated.Value(0));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const collisionCheck = setInterval(() => {
      if (obstacleY._value > 250 && Math.abs(obstacleX - 150) < 50 && playerY._value > 250) {
        setLives(prev => prev - 1);
        if (lives <= 1) {
          Alert.alert('Game Over', 'You have no lives left!', [{ text: 'Restart', onPress: () => restartGame() }]);
        }
      }
    }, 50);

    return () => clearInterval(collisionCheck);
  }, [obstacleY, obstacleX, playerY, lives]);

  const jump = () => {
    Animated.timing(playerY, {
      toValue: 150,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(playerY, {
        toValue: 300,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
  };

  const restartGame = () => {
    setLives(3);
    setObstacleY(new Animated.Value(0));
    setObstacleX(Math.random() * 300);
  };

  return (
    <ImageBackground source={JUNGLE_IMAGE} style={styles.background}>
      <TouchableWithoutFeedback onPress={jump}>
        <View style={styles.container}>
          <Animated.View style={[styles.player, { top: playerY }]} />
          <Animated.View style={[styles.obstacle, { top: obstacleY, left: obstacleX }]} />
          <Text style={styles.lives}>Lives: {lives}</Text>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    position: 'absolute',
  },
  obstacle: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    position: 'absolute',
  },
  lives: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 20,
    color: 'white',
  },
});
