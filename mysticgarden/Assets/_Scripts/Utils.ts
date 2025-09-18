
import * as UnityEngine from "UnityEngine";
import { sVector3 } from "ZEPETO.Multiplay.Schema";
import { Define } from './Define';

export namespace Utils {

    // 컬러 타입 정의 
    export class ColorType {
        public static normal: UnityEngine.Color = new UnityEngine.Color(1, 1, 0.9803922, 1);
        public static rare: UnityEngine.Color = new UnityEngine.Color(0.4588235, 0.6745098, 0.4196078, 1);
        public static magic: UnityEngine.Color = new UnityEngine.Color(0.3529412, 0.372549, 0.8745098, 1);
        public static unique: UnityEngine.Color = new UnityEngine.Color(0.7960784, 0.4784314, 0.8039216, 1);
        public static legend: UnityEngine.Color = new UnityEngine.Color(0.9058824, 0.3490196, 0.3215686, 1);
        public static mythic: UnityEngine.Color = new UnityEngine.Color(1, 0.9647059, 0.4117647, 1);

        public static gold: UnityEngine.Color = new UnityEngine.Color(1, 0.8431373, 0, 1);
        public static silver: UnityEngine.Color = new UnityEngine.Color(0.7529412, 0.7529412, 0.7529412, 1);
        public static bronze: UnityEngine.Color = new UnityEngine.Color(0.84, 0.498, 0.196, 1);

        public static zpurple: UnityEngine.Color = new UnityEngine.Color(0.3607843, 0.2784314, 0.9921569, 1);

        public static alphaZero: UnityEngine.Color = new UnityEngine.Color(1, 1, 1, 0);

        public static ui_default: UnityEngine.Color = new UnityEngine.Color(1, 0.9921569, 0.909804, 1);
        public static ui_select: UnityEngine.Color = new UnityEngine.Color(0.764706, 0.3960785, 0.3960785, 1);
        public static ui_unselect: UnityEngine.Color = new UnityEngine.Color(1, 0.8, 0.8, 1);

        public static ui_text_active: UnityEngine.Color = new UnityEngine.Color(0.6392157, 0.282353, 0.2745098, 1);
        public static ui_text_inactive: UnityEngine.Color = new UnityEngine.Color(0.9176471, 0.6117647, 0.6117647, 1);

        // public static get Normal(): UnityEngine.Color { return this.normal; }
        // public static get Rare(): UnityEngine.Color { return this.rare; }
        // public static get Magic(): UnityEngine.Color { return this.magic; }
        // public static get Unique(): UnityEngine.Color { return this.unique; }
        // public static get Legend(): UnityEngine.Color { return this.legend; }
        // public static get Mythic(): UnityEngine.Color { return this.mythic; }
    }

    export class Direction{
        public static left: UnityEngine.Vector3 = new UnityEngine.Vector3(-0.6,0,1);
        public static right: UnityEngine.Vector3 = new UnityEngine.Vector3(0.6,0,1);

        public static leftRotation: UnityEngine.Vector3 = new UnityEngine.Vector3(0,-45.0)
        public static RighttRotation: UnityEngine.Vector3 = new UnityEngine.Vector3(0,45.0)

    }
    export function ParseVector3(vector3: sVector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
            (
                vector3.x,
                vector3.y,
                vector3.z
            );
    }

    // 그거...
    export function FormatString(origin: string, ...arg: string[]): string {

        if (origin == null || arg == null)
            return "";

        for (let index = 0; index < arg.length; index++) {
            origin = origin.replace(`{${index}}`, arg[index]);
        }
        return origin;
    }

    // 숫자 표현방식. 
    export function FormatNumber(value: number): string {

        let str: string = "";

        if (value < 1000) {
            // 걍
            str = Math.floor(value).toString();
        } else if (value < 1000000) {
            // 일천. K
            str = (Math.floor((value / 1000) * 10) / 10).toString() + "K";

        } else if (value < 1000000000) {
            // 백만. M
            str = (Math.floor((value / 1000000) * 10) / 10).toString() + "M";
        } else if (value <= 1000000000000) {
            // 십억. B
            str = (Math.floor((value / 1000000000) * 10) / 10).toString() + "B";
        }
        else {
            // 일조. T
            str = (Math.floor((value / 1000000000000) * 10) / 10).toString() + "T";
        }

        return str;
    }

    // 서브 그레이드 별 컬러. 
    export function SubGradeColor(subGrade: number): UnityEngine.Color {
        switch (subGrade) {
            case 1: return ColorType.normal;
            case 2: return ColorType.rare;
            case 3: return ColorType.magic;
            case 4: return ColorType.unique;
            case 5: return ColorType.legend;
            case 6: return ColorType.mythic;
            default: case 6: return ColorType.normal;
        }
    }

