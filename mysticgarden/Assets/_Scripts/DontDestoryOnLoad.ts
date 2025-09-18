import { GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class DontDestoryOnLoad extends ZepetoScriptBehaviour {

    Awake() {
        GameObject.DontDestroyOnLoad(this.gameObject);
    }    
}