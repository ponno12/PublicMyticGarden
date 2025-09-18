import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from 'UnityEngine.UI';
import GameManager from '../Manager/GameManager';
import { GameObject } from 'UnityEngine';
import { UIZepetoPlayerControl, ZepetoPlayers, ZepetoScreenTouchpad, ZepetoCharacter, ZepetoPlayer } from 'ZEPETO.Character.Controller';
import UIMng from '../Manager/UIMng';
import { Define } from '../Define';
import ZepetoPlayersManager from '../../Zepeto Multiplay Component/ZepetoScript/Player/ZepetoPlayersManager';

export default class Panel_Choise extends ZepetoScriptBehaviour {

    public startButton: Button;
    public backButton: Button;

    Awake() {
        UIMng.Instance.AddPanel<Panel_Choise>("Panel_choise", this);

        this.SetActive(false);
    }
    Start() {
        this.startButton.onClick.AddListener(() => { this.GameScene(); });
        this.backButton.onClick.AddListener(() => { this.BackButton(); });
    }

    SetActive(bool: bool) {
        this.gameObject.SetActive(bool);
    }

    GameScene() {        
        this.SetActive(false);
        GameManager.Instance.ChangeGameState(Define.GameState.Towergame_Start);

    }
    BackButton() {
        this.SetActive(false);
        GameManager.Instance.ChangeGameState(Define.GameState.Towergame_End);
    }
}