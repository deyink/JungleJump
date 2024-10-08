import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Dimensions, Button  } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Asset } from 'expo-asset';
import jungleBackground from './assets/jungle-background.gif';
import playerImage from './assets/player.gif';
import obstacleImage from './assets/obstacle.png';
import lifeImage from './assets/life.png';

const { width, height } = Dimensions.get('screen');



const GRAVITY = 1.5;
const JUMP_HEIGHT = 7;
const OBSTACLE_SPEED = 9;
const LIFE_APPEARANCE_RATE = 0.1; // Probability of life appearing on jump


export default function App() {
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const lifePosition = useRef(new Animated.Value(width)).current;
  const playerPosition = useRef(new Animated.Value(height / 2)).current;
  const obstaclePosition = useRef(new Animated.Value(width)).current;
  const playerVelocity = useRef(0);
  const LANDSCAPE = useState(true)


  const jump = () => {
    if (!isPaused && isGameRunning) {
      playerVelocity.current = -JUMP_HEIGHT;

      // Randomly place an extra life on jump
      if (Math.random() < LIFE_APPEARANCE_RATE && !lifePosition) {
        setLifePosition(Math.random() * (height - 200) + 100);
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
  
    playerPosition.setValue(height / 2);
    obstaclePosition.setValue(width);
    setIsGameRunning(true);
  };

  

  useEffect(() => {

    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();

    const gameLoop = setInterval(() => {
      if (!isGameRunning) return;

       
      playerVelocity.current += GRAVITY;
      playerPosition.setValue(playerPosition._value + playerVelocity.current);

      if (playerPosition._value >= height - 100) {
        playerVelocity.current = 0;
        playerPosition.setValue(height - 100);
      }

      obstaclePosition.setValue(obstaclePosition._value - OBSTACLE_SPEED);

      if (obstaclePosition._value <= -50) {
        obstaclePosition.setValue(width);
        setScore(score + 1);
      }

      if (playerPosition._value >= height - 150 && obstaclePosition._value <= 50 && obstaclePosition._value >= 0) {
        if(lives > 1 ) {
          setLives( lives - 1 );
          obstaclePosition.setValue(width)
        } else {
          setIsGameRunning(false)
          alert('Game Over', 'You have no more lives left.', [{ text: 'OK', onPress: () => {} }]);
        }
      }
      if(lifePosition && Math.abs(playerPosition._value - lifePosition) < 50 ) {
        setLives(lives + 1);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [isGameRunning, score, lives, lifePosition ]);

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <Image source={jungleBackground} style={styles.background} />
        <Animated.Image source={playerImage} style={[styles.player, { top: playerPosition }]} />
        <Animated.Image source={obstacleImage} style={[styles.obstacle, { left: obstaclePosition }]} />
        {lifePosition && <Image source={lifeImage} style={[styles.life, { bottom: lifePosition, left: width / 2 }]} />}
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.lives}>Lives: {lives}</Text>
        {!isGameRunning && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOver}>Game Over</Text>
            <Button title="Restart" onPress={restartGame} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  player: {
    position: 'absolute',
    width: 70,
    height: 100,
    left: '10%',
  },
  obstacle: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: height - 50,
  },
  
  life: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: height - 50,
  },
  score: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    color: 'white',
  },
  lives: {
    position: 'absolute',
    top: 80,
    fontSize: 24,
    color: 'white',
  },
  gameOverContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  gameOver: {
    fontSize: 48,
    color: 'red',
  },
})
