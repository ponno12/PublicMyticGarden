import { GameObject, Transform, Sprite, TextAsset, Vector3, Quaternion, LayerMask, AnimationCurve } from 'UnityEngine';
import { SpriteAtlas } from 'UnityEngine.U2D';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Utils } from '../Utils';
import { Image } from 'UnityEngine.UI';
import WorldController from '../Controller/WorldController';
import { Define } from '../Define';

// 런타임 메모리 관련 이슈
// 최소사양 갤S6 
// Resources.Load 사용 해야 될 수도 있다. 
export default class ResourcesMng extends ZepetoScriptBehaviour {

    private static instance: ResourcesMng;
    public static get Instance(): ResourcesMng {
        if (this.instance == null) {
            var _obj = new GameObject("ResourcesMng");
            GameObject.DontDestroyOnLoad(_obj);
            this.instance = _obj.AddComponent<ResourcesMng>();
        }

        return this.instance;
    }


    public obj: GameObject[] = [];

    // 맵 오리지날.
    public mapPrefab: GameObject[] = [];

    // 이펙트. *인스펙터 리스트 문제로 새로 만듬. 
    public effectsPrefab: GameObject[] = [];

    // UI리워드 아이콘 프리팹
    public uiPrefab: GameObject;

    // 아이콘 아틀라스.
    public iconAtlas: SpriteAtlas;

    public tilePrefab: GameObject[] =[];

    
    // pool 
    private ObjectPool: Map<string, Array<GameObject>> = new Map<string, Array<GameObject>>();


    // 테이블 데이터. 
    // public tableDatas: TextAsset[] = [];

    // private textAssetMap: Map<string, TextAsset>;

    // private constTable: Map<number, Table.const_table>;
    // get ConstTable(): Map<number, Table.const_table> { return this.constTable; }

    

    // // 클라전용.
    // private soundTable: Map<number, Table.sound_table>;
    // get GetsoundTable(): Map<number, Table.sound_table> { return this.soundTable; }

    Awake() {
        ResourcesMng.instance = this;
        //this.Init_TableData();
    }


    // 템플릿 데이터 초기화. 
    // 스타트 이전에 완료 해야됨. 
    // Init_TableData() {
    //     console.log("[ResourcesMng] Load Table Data");
    //     this.textAssetMap = new Map(this.tableDatas.map(obj => [obj.name, obj]))

    //     this.constTable = this.LoadTable<Table.const_table>("const_table", "num_const_tid");
    
    //     // 클라전용.
    //     this.soundTable = this.LoadTable<Table.sound_table>("sound_table", "num_sound_tid");

    //     //체크 로그.
    //     console.log(this.textTable.size + "------------------------------------------");
    //     //this.spawnCountTable.forEach((value, key, mapObject) => console.log(key +' , ' +value.arr_num_spawn_rate[0]));

    //     console.log("[ResourcesMng] Load Complete Table Data");
    // }

    // 클라이언트는 TextAsset 으로 로드. 
    // LoadTable<T>(name: string, key: string): Map<number, T> {
    //     let textAsset: TextAsset = this.textAssetMap.get(name);
    //     let data = JSON.parse(textAsset.text) as T[];
    //     return new Map(data.map(obj => [obj[key], obj]));
    // }


    CreateWorld(worldName: string): WorldController {

        if (this.mapPrefab == null) {
            console.error("[ResourcesMng] world Container == null");
            return;
        }

        // 생성할 월드가 있는지 확인.
        let obj = this.mapPrefab.find(x => x.name === worldName);
        if (obj == null) {
            console.error(`[ResourcesMng] Not found worldObject, name : ${worldName}`);
            return;
        }

        //let createMap = GameObject.Instantiate(obj, Vector3.zero, Quaternion.identity) as GameObject;
        let createMap = GameObject.Instantiate(obj) as GameObject;
        return createMap.GetComponent<WorldController>();
    }

    // PlayEffect(name: string, pos: Vector3) {

    //     let eff = this.TakeFromPool(Define.ObjectType.Effect, name);
    //     if (eff == null)
    //         return;

    //     let ctr = eff.GetComponent<EffecController>();