    // 3자리마다 콤마 찍어주는거, 
    export function NumberWithCommas(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    
    // export function LocalizationText(key: number): string {
    //     let table = ResourcesMng.Instance.GetTextTable;
    //     if (table == null) {
    //         return "ERROR";
    //     }

    //     let data = table.get(key);
    //     if (data == null) {
    //         return `E ${key}`;
    //     }

    //     let type = 10;
    //     if (PlayerMng.Instance.SettingData != null) {
    //         type = PlayerMng.Instance.SettingData.language;
    //     }
    //     switch (type) {
    //         case 10:
    //             return data.str_text_en;
    //         case 22:
    //             return data.str_text_ja;
    //         case 23:
    //             return data.str_text_kr;
    //         default:
    //             return data.str_text_kr;
    //     }
    // }

    // 영어, 일어, 한국어 3개 고정. 
    export function CheckLanguage(type: number): number {
        if (type == 999) {
            type = UnityEngine.Application.systemLanguage;
        }

        switch (type) {
            case 10:
            case 22:
            case 23:
                break;

            default:
                return 23;
        }
        return type;
    }

    export function ConvertDay(sec: number, isBlink: boolean = true): string {
        let result: string = "";
        if (sec >= 86400) {
            result = `${Math.floor(sec / 86400)}D`;
        } else {

            let hour = Math.floor(sec / 3600);
            let minute = Math.floor((sec % 3600) / 60);

            let isEven = Math.floor(sec % 2);

            if (hour >= 10)
                result = hour.toString();
            else
                result = "0" + hour.toString();

            // 깜빡임 제어. 
            if (isBlink == false)
                isEven = 0;

            if (minute >= 10) {
                if (isEven == 0)
                    result = result + ":" + minute.toString();
                else
                    result = result + " " + minute.toString();
            }
            else {
                if (isEven == 0)
                    result = result + ":0" + minute.toString();
                else
                    result = result + " 0" + minute.toString();
            }

        }

        return result;
    }

    export function Log(type: Define.LogType, msg: string, paramType?: string, paramValue?: string) {

        let param = "";
        if (paramType != null && paramValue != null) {
            param = `(${paramType} : ${paramValue})`;
        }

        switch (type) {
            case Define.LogType.Log:
                console.log(msg + param);
                break;
            case Define.LogType.Info:
                console.info(msg + param);
                break;
            case Define.LogType.Error:
                console.error(msg + param);
                break;
            case Define.LogType.Warn:
                console.warn(msg + param);
                break;
        }

        //AnalyticsMng.Instance.LogEvent(msg, )
    }

    // 샤드 별  StatusParamType -> Dropup_Shard 구한다. 
    // export function ConvertStatusParam(shardTID: number): Define.StatusParamType {

    //     switch (shardTID) {
    //         case 1: return Define.StatusParamType.Dropup_Shard_1;
    //         case 2: return Define.StatusParamType.Dropup_Shard_2;
    //         case 3: return Define.StatusParamType.Dropup_Shard_3;
    //         case 4: return Define.StatusParamType.Dropup_Shard_4;
    //         case 5: return Define.StatusParamType.Dropup_Shard_5;
    //         case 6: return Define.StatusParamType.Dropup_Shard_6;
    //         case 7: return Define.StatusParamType.Dropup_Shard_7;
    //         case 8: return Define.StatusParamType.Dropup_Shard_8;
    //         case 9: return Define.StatusParamType.Dropup_Shard_9;
    //         case 10: return Define.StatusParamType.Dropup_Shard_10;
    //         case 11: return Define.StatusParamType.Dropup_Shard_11;
    //     }

    //     return Define.StatusParamType.None;
    // }

    // 내 정보와 비교해 지불 능력이 있는지 판단. 
    // export function CheckPrice(type: Define.ItemSubType, price: number): boolean {

    //     let userData = PlayerMng.Instance.UserData;
    //     if (userData == null) {
    //         console.error("[CheckPrice] userData == null ");
    //         return false;
    //     }
    //     switch (type) {
    //         case Define.ItemSubType.InGame_Dia: {
    //             if (userData.diamond >= price)
    //                 return true;

    //             break;
    //         }

    //         case Define.ItemSubType.InGame_Coin: {
    //             if (userData.gold >= price)
    //                 return true;

    //             break;
    //         }
    //     }
    //     return false;
    // }

    // 아이템 서브 타입에 따른 아이콘 이름.
    // export function GetItemSubTypeIconName(type: Define.ItemSubType): string {
    //     switch (type) {
    //         case Define.ItemSubType.InGame_Dia: {
    //             return "icon_dia";
    //         }
            
    //         case Define.ItemSubType.InGame_Coin: {
    //             return "icon_coin";
    //         }
    //         case Define.ItemSubType.Status_Item: {
    //             return "icon_mastery_sot"
    //         }
    //     }

    //     return null;
    // }
}