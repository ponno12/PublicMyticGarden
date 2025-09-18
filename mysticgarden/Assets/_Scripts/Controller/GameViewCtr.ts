import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Camera } from 'UnityEngine';
import GameManager from '../Manager/GameManager';

export default class GameViewCtr extends ZepetoScriptBehaviour {

    public gameViewCamera : Camera;

    Awake(){
        GameManager.Instance.camera = this.gameViewCamera;
        console.log(`카메라 세팅 완료`);
    }
    Start() {    
        GameManager.Instance.camera = this.gameViewCamera;
        console.log(`카메라 세팅 완료`);
    }

}