import Phaser from 'phaser'
import lowDown from '../../assets/lowDown.ogg'

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    preload() {
        this.load.audio('lowDown', lowDown)
    }

    create() {
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width * 0.5, height * 0.5, 'Game Over', {fontSize: 48}).setOrigin(0.5)
        this.add.text(width * 0.5, height * 0.6, '(Press space)', {fontSize: 32}).setOrigin(0.5)
        this.sound.play('lowDown')

        this.input.keyboard.once('keydown_SPACE', () => {
            this.scene.start('game')
        })
    }
}