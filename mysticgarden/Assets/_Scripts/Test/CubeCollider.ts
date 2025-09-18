import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Collider, GameObject } from 'UnityEngine';
import GameManager from '../Manager/GameManager';
import { Define } from '../Define';
import UIMng from '../Manager/UIMng';
import Panel_Choise from '../UI/Panel_Choise';

export default class CubeCollider extends ZepetoScriptBehaviour {

    OnTriggerEnter(coll: Collider) {
        if (coll.tag == "Player") {
            let panel = UIMng.Instance.GetPanel<Panel_Choise>("Panel_choise");
            panel.SetActive(true);
        }
    }

}