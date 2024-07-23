import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';

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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obstacle) => {
          Animated.timing(obstacle.x, {
            toValue: -250,
            duration: 900,
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
          toValue: -400,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(playerY, {
          toValue: 0,
          duration: 1000,
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
  if(obstacles === 1 ) {alert('level 1 won')}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  jumpButton: {
    position: 'absolute',
    bottom: 50,
    width: 100,
    height: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jumpButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  score: {
    position: 'absolute',
    top: 50,
    fontSize: 20,
  },
  lives: {
    position: 'absolute',
    top: 80,
    fontSize: 20,
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 30,
    color: 'red',
  },
  restartButton: {
    marginTop: 20,
    width: 100,
    height: 50,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default App;
