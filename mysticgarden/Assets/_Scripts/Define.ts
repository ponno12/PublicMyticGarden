export namespace Define {
    
    export enum GameState {
        None, // 최초 상태.  0

        Init_Start, // 초기화 한번만.  
        Init_Update,
        Init_End,

        CI, // 아직은 진입 하지 않는다.  위치 변경 가능. 
        BI,

        // 로딩 씬으로 이동.  
        Move_SceneLoading_Start, // 
        Move_SceneLoading_Update, // 
        Move_SceneLoading_End, // 

        // 로딩씬 진입. 
        SceneLoading_Start, //
        SceneLoading_Update,
        SceneLoading_End,

        // 월드로 이동. 
        Move_SceneWorld_Start,
        Move_SceneWorld_Update,
        Move_SceneWorld_End,


        // 월드 초기화.
        Init_Wolrd_Start,
        Init_Wolrd_Update,
        Init_Wolrd_End,

        Game_Start,
        Game_Update,
        Game_End,

        Towergame_Start,
        Towergame_Update,
        Towergame_End,

        Wait
    }

    export enum GameSubState {
        None,

        // 캐릭터 생성 대기 
        WaitCreatePlayer_Start,
        WaitCreatePlayer_Update,
        WaitCreatePlayer_End,

        //CommunicationTool
        Communication_Start,
        Communication_Update,
        Communication_End,

        Leaderboard_Start,
        Leaderboard_Update,
        Leaderboard_End,

        Complete,
    }

    export enum T_GameState {
        None,
        Play,
        Pause,
        GameOver,
        GameEnd
    }

    export enum ObjectType{
        Tile,
        
    }

    export enum SceneType {
        Init = 0,
        Loading = 1,
        World = 2,
    }

    export enum UIMsgBoxType {
        One,
        Two,
        ImageOne,
    }

    export enum LogType {
        Log = "Log",
        Info = "Info",
        Error = "Error",
        Warn = "Warn",
    }

    export enum ResultCode {
        complete,
        failed,

        failed_gatcha,
        failed_gatcha_load_table,
        failed_gatcha_empty_slot,
        failed_gatcha_create_key,

        failed_gatcha_notenough_coin = 100,

        failed_Sini_Upgrade,
        failed_siniupgrade_null,
        targetdata,


        failed_sini_delete_NotFoundStorge, // 시니 삭제시 플레이어 저장소를 찾을 수 없다. 





        // dev
        reset,
    }

    export enum SoundType {
        ui_btn_affirmative = 20001,
        ui_btn_negative = 20002,

        sfx_coin_get_00 = 30001,
        sfx_coin_get_01 = 30002,
        sfx_shard_break = 30003,
        sfx_coin_collect = 30004,
        sfx_shini_mining_00 = 30005,
        sfx_shini_mining_01 = 30006,
        sfx_shini_mining_02 = 30007,
        sfx_shini_bounce_00 = 30008,
        sfx_shard_mining_00 = 30009,
        sfx_dreambox_roll_negative_00 = 30010,
        sfx_dreambox_roll_positive_00 = 30011,
        sfx_dreambox_roll_00 = 30012,
        sfx_teleport_add = 30013,


    }

    export enum UITextType {
        
    }

    

    export enum AtlasType {
        main = 1,
        exclusive = 2,
    }
    export enum Direction{
        left,
        right
    }

}