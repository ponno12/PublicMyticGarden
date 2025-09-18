import { GameObject, Sprite } from 'UnityEngine';
import { UnityAction } from 'UnityEngine.Events';
import { UIZepetoPlayerControl, ZepetoScreenTouchpad } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'


// UI 각 창들은 스타트 시점에 UIMng 각자 등록한다.
// 모든 UI 창 gameobject 는 활성화 된 상태로 씬에 저장 되며 실행한다. 
export default class UIMng extends ZepetoScriptBehaviour {
    private static instance: UIMng;
    public static get Instance(): UIMng {
        if (this.instance == null) {
            var _obj = new GameObject("UIMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<UIMng>();
        }

        return this.instance;
    }
    Awake() {
        UIMng.instance = this;

    }
    public panelMap: Map<string, any> = new Map<string, any>();
    public loadingCanvas: GameObject;
    get LoadingCanvas(): GameObject { return this.loadingCanvas; }


    public UIZepetoPlayerControl: UIZepetoPlayerControl;
    public zepetoScreenPad: ZepetoScreenTouchpad;

    AddPanel<T>(name: string, panel: T) {
        if (this.panelMap.has(name) == true) {
            return;
        }
        this.panelMap.set(name, panel);
    }
    GetPanel<T>(name: string): T {
        return this.panelMap.get(name);
    }
}