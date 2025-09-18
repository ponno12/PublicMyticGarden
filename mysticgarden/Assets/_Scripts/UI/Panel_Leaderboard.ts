import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject } from 'UnityEngine';
import { Leaderboard, Rank } from 'ZEPETO.Script.Leaderboard';
import RankingCtr from './Controller/RankingCtr';
import LeaderboardMng from '../Manager/LeaderboardMng';
import { Utils } from '../Utils';



export default class Panel_Leaderboard extends ZepetoScriptBehaviour {

    public rankingBaseList: GameObject[];
    private rankingCtrList: Array<RankingCtr>;

    Start() {
        this.Init();

    }
    Init() {
        this.rankingCtrList = new Array<RankingCtr>();
        for (let i = 0; i < this.rankingBaseList.length; ++i) {
            this.rankingCtrList.push(this.rankingBaseList[i].GetComponent<RankingCtr>());
        }

        if (LeaderboardMng.Instance.panel_leaderboard == null) {
            LeaderboardMng.Instance.panel_leaderboard = this;
        }
        this.SetRankingBoard();
    }
    public SetRankingBoard() {

        let rankingList = LeaderboardMng.Instance.WorldRankUser;

        if (rankingList == null){
            //Utils.Log(Define.LogType.Log, "[Panel_Leaderboard] null");
            return;
        }
        for (let i = 0; i < this.rankingCtrList.length; ++i) {
            if(this.rankingCtrList[i] == null)
                continue;
            if(i < rankingList.length){
                this.rankingCtrList[i].gameObject.SetActive(true);

                this.rankingCtrList[i].SetRank(rankingList[i]);
            }
            else{
                this.rankingCtrList[i].gameObject.SetActive(false);
            }
        }
        
    }

}