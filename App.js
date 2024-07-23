import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import  Video  from 'expo-av';

const App = () => {
  const [playerY, setPlayerY] = useState(new Animated.Value(0));
  const [obstacles, setObstacles] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        { id: Math.random().toString(), x: new Animated.Value(300) },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obstacle) => {
          Animated.timing(obstacle.x, {
            toValue: -150,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          return obstacle;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [obstacles]);

  const jump = () => {
    if (!gameOver) {
      Animated.sequence([
        Animated.timing(playerY, {
          toValue: -150,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(playerY, {
          toValue: 10,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const checkCollision = () => {
    obstacles.forEach((obstacle) => {
      if (obstacle.x._value < 50 && obstacle.x._value > 0 && playerY._value === 0) {
        setLives(() => lives - 1);
        if (lives - 1 <= 0) {
          setGameOver(true);
          setLives(0)
        }
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkCollision();
    }, 50);

    return () => clearInterval(interval);
  }, [obstacles, playerY]);

  const restartGame = () => {
    setLives(3);
    setScore(0);
    setObstacles([]);
    setGameOver(false);
  };

  return (
    <ImageBackground source={require('./assets/bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.lives}>Lives: {lives}</Text>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
              <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
               <Video
        source={require('./assets/bgv.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.backgroundVideo}
      />
            <Animated.View style={[styles.player, { transform: [{ translateY: playerY }] }]} />
            {obstacles.map((obstacle) => (
              <Animated.View key={obstacle.id} style={[styles.obstacle, { transform: [{ translateX: obstacle.x }] }]} />
            ))}
            <TouchableOpacity style={styles.jumpButton} onPress={jump}>
              <Text style={styles.jumpButtonText}>Jump</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 100,
  },
  obstacle: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 100,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 50,
  },
  lives: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 80,
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
  },
  restartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 24,
  },
  jumpButton: {
    position: 'absolute',
    bottom: 50,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  jumpButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default App;
