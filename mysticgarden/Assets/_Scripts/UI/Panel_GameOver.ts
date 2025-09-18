import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from 'UnityEngine.UI';
import UIMng from '../Manager/UIMng';
import GameManager from '../Manager/GameManager';
import { Define } from '../Define';
import TowerGameMng from '../Manager/TowerGameMng';

export default class Panel_GameOver extends ZepetoScriptBehaviour {


    public btn_Home: Button;

    Awake() {
        UIMng.Instance.AddPanel<Panel_GameOver>("Panel_GameOver", this);

        this.SetActive(false);
    }
    Start() {    
        this.btn_Home.onClick.AddListener(() => {
            TowerGameMng.Instance.ChangeState(Define.T_GameState.GameEnd);

        })
    }

    SetActive(bool: bool) {
        this.gameObject.SetActive(bool);
    }

}