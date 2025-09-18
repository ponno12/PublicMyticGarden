import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Define } from '../Define';
import { GameObject, GUI, Quaternion, SerializeField, Time, Vector3, Rect } from 'UnityEngine';
import { ZepetoCharacter } from 'ZEPETO.Character.Controller';
import ZepetoPlayersManager from '../../Zepeto Multiplay Component/ZepetoScript/Player/ZepetoPlayersManager';
import { Utils } from '../Utils';
import GameManager from './GameManager';
import ScaffoldingMng from './ScaffoldingMng';
import UIMng from './UIMng';
import Panel_GameOver from '../UI/Panel_GameOver';
import Panel_InGame from '../UI/Panel_InGame';



export default class TowerGameMng extends ZepetoScriptBehaviour {

    private static instance: TowerGameMng;
    public static get Instance(): TowerGameMng {
        if (this.instance == null) {
            var _obj = new GameObject("TowerGameMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<TowerGameMng>();
        }

        return this.instance;
    }

    public direction: Define.Direction = Define.Direction.left;
    private myCharacter: ZepetoCharacter;

    // 플레이 경과시간
    private gameTime: number;
    public get GameTime(): number {
        return this.gameTime;
    }

    private panel_ingame: Panel_InGame; 
    private panel_gameover: Panel_GameOver;

    // 감소 가중치
    public hpGravity: number = 30;
    // HP바 갱신 주기
    public hpChangeInterval: number = 0;
    // 게임 HP
    public playerHp: number = 0;

    // 진행한 타일수
    public tilecount: number = 0;
    public get TileCount(): number {
        return this.tilecount;
    }
    public set TileCount(count: number) {
        this.tilecount = count;
    }

    public characterWidth: number = 0;
    public gameState: Define.T_GameState = Define.T_GameState.None;

    Awake() {
        TowerGameMng.instance = this;
    }

    Init() {

        this.panel_ingame = UIMng.Instance.GetPanel<Panel_InGame>("Panel_InGame");
        this.panel_gameover = UIMng.Instance.GetPanel<Panel_GameOver>("Panel_GameOver");
        this.playerHp = 50;
        this.tilecount = 0;
        this.direction = Define.Direction.left;
        this.myCharacter = ZepetoPlayersManager.instance.myCharacter;
        this.characterWidth = ScaffoldingMng.Instance.startWidth;
        this.ChangeState(Define.T_GameState.None);
        ScaffoldingMng.Instance.FirstCreateTile();


    }

    GameMoving(dir: Define.Direction) {

        if(this.gameState != Define.T_GameState.Play){
            this.ChangeState(Define.T_GameState.Play);
        }
        if (dir == Define.Direction.left) {
            this.myCharacter.transform.position += Utils.Direction.left;
            this.myCharacter.Context.transform.rotation = Quaternion.Euler(Utils.Direction.leftRotation);
            this.characterWidth--;
        } else {
            this.myCharacter.transform.position += Utils.Direction.right;
            this.myCharacter.Context.transform.rotation = Quaternion.Euler(Utils.Direction.RighttRotation);

            this.characterWidth++;
        }
        this.tilecount++;
        
        this.HPChange(12.5);
        this.CheckTile();
        ScaffoldingMng.Instance.CheckCreateTile();
    }

    CheckTile() {
        let Tile = ScaffoldingMng.Instance.TileCtrList;
        this.panel_ingame.txt_Score.text = this.tilecount.toString();
        if (Tile[0].width != this.characterWidth) {
            console.log(`잘못 밟아서 사망`);
            this.ChangeState(Define.T_GameState.GameOver);
        }
    }


    ChangeState(state: Define.T_GameState) {
        //let panel_ingame = UIMng.Instance.GetPanel<Panel_InGame>("Panel_InGame");
        //let panel_gameover = UIMng.Instance.GetPanel<Panel_GameOver>("Panel_GameOver");
        this.gameState = state;
        switch (state) {
            case Define.T_GameState.None:
                this.tilecount = 0;
                this.myCharacter.Context.transform.localRotation = Quaternion.Euler(Utils.Direction.leftRotation);
                ScaffoldingMng.Instance.Init();
                this.panel_ingame.txt_Score.text = this.tilecount.toString();
                this.panel_ingame.SetActive(true);
                break;
            case Define.T_GameState.Play:

                break;
            case Define.T_GameState.Pause:
                
                break;
            case Define.T_GameState.GameOver:
                this.panel_ingame.SetActive(false);
                this.panel_gameover.SetActive(true);
                break;
            case Define.T_GameState.GameEnd:
                this.myCharacter.Context.transform.rotation = Quaternion.Euler(Vector3.zero);
                this.panel_gameover.SetActive(false);
                GameManager.Instance.ChangeGameState(Define.GameState.Towergame_End);
                break;

            default:
                break;
        }
    }

    UpdateState() {
        console.log(`T_gamestate : ${this.gameState}`);
        switch (this.gameState) {
            case Define.T_GameState.None:
                
                break;
            case Define.T_GameState.Play:
                // 여기서 게이지 닳게 하는값 설정해야함.

                // 플레이 시간 누적
                this.gameTime += Time.deltaTime;
                this.HPChange(- Time.deltaTime * this.hpGravity)
                // 여기에 가중치 추가해줘야함
                this.hpChangeInterval += Time.deltaTime;

                if (this.hpChangeInterval > 0.1) {
                    //this.HPChange
                    this.hpChangeInterval = 0;
                    if(this.playerHp <= 0.5){
                        console.log(`HP 부족을 사망`);
                        this.ChangeState(Define.T_GameState.GameOver);
                    }
                }

                break;
            case Define.T_GameState.Pause:

                break;
            case Define.T_GameState.GameOver:
                
                break;
            case Define.T_GameState.GameEnd:
                break;

            default:
                break;
        }
    }
    // 증감값
    HPChange(value : number){
        this.panel_ingame.HPChange(this.playerHp);

        this.playerHp += value;
        if(this.playerHp >= 100){
        this.playerHp = 100;

        }else if(this.playerHp <= 0.5){
            this.playerHp = 0;
        }
    }


    OnGUI(){
        if (GUI.Button(new Rect(100 , 100, 150, 100), "체력감소없음"))
        {
            this.hpGravity = 0;
        }
    }

}