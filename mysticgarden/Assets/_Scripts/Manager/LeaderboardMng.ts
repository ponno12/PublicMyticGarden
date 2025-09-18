import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GUI, GameObject } from 'UnityEngine';
import { SetScoreResponse, LeaderboardAPI, GetAllLeaderboardsResponse, GetLeaderboardResponse, GetRangeRankResponse, ResetRule, Leaderboard, Rank } from 'ZEPETO.Script.Leaderboard';
import { ZepetoWorldHelper, Users } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2 } from 'UnityEngine';
import Panel_Leaderboard from '../UI/Panel_Leaderboard';
import LeaderBoardCtr from '../UI/Controller/LeaderBoardCtr';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Utils } from '../Utils';
import { Define } from '../Define';


export default class LeaderboardMng extends ZepetoScriptBehaviour {

    private static instance: LeaderboardMng;
    public static get Instance(): LeaderboardMng {
        if (this.instance == null) {
            var _obj = new GameObject("LeaderboardMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<LeaderboardMng>();
        }

        return this.instance;
    }
    

    public leaderboardId: string;
    private score: number;
    private myWorldScore: number = 0;

    public startRank: number;
    public endRank: number;
    public resetRule: ResetRule;

    private localRanking: Map<string, number> = new Map<string, number>();
    get LocalRanking(): Map<string, number> { return this.localRanking; }
    public localUserID: Set<string>;

    private worldRankUser: Rank[];
    get WorldRankUser() { return this.worldRankUser };
    set WorldRankUser(data: Rank[]) { this.worldRankUser = data; }

    public userSprite: Sprite[];
    get UserSprite() { return this.userSprite };

    public panel_leaderboard: Panel_Leaderboard;
    // 프로필 컨트롤
    public leaderboardCtr: LeaderBoardCtr;

    Awake() {
        LeaderboardMng.instance = this;

        this.localRanking = new Map<string, number>();
        this.localUserID = new Set<string>();
    }
    
    public SetScore() {
        //LeaderboardAPI.SetScore(this.leaderboardId, siniEquipatk, this.OnSetScoreInit, this.OnError);
    }

    public GetRank() {
        LeaderboardAPI.GetRangeRank(this.leaderboardId, this.startRank, this.endRank, this.resetRule, false,
            this.OnGetRankResult, this.OnError);
    }
    public GetInitRank() {
        this.SetScore();
        LeaderboardAPI.GetRangeRank(this.leaderboardId, this.startRank, this.endRank, this.resetRule, false,
            this.OnGetInitRankResult, this.onInitRankError);
    }

    OnSetScoreResult(result: SetScoreResponse) {
        LeaderboardMng.Instance.GetRank();
    }


    public GetAllLeaderBoard() {
        LeaderboardAPI.GetAllLeaderboards(this.OnGetAllResult, this.OnError);
    }

    public GetLeaderboard(leaderboardId: string) {
        LeaderboardAPI.GetLeaderboard(leaderboardId, this.OnGetResult, this.OnError);
    }
    //리더보드 안에 있는 정보가 아니라 리더 보드들 자체의 데이터를 가져옴
    OnGetAllResult(result: GetAllLeaderboardsResponse) {
        if (result.leaderboards) {
            for (let i = 0; i < result.leaderboards.length; ++i) {
                const leaderboard = result.leaderboards[i];
            }
        }
    }

    //리더보드에 대한 정보 리더보드를 여러개 안쓰면 쓸일 없음
    OnGetResult(result: GetLeaderboardResponse) {
        if (result.leaderboard) {
            console.log(`id: ${result.leaderboard.id}, name: ${result.leaderboard.name}`);
        }
    }

    OnError(error: string) {
        Utils.Log(Define.LogType.Log, `[LeaderboardMng] Leaderboard  ${error} `)
    }
    onInitRankError(error: string){
        Utils.Log(Define.LogType.Error, `[LeaderboardMng] WorldLeaderboard  ${error} `)
        //GameMng.Instance.ChangeSubGameState(Define.GameSubState.Leaderboard_End);
    }

    OnGetInitRankResult(result: GetRangeRankResponse) {

        LeaderboardMng.Instance.worldRankUser = new Array<Rank>();
        //전체 순위에서 나의 정보를 가져옴
        if (result.rankInfo.myRank != null) {
            this.myWorldScore = result.rankInfo.myRank.score;
        }

        if (result.rankInfo.rankList != null) {
            for (const rank of result.rankInfo.rankList) {
                LeaderboardMng.Instance.worldRankUser.push(rank);
            }

        }
        LeaderboardMng.Instance.GetRollingImage();

        //GameMng.Instance.ChangeSubGameState(Define.GameSubState.Leaderboard_End);
    }
    OnGetRankResult(result: GetRangeRankResponse) {
        LeaderboardMng.Instance.worldRankUser = new Array<Rank>();
        
        if (result.rankInfo.myRank != null) {
            this.myWorldScore = result.rankInfo.myRank.score;
        }
        //전체 순위에서 나의 정보를 가져옴
        if (result.rankInfo.rankList) {
            for (const rank of result.rankInfo.rankList) {
                LeaderboardMng.Instance.worldRankUser.push(rank);
            }
        }
        if (LeaderboardMng.Instance.panel_leaderboard != null) {
            LeaderboardMng.Instance.panel_leaderboard.SetRankingBoard();
        }
    }



    // 유저들의 프로필 정보 얻기 가운데 거울을 유저 이미지로 바꾸게 되면 사용
    public GetRollingImage() {
        
        for (let i = 0; i < this.worldRankUser.length; i++) {
            ZepetoWorldHelper.GetProfileTexture(this.WorldRankUser[i].member, (texture: Texture) => {
                this.userSprite[i] = this.GetSprite(texture);
            }, (error) => {
                console.log(error);
            });
            
        }
        //리더보드 추가할때 넣을 메소드
        //this.leaderboardCtr.SetRollingImage();
    }

    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }
}