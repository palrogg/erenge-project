import { Scene3D } from '@enable3d/phaser-extension'
import { SoundManager } from "../soundManager"

export default class MainScene extends Scene3D {
  camerasArr
  cameraIndex
  canCameraMove
  keys
  player
  soundManager

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.requestThirdDimension()
    this.camerasArr = []
    this.cameraIndex = 0
    this.canCameraMove = true
    this.soundManager = new SoundManager("main")

    delete this.keys
    delete this.player
  }

  create() {
    this.accessThirdDimension()
    this.third.warpSpeed('camera', 'ground', 'grid', 'light', 'sky')
    this.third.camera.position.set(10, 10, 20)

    // this.third.physics.debug.enable()

    // add player
    // @ts-ignore
    this.player = this.third.new.group()
    this.player.position.setY(2)
    const body = this.third.add.box({ height: 0.8, y: 1, width: 0.4, depth: 0.4 }, { lambert: { color: 0xff0000 } })
    const head = this.third.add.sphere({ radius: 0.4, y: 2.0, z: 0.05 }, { lambert: { color: 0xff0000 } })
    this.player.add(body, head)
    this.third.add.existing(this.player)
    // @ts-ignore
    this.third.physics.add.existing(this.player, {
      width: 0.4,
      depth: 0.4,
      height: 1,
      offset: { y: -1.1 }
    })
    this.player.body.setAngularFactor(0, 0, 0)
    this.player.body.setFriction(0.8)
    
    // back camera: default
    const frontCam = this.third.new.object3D()
    frontCam.position.copy(this.third.new.vector3(0, 3, -5))
    this.player.add(frontCam)
    this.camerasArr.push(frontCam)

    // follow camera
    const followCam = this.third.new.object3D()
    // copies the position of the default camera
    followCam.position.copy(this.third.camera.position)
    this.player.add(followCam)
    this.camerasArr.push(followCam)

    // overhead camera
    const overheadCam = this.third.new.object3D()
    overheadCam.position.copy(this.third.new.vector3(0, 20, 0))
    // this.player.add(overheadCam) // uncomment this line if you want the overheadCam follow the player
    this.camerasArr.push(overheadCam)
    
    // adjust width and height
    this.third.renderer.setSize(1280, 720)
    // @ts-ignore
    this.third.camera.aspect = 1280 / 720
    this.third.camera.updateProjectionMatrix()

    this.third.warpSpeed()

    const redBox = this.third.physics.add.box({ name: 'redBox', y: 10, z: 2.5, width: 2, height: 2 }, { lambert: { color: 0xff0000 } })
    const blueBox = this.third.physics.add.box({ name: 'blueBox', x: 0.5, y: 15, z: 2.1, depth: 3 }, { lambert: { color: 0x0000ff } })
    const greenBox = this.third.physics.add.box({ name: 'greenBox', x: 1, y: 20, depth: 2, height: 2 }, { lambert: { color: 0x00ff00 } })

    this.third.physics.add.collider(redBox, greenBox, event => {
      console.log(`redBox and greenBox: ${event}`)
    })

    /*blueBox.body.on.collision((otherObject, event) => {
      if (otherObject.name === 'ground') console.log(`blueBox and ${otherObject.name}: ${event}`)
      //play a middle 'C' for the duration of an 8th note
      console.log('e')
      // synth.triggerAttackRelease("C4", "8n");
    })*/


    // add keys
    this.keys = {
      a: this.input.keyboard.addKey('a'),
      w: this.input.keyboard.addKey('w'),
      d: this.input.keyboard.addKey('d'),
      s: this.input.keyboard.addKey('s'),
      space: this.input.keyboard.addKey(32)
    }
    // this.third.haveSomeFun()
  }
  
  triggerSound(timeout){
    
  }
  
  update() {
    this.third.camera.position.lerp(this.camerasArr[this.cameraIndex % 3].getWorldPosition(this.third.new.vector3()), 0.05)
    const pos = this.player.position.clone()
    this.third.camera.lookAt(pos.x, pos.y + 3, pos.z)

    if (pos.y < -20) this.scene.restart()

    if (this.keys.space.isDown) {
      if (this.canCameraMove) {
        this.canCameraMove = false
        this.time.addEvent({
          delay: 250,
          callback: () => (this.canCameraMove = true)
        })
        this.cameraIndex++
      }
    }
    if (this.keys.w.isDown) {
      this.soundManager.synthOn();
      
      const speed = 4
      const rotation = this.player.getWorldDirection(this.player.rotation.toVector3())
      const theta = Math.atan2(rotation.x, rotation.z)

      const x = Math.sin(theta) * speed,
        y = this.player.body.velocity.y,
        z = Math.cos(theta) * speed

      this.player.body.setVelocity(x, y, z)
    }else{
      this.soundManager.synthOff()
    }

    if (this.keys.a.isDown){
      this.player.body.setAngularVelocityY(3)
      this.soundManager.synthOn("E1");
    }
    else if (this.keys.d.isDown) this.player.body.setAngularVelocityY(-3)
    else this.player.body.setAngularVelocityY(0)
    
  }
}
