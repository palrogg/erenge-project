//import * as GenerateMaze from 'generate-maze' <- doenst work with function export
import GenerateMaze  = require("generate-maze")

export class Maze {
  cells
  
  constructor(){
    // 2d phaser example https://supernapie.com/blog/procedural-generated-maze-in-phaser-3/
    // doc https://www.npmjs.com/package/generate-maze
    
    // Width == 8, height == 4, false = maze edges are open
    this.cells = GenerateMaze(10, 4, true)
  }
  
  add(){
    
  }
  
  getVertices(){
    
  }
  
  


}