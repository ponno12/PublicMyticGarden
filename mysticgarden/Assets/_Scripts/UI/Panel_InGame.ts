import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button, Image, Text, Slider } from 'UnityEngine.UI';
import UIMng from '../Manager/UIMng';
import GameManager from '../Manager/GameManager';
import { Define } from '../Define';
import ZepetoPlayersManager from '../../Zepeto Multiplay Component/ZepetoScript/Player/ZepetoPlayersManager';
import TowerGameMng from '../Manager/TowerGameMng';

export default class Panel_InGame extends ZepetoScriptBehaviour {

    public btn_swap: Button;
    public btn_forward: Button;
    public btn_back: Button;
    public txt_Score: Text;
    public slider_Hpbar: Slider;
    Awake() {
        UIMng.Instance.AddPanel<Panel_InGame>("Panel_InGame", this);

        this.SetActive(false);
    }

    Start() {
        this.btn_back.onClick.AddListener(() => {
            GameManager.Instance.ChangeGameState(Define.GameState.Towergame_End);
        })
        this.btn_forward.onClick.AddListener(() =>{
            this.ClickForward();
        })
        this.btn_swap.onClick.AddListener(()=>{
            this.clickSwap();
        })

    }

    SetActive(bool: bool) {
        this.gameObject.SetActive(bool);
    }

    ClickForward() {
        ZepetoPlayersManager.instance.myAnimator.SetTrigger("Jump");
        TowerGameMng.Instance.GameMoving(TowerGameMng.Instance.direction);

    }

    clickSwap() {
        if(TowerGameMng.Instance.direction == Define.Direction.left){
            TowerGameMng.Instance.direction = Define.Direction.right;
        }else{
            TowerGameMng.Instance.direction = Define.Direction.left;
        }
        
        ZepetoPlayersManager.instance.myAnimator.SetTrigger("Jump");
        TowerGameMng.Instance.GameMoving(TowerGameMng.Instance.direction);

    }

    // hp값은 다른곳에서 관리하고 여기서는 그냥 전체값을 대입시키자.
    HPChange(value : number){
        this.slider_Hpbar.value = value;
    }

}