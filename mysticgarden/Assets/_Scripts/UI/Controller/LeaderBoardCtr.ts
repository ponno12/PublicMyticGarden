import { Mathf, Sprite, Time, Vector3, Texture, Rect, Texture2D, Vector2 } from 'UnityEngine'
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderboardMng from '../../Manager/LeaderboardMng';

export enum RollingState {
    Stay,
    Move,
}

export default class LeaderBoardCtr extends ZepetoScriptBehaviour {

    public images: Sprite[];
    public imageItem: Image[];

    public rollingTime: number = 1;
    public stayTime: number = 1;

    public startPosX: number = 0;
    public imageWidth: number = 850;
    private endImageIndex: number = 0;

    private curState: RollingState;
    private tempTime: number = 0;
    private startPos: Array<Vector3>;
    private newPos: Vector3;

    Start() {
        this.Init();
    }

    Init() {

        //리더보드에 물리기
        if(LeaderboardMng.Instance.leaderboardCtr == null)
            LeaderboardMng.Instance.leaderboardCtr = this;
        //let tempuserid = PlayerMng.Instance.CurPlayerID;
        // let learboardImages = LeaderboardMng.Instance.UserSprite;
        // if (learboardImages == null)
        //     console.log("리더보드 이미지 null")
        // else {
        //     for (let i = 0; i < tempuserid.length; ++i) {

        //         this.images[i] = learboardImages[i];
        //     }
        // }


        if (this.startPos != null)
            this.startPos.splice(0);
        else
            this.startPos = new Array<Vector3>();

        // 초기 세팅.                 
        for (let i = 0; i < this.imageItem.length; ++i) {
            // 이미지 변경. 
            this.imageItem[i].sprite = this.images[i];

            // 위치. 
            let tempPos = new Vector3(0, 0, 0);
            tempPos.x = this.imageWidth * i;
            this.imageItem[i].transform.localPosition = tempPos;

            // 인덱스.
            this.endImageIndex = i;

            // 시작 위치값.
            this.startPos.push(tempPos);
        }

        this.tempTime = 0;
        this.curState = RollingState.Stay;
        this.newPos = Vector3.zero;


    }

    Update() {
        switch (this.curState) {
            case RollingState.Stay:

                this.tempTime += Time.deltaTime;
                if (this.tempTime >= this.stayTime) {
                    this.curState = RollingState.Move;
                    this.tempTime = 0;
                }

                break;
            case RollingState.Move:
                this.tempTime += Time.deltaTime;

                for (let i = 0; i < this.imageItem.length; ++i) {
                    this.newPos.x = Mathf.Lerp(this.startPos[i].x, this.startPos[i].x - this.imageWidth, this.tempTime / this.rollingTime);
                    this.imageItem[i].transform.localPosition = this.newPos;
                }

                if (this.tempTime >= this.rollingTime) {
                    this.curState = RollingState.Stay;

                    // 목표 위치 고정. 
                    for (let i = 0; i < this.imageItem.length; ++i) {
                        this.newPos.x = this.startPos[i].x - this.imageWidth;
                        this.imageItem[i].transform.localPosition = this.newPos;
                    }

                    // 위치 이동. 
                    let tempItem = this.imageItem[0];
                    this.imageItem.splice(0, 1);
                    this.imageItem.push(tempItem);

                    ++this.endImageIndex;
                    if (this.endImageIndex >= this.images.length)
                        this.endImageIndex = 0;

                    tempItem.sprite = this.images[this.endImageIndex];

                    this.tempTime = 0;
                }

                break;
        }
    }
    // Learboad에서 가져오기
    // public SetRollingImage() {
        
    //     //let tempuserid = PlayerMng.Instance.CurPlayerID;
    //     let learboardImages = LeaderboardMng.Instance.UserSprite;
    //     for (let i = 0; i < tempuserid.length; ++i) {
    //         this.images[i] = learboardImages[i];
    //     }
    // }
}