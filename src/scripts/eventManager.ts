
export class EventManager {
  keys
  sceneReceiver
  
  constructor(name: string, sceneReceiver){
    this.sceneReceiver = sceneReceiver
  }
  
  addKeys(_keys){
    console.log('got keys')
    this.keys = _keys
  }
  
  getKeyEvents(){
    let events = {}
    
    if (this.keys.space.isDown) {
      this.sceneReceiver.emit('input', 'space t')
      
    }
    
    if (this.keys.w.isDown) {
      events['forward'] = true
    }
    return events
  }
  

}