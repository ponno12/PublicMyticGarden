import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Vector3, Random, Mathf } from 'UnityEngine';
import { Define } from '../Define';
import ResourcesMng from './ResourcesMng';
import Tilecontroller from '../Controller/Tilecontroller';
import TowerGameMng from './TowerGameMng';

export default class ScaffoldingMng extends ZepetoScriptBehaviour {

    private static instance: ScaffoldingMng;
    public static get Instance(): ScaffoldingMng {
        if (this.instance == null) {
            var _obj = new GameObject("ScaffoldingMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<ScaffoldingMng>();
        }

        return this.instance;
    }

    private currentIndex: number = 0;
    private currentWidth: number = 0;
    public startWidth: number = 15;

    private tileCtrList: Tilecontroller[] = [];
    public get TileCtrList() {
        return this.tileCtrList;
    }
    private releaseTileList: Tilecontroller[] = [];

    Awake() {
        ScaffoldingMng.instance = this;

    }

    // 타일 풀링

    // 초기값 세팅, 값 밀어주기
    Init() {
        this.currentIndex = 0;
        this.currentWidth = 0;


        //남아있는 타일이 있을경우 밀어주기 체크
        if (this.tileCtrList.length > 0) {
            for (let i = 0; i < this.tileCtrList.length; i++) {
                ResourcesMng.Instance.ReturnToPool(this.tileCtrList[i].gameObject.name, this.tileCtrList[i].gameObject);
            }
        }

        if (this.releaseTileList.length > 0) {
            for (let i = 0; i < this.releaseTileList.length; i++) {
                ResourcesMng.Instance.ReturnToPool(this.releaseTileList[i].gameObject.name, this.releaseTileList[i].gameObject);
            }
        }
        this.tileCtrList = [];
        this.releaseTileList = [];

    }
    FirstCreateTile() {
        this.currentWidth = this.startWidth;
        this.CreateTile(Define.Direction.left);
        for (let i = 0; i < 19; i++) {
            let rand = Random.Range(0, 2);
            console.log(`rand value = ${rand}`);
            if (rand <= 1) {
                this.CreateTile(Define.Direction.left);
            } else {
                this.CreateTile(Define.Direction.right);

            }
        }

    }
    CreateTile(dir: Define.Direction) {
        this.currentIndex++;
        let tile = ResourcesMng.Instance.TakeFromPool(Define.ObjectType.Tile, "Tile");
        let tileCtr = tile.GetComponent<Tilecontroller>();

        if (tile == null) {
            console.error(`tile Create null`);
        }


        tileCtr.index = this.currentIndex;

        switch (dir) {
            case Define.Direction.left:
                if (this.currentWidth <= 0) {
                    this.currentWidth++;
                    break;
                }
                this.currentWidth--;
                break;
            case Define.Direction.right:
                if (this.currentWidth > 29) {
                    this.currentWidth--;
                    break;
                }
                this.currentWidth++;
                break;

            default:
                break;
        }
        tileCtr.width = this.currentWidth;
        this.tileCtrList.push(tileCtr);
        tile.transform.localPosition = new Vector3(-80 + (this.currentWidth * 0.6), 0, this.currentIndex);

        console.log(`타일 생성 완료 current Index : ${this.currentIndex} currentWidht: ${this.currentWidth}`);
        return true;

    }


    // Update가 아니라 한칸오를때마다 확인하는 식으로 가는게 맞음.
    // Update() {
    //     if (this.currentIndex < TowerGameMng.Instance.TileCount + 15) {
    //         let rand = Random.Range(0, 2);
    //         console.log(`rand value = ${rand}`);
    //         if (rand <= 1) {
    //             this.CreateTile(Define.Direction.left);
    //         } else {
    //             this.CreateTile(Define.Direction.right);

    //         }
    //     }
    // }

    CheckCreateTile() {
        if (this.currentIndex <= TowerGameMng.Instance.TileCount + 15) {
            let rand = Random.Range(0, 2);
            if (rand <= 1) {
                let temp = Math.floor(Random.Range(1, 4));
                for (let i = 0; i < temp; i++) {
                    this.CreateTile(Define.Direction.left);
                }
                //this.CreateTile(Define.Direction.left);

            } else {
                //this.CreateTile(Define.Direction.right);
                let temp = Math.floor(Random.Range(1, 4));
                for (let i = 0; i < temp; i++) {
                    this.CreateTile(Define.Direction.right);
                }
            }
        }

        if (this.tileCtrList.length >= 15) {
            let release = this.tileCtrList.shift();

            this.releaseTileList.push(release);
        }

        if (this.releaseTileList.length >= 5) {
            let realase = this.releaseTileList.shift();
            console.log(`realeas tile info ${realase.width} , ${realase.index}`);
            ResourcesMng.Instance.ReturnToPool(realase.gameObject.name, realase.gameObject);
        }
    }



}