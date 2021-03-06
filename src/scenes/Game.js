import Phaser from 'phaser'
import background from '../../assets/bg_layer1.png'
import platform from '../../assets/ground_grass.png'
import bunny_stand from '../../assets/bunny1_stand.png'
import bunny_jump from '../../assets/bunny1_jump.png'
import phaseJump from '../../assets/phaseJump1.ogg'
import phaserUp2 from '../../assets/powerUp2.ogg'
import pepsound2 from '../../assets/pepSound2.ogg'

import carrot from '../../assets/carrot.png'
import Carrot from '../game/Carrot'

export default class Game extends Phaser.Scene {

    constructor() {
        super('game')
        this.carrotsCollected = 0
        this.carrotsCollectedText = null
    }

    preload() {
        this.load.image('background', background)
        this.load.image('platform', platform)
        this.load.image('bunny-stand', bunny_stand)
        this.load.image('carrot', carrot)
        this.load.image('bunny-jump', bunny_jump)
        this.load.audio('jump', phaseJump)
        this.load.audio('start', phaserUp2)
        this.load.audio('tone', pepsound2)
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)

        this.platforms = this.physics.add.staticGroup()
        this.carrots = this.physics.add.group({classType: Carrot})

        for(let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(80, 400)
            const y =  150 * i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            const body = platform.body
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
        this.physics.add.collider(this.platforms, this.player)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)


        this.physics.add.collider(this.platforms, this.carrots)

        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)
        const style = {color: '#000', fontSize: 24}
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0)
        this.sound.play('start')
    }

    update(t, dt) {
        this.platforms.children.iterate(child => {
            const platform = child
            const scrollY = this.cameras.main.scrollY

            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
                this.addCarrotAbove(platform)
            }
        })

        const touchingDown = this.player.body.touching.down
        if(touchingDown) {
            this.player.setVelocityY(-300)
            this.player.setTexture('bunny-jump')
            this.sound.play('jump')
        }

        const vy = this.player.body.velocity.y
        if (vy > -40 && this.player.texture.key !== 'bunny-stand') {
            this.player.setTexture('bunny-stand')
        }

        if(this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        } else {
            this.player.setVelocityX(0)
        }
        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 200) {
            this.scene.start('game-over')
        }
    }

    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight
        const carrot = this.carrots.get(sprite.x, y, 'carrot')
        carrot.setActive(true)
        carrot.setVisible(true)
        this.add.existing(carrot)
        carrot.body.setSize(carrot.width, carrot.height)
        this.physics.world.enable(carrot)
        return carrot
    }

    handleCollectCarrot(player, carrot) {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
        this.carrotsCollected++
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value
        this.sound.play('tone')
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]
        for(let i = 0; i < platforms.length; ++i) {
            const platform = platforms[i]
            if (platform.y < bottomPlatform.y) {
                continue
            }
            bottomPlatform = platform
        }
        return bottomPlatform
    }
}