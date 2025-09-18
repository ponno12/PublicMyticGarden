import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Text } from 'UnityEngine.UI';
import { Rank } from 'ZEPETO.Script.Leaderboard';
import { Utils } from '../../Utils';


export default class RankingCtr extends ZepetoScriptBehaviour {

    public text_Rank: Text;
    public text_Name: Text;
    public text_Score: Text;

    SetRank(rank: Rank) {
        this.text_Rank.text = Utils.FormatNumber(rank.rank);
        this.text_Name.text = rank.name;
        this.text_Score.text = Utils.FormatNumber(rank.score);
    }

    SetRankMulty(rank: number, name: string, score: number) {
        this.text_Rank.text = Utils.FormatNumber(rank);
        this.text_Name.text = name;
        this.text_Score.text = Utils.FormatNumber(score);
    }

}