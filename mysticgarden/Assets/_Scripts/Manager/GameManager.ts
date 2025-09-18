import { Camera, Coroutine, GameObject, WaitForEndOfFrame, Vector3, Quaternion, Animator, AnimatorControllerParameter, RuntimeAnimatorController } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers, UIZepetoPlayerControl, ZepetoScreenTouchpad, ZepetoCharacter } from 'ZEPETO.Character.Controller';
import { Define } from '../Define';
import { SceneManager } from 'UnityEngine.SceneManagement';
import ResourcesMng from './ResourcesMng';
import UIMng from './UIMng';
import LeaderboardMng from './LeaderboardMng';
import ZepetoPlayersManager from '../../Zepeto Multiplay Component/ZepetoScript/Player/ZepetoPlayersManager';
import Panel_InGame from '../UI/Panel_InGame';
import TowerGameMng from './TowerGameMng';

export default class GameManager extends ZepetoScriptBehaviour {


    private static instance: GameManager;

    public static get Instance(): GameManager {
        if (this.instance == null) {
            var _obj = new GameObject("GameMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<GameManager>();
        }

        return this.instance;
    }

    public camera: Camera;
    private gameState: Define.GameState = Define.GameState.None;
    get GetGameState() { return this.gameState; }

    private gameSubState: Define.GameSubState = Define.GameSubState.None;

    private tempCoroutine: Coroutine;

    // 임시로 애니메이터들을 여기다가 선언
    public t_infiniteAnimator: RuntimeAnimatorController;
    public t_ZepetoAnimator: RuntimeAnimatorController;

    Awake() {
        GameManager.instance = this;

        this.gameState = Define.GameState.Init_Start;
        this.gameSubState = Define.GameSubState.None;
    }

    // Start() {
    //     ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
    //         ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.tag = "Player";
    //     })
    // }

    Update() {
        this.UpdateState();
    }

    UpdateState() {
        //console.log(`gaeState : ${this.gameState}`);
        switch (this.gameState) {
            case Define.GameState.None:
                break;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 시작. 
            case Define.GameState.Init_Start:
                this.ChangeGameState(Define.GameState.Init_Update);
                // 캐릭터 생성 대기. 
                this.ChangeSubGameState(Define.GameSubState.WaitCreatePlayer_Start);
                break;

            case Define.GameState.Init_Update:
                // 하위 스테이트 처리. 
                this.UpdateSubState();

                // 캐릭터 생성 체크. 
                if (this.gameSubState == Define.GameSubState.Complete) {
                    this.ChangeGameState(Define.GameState.Init_End);
                    this.ChangeSubGameState(Define.GameSubState.None);

                    // 컨트롤 UI 비활성화 시켜둔다.                     
                    //ZepetoPlayers.instance.controllerData.horizontalController.gameObject.SetActive(false);
                }
                break;

            case Define.GameState.Init_End:
                this.ChangeGameState(Define.GameState.Move_SceneLoading_Start);
                break;



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 로딩씬으로 이동 시작. 
            case Define.GameState.Move_SceneLoading_Start:
                this.tempCoroutine = this.StartCoroutine(this.LoadScene(Define.SceneType.Loading));
                this.ChangeGameState(Define.GameState.Move_SceneLoading_Update);
                break;
            case Define.GameState.Move_SceneLoading_Update:
                break;
            case Define.GameState.Move_SceneLoading_End:
                this.StopCoroutine(this.tempCoroutine);
                this.ChangeGameState(Define.GameState.SceneLoading_Start);
                break;


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 로딩씬 진입 완료. 
            case Define.GameState.SceneLoading_Start:
                this.ChangeGameState(Define.GameState.SceneLoading_Update);
                //나중에 받아올것들
                break;
            case Define.GameState.SceneLoading_Update:
                this.UpdateSubState();
                this.ChangeGameState(Define.GameState.SceneLoading_End);

                // 캐릭터 정보 응답 체크. 
                if (this.gameSubState == Define.GameSubState.Complete) {
                    this.ChangeGameState(Define.GameState.SceneLoading_End);
                    this.ChangeSubGameState(Define.GameSubState.Complete);
                }
                break;
            case Define.GameState.SceneLoading_End:
                this.ChangeGameState(Define.GameState.Move_SceneWorld_Start);
                break;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 월드 이동. 
            case Define.GameState.Move_SceneWorld_Start:
                this.tempCoroutine = this.StartCoroutine(this.LoadScene(Define.SceneType.World));
                this.ChangeGameState(Define.GameState.Move_SceneWorld_Update);
                break;

            case Define.GameState.Move_SceneWorld_Update:
                break;

            case Define.GameState.Move_SceneWorld_End:
                this.ChangeGameState(Define.GameState.Game_Start);

                break;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 씬 로드 완료 후 처리 ( 다른 유저 생성 및 정보 요청.  )
            // case Define.GameState.Init_Start:
            //     break;
            // case Define.GameState.Init_Update:
            //     break;
            // case Define.GameState.Init_End:
            //     break;


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 게임 시작.
            case Define.GameState.Game_Start:

                // 컨트롤 UI 활성화.
                //ZepetoPlayers.instance.controllerData.horizontalController.gameObject.SetActive(true);

                ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                    ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.tag = "Player";
                    ZepetoPlayersManager.instance.myCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
                    ZepetoPlayersManager.instance.myAnimator = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.GetComponentInChildren<Animator>();
                    
                    UIMng.Instance.UIZepetoPlayerControl = ZepetoPlayers.instance.gameObject.GetComponentInChildren<UIZepetoPlayerControl>();
                    UIMng.Instance.zepetoScreenPad = ZepetoPlayers.instance.gameObject.GetComponentInChildren<ZepetoScreenTouchpad>();
                })
                UIMng.Instance.LoadingCanvas.SetActive(false);

                this.ChangeGameState(Define.GameState.Game_Update);

                break;
            case Define.GameState.Game_Update:

                break;
            case Define.GameState.Game_End:
                break;

            case Define.GameState.Towergame_Start:
                TowerGameMng.Instance.Init();
                this.TowerGameStart(true);
                
                
                this.camera.transform.parent = ZepetoPlayersManager.instance.myCharacter.transform;
                this.ChangeGameState(Define.GameState.Towergame_Update);

                
                break;
            case Define.GameState.Towergame_Update:
                TowerGameMng.Instance.UpdateState();
                break;
            case Define.GameState.Towergame_End:
                this.TowerGameStart(false);
                this.ChangeGameState(Define.GameState.Game_Update);
                break;
        }
    }

    UpdateSubState() {
        //console.log(`substate : ${this.gameSubState}`);
        switch (this.gameSubState) {
            // case Define.GameSubState.None:
            //     break;

            // // 캐릭터 생성 대기. 
            case Define.GameSubState.WaitCreatePlayer_Start:
                this.ChangeSubGameState(Define.GameSubState.WaitCreatePlayer_Update);
                break;
            case Define.GameSubState.WaitCreatePlayer_Update:
                this.ChangeSubGameState(Define.GameSubState.WaitCreatePlayer_End);

                break;
            case Define.GameSubState.WaitCreatePlayer_End:
                this.ChangeSubGameState(Define.GameSubState.Complete);
                break;

            // case Define.GameSubState.Communication_Update:
            //     break;
            // case Define.GameSubState.Communication_End:
            //     this.ChangeSubGameState(Define.GameSubState.Leaderboard_Start);
            //     break;

            // // 리더보드 정보 요청
            // case Define.GameSubState.Leaderboard_Start:
            //     LeaderboardMng.Instance.GetInitRank();
            //     this.ChangeSubGameState(Define.GameSubState.Leaderboard_Update);
            //     break;
            // case Define.GameSubState.Leaderboard_Update:
            //     break;
            // case Define.GameSubState.Leaderboard_End:
            //     this.ChangeSubGameState(Define.GameSubState.Complete);
            //     break;

            // 스태이터스 정보 요청. 
            case Define.GameSubState.Complete:
                break;
        }
    }

    private * LoadScene(sceneType: Define.SceneType, worldTID: number = -1) {

        //console.log("load Scene : " + sceneType.toString(), " : " + worldTID.toString());
        let sceneName: string;
        switch (sceneType) {
            case Define.SceneType.Init:
                sceneName = "Init";
                break;

            case Define.SceneType.Loading:
                sceneName = "Loading";
                break;

            case Define.SceneType.World:
                sceneName = "GameScene";
                break;
        }

        let asyncLoad = SceneManager.LoadSceneAsync(sceneName);
        while (!asyncLoad.isDone) {
            yield new WaitForEndOfFrame;
            console.log("Scene Loading...");
        }

        switch (sceneType) {
            case Define.SceneType.Loading:
                this.ChangeGameState(Define.GameState.Move_SceneLoading_End);
                break;
            case Define.SceneType.World:
                this.ChangeGameState(Define.GameState.Move_SceneWorld_End);
                break;
        }
    }

    ChangeGameState(state: Define.GameState) {
        this.gameState = state;
    }
    ChangeSubGameState(state: Define.GameSubState) {
        this.gameSubState = state;
    }

    TowerGameStart(isStart: bool) {
        // 제페토 카메라, 터치패드 비활성화
        ZepetoPlayers.instance.controllerData.verticalController.gameObject.SetActive(!isStart);
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(!isStart);
        UIMng.Instance.UIZepetoPlayerControl.gameObject.SetActive(!isStart);
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.enabled = !isStart;

        // let panel = UIMng.Instance.GetPanel<Panel_InGame>("Panel_InGame");
        // panel.SetActive(isStart);
        if (isStart == true) {
            ZepetoPlayersManager.instance.myCharacter.transform.position = new Vector3(-71, 0, 0);
            ZepetoPlayersManager.instance.myCharacter.transform.rotation = Quaternion.identity;
            // 리소스 매니저에서 할당해야하나? 컨트롤러 할당 필요 + 움직임 + 발판생성만하면 될듯
            //ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator  
            ZepetoPlayersManager.instance.myAnimator.runtimeAnimatorController = this.t_infiniteAnimator;

        } else {
            ZepetoPlayersManager.instance.myCharacter.transform.position = new Vector3(0, 0, 0);
            ZepetoPlayersManager.instance.myCharacter.transform.rotation = Quaternion.identity;
            ZepetoPlayersManager.instance.myAnimator.runtimeAnimatorController = this.t_ZepetoAnimator;

        }
        ZepetoPlayersManager.instance.myCharacter.characterController.enabled = !isStart;
    }

}