    //     if (ctr == null) {
    //         this.ReturnToPool(name, eff);
    //         return;
    //     }

    //     eff.transform.position = pos;
    //     ctr.Play(name);

    //     return ctr;
    // }

    // 스케일 조정은 보류 상태
    // PlayEffectType(name: string, pos: Vector3 ,shard : ShardController ) {

    //     let eff = this.TakeFromPool(Define.ObjectType.Effect, name);
    //     if (eff == null)
    //         return;
    //     let shardTid = shard.ShardTID

    //     let ctr = eff.GetComponent<EffecController>();

    //     if (ctr == null) {
    //         this.ReturnToPool(name, eff);
    //         return;
    //     }
    //     switch (shardTid) {
    //         case 6:
    //         case 7:
    //             eff.transform.localScale = new Vector3(3,3,3);
    //             break;
    //         case 10:
    //         case 11:
    //             eff.transform.localScale = new Vector3(2,2,2);
    //             break;

    //         default:
    //             break;
    //     }


    //     eff.transform.position = pos;
    //     ctr.Play(name);

    //     return ctr;
    // }

    
    // 가져오기.
    TakeFromPool(type: Define.ObjectType, name: string): GameObject {
        if (this.ObjectPool.has(name) == false) {
            this.CreatePoolItem(type, name);
        }

        // 쓸수 있는게 없을때. 
        if (this.ObjectPool.get(name).length <= 0) {
            this.CreatePoolItem(type, name);
        }

        // 한번더 체크. 
        if (this.ObjectPool.get(name) == null)
            return;

        var target = this.ObjectPool.get(name).pop() as GameObject;

        // 꺼내 왔는지 한번더 체크. 
        if (target == null)
            return;

        target.transform.SetParent(null);
        target.SetActive(true);

        return target;
    }

    // 반납하기.
    ReturnToPool(name: string, obj: GameObject, scale: Vector3 = Vector3.zero) {

        // 비활성화. 풀매니저 하위로 옴김. 
        obj.SetActive(false);
        obj.transform.SetParent(this.transform);
        obj.transform.position = Vector3.zero;

        if (scale != Vector3.zero) {
            obj.transform.localScale = scale;
        }
        // 스케일 조정이 필요하면 활성화
        //obj.transform.localScale = Vector3.one;

        // 풀 컨테이너가 없으면 생성. 
        if (this.ObjectPool.has(name) == false) {
            this.ObjectPool.set(name, new Array<GameObject>());
        }

        // 풀에 추가. 
        this.ObjectPool.get(name).push(obj);
    }

    // 아이템 생성. 
    CreatePoolItem(type: Define.ObjectType, name: string) {
        let obj: GameObject;
        switch (type) {
            case Define.ObjectType.Tile:
                obj = this.tilePrefab.find(x => x.name === name);
                break;

            // case Define.ObjectType.Sini:
            //     obj = this.siniPrefab.find(x => x.name === name);
            //     break;

            // case Define.ObjectType.Effect:
            //     obj = this.effectsPrefab.find(x => x.name === name);
            //     break;
            // case Define.ObjectType.Line:
            //     obj = this.linePrefab;
            //     break;
            // case Define.ObjectType.Reward:
            //     obj = this.uiPrefab;
            //     break;
                
        }

        if (obj == null) {
            console.error(`[ResourcesMng] Not found Origin name : ${name}`);
            return;
        }

        // 생성.
        var newObj = GameObject.Instantiate(obj);
        newObj.name = name;
        this.ReturnToPool(name, newObj as GameObject);
    }

    // 아이템 삭제.
    DestroyPoolItem(type: Define.ObjectType, obj: GameObject) {

    }

    GetIcon(name: string, type: Define.AtlasType = Define.AtlasType.main): Sprite {
        if (this.iconAtlas == null) {
            return null;
        }
        let sprite;
        switch (type) {
            case Define.AtlasType.main:
                sprite = this.iconAtlas.GetSprite(name);
                break;
            case Define.AtlasType.exclusive:
                //sprite = this.exclusiveAtlas.GetSprite(name);
                break;
        }

        if (sprite == null) {
            return null;
        }
        return sprite;
    }
}