import Phaser from "phaser";
import Game from './scenes/Game.js'
import GameOver from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 480,
  height: 640,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
