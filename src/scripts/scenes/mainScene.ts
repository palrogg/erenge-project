import { Scene3D } from '@enable3d/phaser-extension'
import { SoundManager } from "../soundManager"
import { EventManager } from "../eventManager"
import { Path } from "../generators/path"
import { PathPath } from "../generators/pathPath"
import { Maze } from "../generators/maze"
import { THREE } from '@enable3d/phaser-extension'

export default class MainScene extends Scene3D {
  camerasArr
  cameraIndex
  canCameraMove
  keys
  player
  soundManager
  eventManager
  eventEmitter
  eventDispatch

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.requestThirdDimension()
    this.camerasArr = []
    this.cameraIndex = 0
    this.canCameraMove = true
    this.soundManager = new SoundManager("main")
    this.eventEmitter = this.events
    this.eventManager = new EventManager("main", this.eventEmitter)
    
    delete this.keys
    delete this.player
  }
  
  userInput(argument){
    console.log(argument)
  }
  
  create() {
    // const scene = new THREE.scene()
    // scene.background = new THREE.Color(0xf0f0f0)
    
    this.accessThirdDimension()
    this.third.warpSpeed('camera', 'ground', 'grid', 'light', 'sky')
    this.third.camera.position.set(10, 10, 20)
    
    
    this.eventEmitter.on('input', this.userInput)
    
    // Add maze -- test, not optimzed
    const maze = new Maze()
    let mazeGroup = this.third.new.group()
    
    /*
    const body = this.third.add.box({ height: 0.8, y: 1, width: 0.4, depth: 0.4 }, { lambert: { color: 0xff0000 } })
    const head = this.third.add.sphere({ radius: 0.4, y: 2.0, z: 0.05 }, { lambert: { color: 0xff0000 } })
    this.player.add(body, head)
    this.third.add.existing(this.player)

    
    */
    
    const cellSize = 4
    const cellHeight = 10
    const wallThickness = 0.1
    console.log(maze)
    
    let theScene = this;
    maze.cells.forEach(function(row){
      row.forEach(function(cell){
        console.log(cell)
        
        let floor = theScene.third.physics.add.box({ x: cell.x * cellSize, y: 0, z: cell.y * cellSize, width: cellSize*.95, height: 0.1, depth: cellSize*.95 }, { lambert: { color: 0x0000ff } })
        floor.body.setCollisionFlags(2)
        mazeGroup.add(floor)
        
        if(cell.left){
          let wallEdge = (cell.y * cellSize) + (cellSize/2) - wallThickness
          let wallCenter = (cell.x * cellSize)
          
          let wall = theScene.third.physics.add.box({ x: wallCenter, y: 0.2, z: wallEdge, width: cellSize, height: cellHeight, depth: 0.1 }, { lambert: { color: 0x00ff00, transparent: true, opacity: 0.5  } })
          wall.body.setCollisionFlags(2)
          mazeGroup.add(wall)
        }
        if(cell.top){
          let wallEdge = (cell.x * cellSize) + (cellSize/2) - wallThickness
          let wallCenter = (cell.y * cellSize)
          
          
          let wall = theScene.third.physics.add.box({ x: wallEdge, y: 0.2, z: wallCenter, width: 0.1, height: cellHeight, depth: cellSize }, { lambert: { color: 0x00fff0, transparent: true, opacity: 0.5  } })
          wall.body.setCollisionFlags(2)
          mazeGroup.add(wall)
        }
        
        
        // let floor = this.third.make.box({ x: cellSize, y: 0.2, z: cellSize })
        // floor.position.set(cell.x, 0.2, cell.y)
        
        // let wall = Scene3D.third.make.box({ x: 0.75, y: 1.75, z: -0.25 })
        // wall.position.set(cell.x, cell.y, 0)
        
      })
    })
    this.third.add.existing(mazeGroup)

    
    // this.third.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1))
    // this.third.physics.debug.enable()

    // i like this one https://threejs.org/examples/#webgl_buffergeometry
      
    let triangles = 16000;

		let geometry = new THREE.BufferGeometry();

		let positions = [] as  any
		let normals = [] as any
		let colors = [] as any

		let color = new THREE.Color();

		let n = 800, n2 = n / 2;	// triangles spread in the cube
		let d = 6, d2 = d / 2;	// individual triangle size

		let pA = new THREE.Vector3();
		let pB = new THREE.Vector3();
		let pC = new THREE.Vector3();

		let cb = new THREE.Vector3();
		let ab = new THREE.Vector3();

		for ( let i = 0; i < triangles; i ++ ) {

			// positions

			let x = Math.random() * n - n2;
			let y = Math.random() * n - n2;
			let z = Math.random() * n - n2;

			let ax = x + Math.random() * d - d2;
			let ay = y + Math.random() * d - d2;
			let az = z + Math.random() * d - d2;

			let bx = x + Math.random() * d - d2;
			let by = y + Math.random() * d - d2;
			let bz = z + Math.random() * d - d2;

			let cx = x + Math.random() * d - d2;
			let cy = y + Math.random() * d - d2;
			let cz = z + Math.random() * d - d2;

			positions.push( ax, ay, az );
			positions.push( bx, by, bz );
			positions.push( cx, cy, cz );

			// flat face normals

			pA.set( ax, ay, az );
			pB.set( bx, by, bz );
			pC.set( cx, cy, cz );

			cb.subVectors( pC, pB );
			ab.subVectors( pA, pB );
			cb.cross( ab );

			cb.normalize();

			let nx = cb.x;
			let ny = cb.y;
			let nz = cb.z;

			normals.push( nx, ny, nz );
			normals.push( nx, ny, nz );
			normals.push( nx, ny, nz );

			// colors

			let vx = ( x / n ) + 0.5;
			let vy = ( y / n ) + 0.5;
			let vz = ( z / n ) + 0.5;

			color.setRGB( vx, vy, vz );

			colors.push( color.r, color.g, color.b );
			colors.push( color.r, color.g, color.b );
			colors.push( color.r, color.g, color.b );

		}

		function disposeArray() {

			// this.array = null;

		}

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
		geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
		geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( disposeArray ) );

		geometry.computeBoundingSphere();

		let material = new THREE.MeshPhongMaterial( {
			color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
			side: THREE.DoubleSide
		} );

		let mesh = new THREE.Mesh( geometry, material );
    this.third.add.existing( mesh )
    
    // end test
    
    /*let pathx = new Path(5);
    pathx.position.set(-2, 0, 2)
    this.third.add.existing(pathx)
    //path.shape = 'box'
    // this.third.physics.add.existing(pathx)
    
    let path2 = new PathPath(20);
    path2.path.position.set(10, 0, 2)
    this.third.add.existing(path2.path)
    this.third.physics.add.existing(path2.path)
    path2.path.body.setCollisionFlags(2)*/
    /*
    cube.position.set(0, 5, 0)

          // We set shape manually to 'box' that enable3d is aware of the shape
          cube.shape = 'box'

          // Add cube to the scene
          this.third.add.existing(cube)

          // Add physics to the cube
          this.third.physics.add.existing(cube)
    */
    
    // path.body.setCollisionFlags(2)

    // this.box = Scene3D.third.make.box({ x: 0.75, y: 1.75, z: -0.25 })
    // this.box.position.set(0, 0, 0)

    
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

    /*const redBox = this.third.physics.add.box({ name: 'redBox', y: 10, z: 2.5, width: 2, height: 2 }, { lambert: { color: 0xff0000 } })
    const blueBox = this.third.physics.add.box({ name: 'blueBox', x: 0.5, y: 15, z: 2.1, depth: 3 }, { lambert: { color: 0x0000ff } })
    const greenBox = this.third.physics.add.box({ name: 'greenBox', x: 1, y: 20, depth: 2, height: 2 }, { lambert: { color: 0x00ff00 } })

    this.third.physics.add.collider(redBox, greenBox, event => {
      console.log(`redBox and greenBox: ${event}`)
    })*/

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
    this.eventManager.addKeys(this.keys);
  }
  
  triggerSound(timeout){
    
  }
  
  move(speed, direction){
    const rotation = this.player.getWorldDirection(this.player.rotation.toVector3())
    const theta = Math.atan2(rotation.x, rotation.z)
    
    const x = Math.sin(theta) * speed,
      y = this.player.body.velocity.y,
      z = Math.cos(theta) * speed

    this.player.body.setVelocity(x, y, z)
    
  }
  
  rotate(speed, direction){
    
  }
  
  update() {
    this.third.camera.position.lerp(this.camerasArr[this.cameraIndex % 3].getWorldPosition(this.third.new.vector3()), 0.05)
    const pos = this.player.position.clone()
    this.third.camera.lookAt(pos.x, pos.y + 3, pos.z)

    if (pos.y < -20) this.scene.restart()
    
    this.eventManager.getKeyEvents();
    
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
      this.soundManager.synthOn()
      this.move(4, 'forward')
      
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
