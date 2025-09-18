import { GameObject, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WorldController extends ZepetoScriptBehaviour {


    public IsInitComplete: boolean = false;


    Awake() {
        this.Init();
    }

    // 하위 zoneController 찾는다.
    Init() {
        
    }


}