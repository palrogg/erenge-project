import { Synth, AMSynth } from "tone";

export class SoundManager {
  name: string
  mainSynth
  amSynth
  amSynthPlaying
  
  constructor(name: string){
    this.name = name
    this.mainSynth = new Synth().toMaster()
    this.amSynth = new AMSynth().toMaster()
    this.amSynthPlaying = false;
  }
  
  
  
  play(){
    this.mainSynth.triggerAttackRelease("C4", "8n");
  }
  
  synthOn(note="C2"){
    if(!this.amSynthPlaying){
      this.amSynth.triggerAttack(note)
      this.amSynthPlaying = true
    }
  }
  
  synthOff(){
    if(this.amSynthPlaying){
      this.amSynth.triggerRelease()
      this.amSynthPlaying = false
    }
  }


}