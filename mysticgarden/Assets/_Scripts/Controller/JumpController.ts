import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayers, CharacterState } from 'ZEPETO.Character.Controller';
import { Transform, Quaternion, Time, GUI, Rect, WaitForEndOfFrame, Vector3, Animator, Camera, AnimatorStateInfo } from 'UnityEngine';

export default class JumpController extends ZepetoScriptBehaviour {

    private ZepetoCharacter: ZepetoCharacter;
    private myCharacter: ZepetoCharacter;
    private originTranform: Transform;
    public customCamera: Camera;
    private localPlayerTr: Transform;

    public jumpPower: number = 1;
    public cooltime: number = 0.5;

    public animator: Animator;


    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.myCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.localPlayerTr = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform;
            // Disable the ZEPETO camera
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
            this.myCharacter.characterController.enabled = false;
            let ani = this.localPlayerTr.gameObject.AddComponent<Animator>();
        });


    }
    *JumpTwice() {
        let tempTime = 0;
        let toward = -1;
        this.originTranform = this.myCharacter.transform;
        while (true) {
            if (tempTime >= this.cooltime) {
                //this.myCharacter.Teleport(this.originTranform.position + new Vector3(this.jumpPower * toward, this.myCharacter.transform.position.y + 1, 0), Quaternion.identity);
                this.myCharacter.transform.position = this.originTranform.position + new Vector3(this.jumpPower * toward, 0, 0)
                //this.myCharacter.ChangeStateAnimation(CharacterState.Jump);
                this.animator.SetInteger("State",CharacterState.Jump);

                tempTime = 0;
                toward *= -1;
            }
            tempTime += Time.deltaTime;
            yield new WaitForEndOfFrame();
        }
    }

    OnGUI() {
        if (GUI.Button(new Rect(10, 10, 150, 100), "시작")) {
            this.StartCoroutine(this.JumpTwice());
        }
    }





    LateUpdate() {
        if (this.localPlayerTr != null) {
            console.log(`tranform x : ${this.myCharacter.transform.position.x} y : ${this.myCharacter.transform.position.x} z : ${this.myCharacter.transform.position.x}`);
            this.customCamera.transform.position = new Vector3(this.localPlayerTr.position.x, this.customCamera.transform.position.y, this.localPlayerTr.position.z - 4);
        }
    }
}