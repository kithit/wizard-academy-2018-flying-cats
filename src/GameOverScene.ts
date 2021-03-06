import TimesteppedScene from "./base/TimesteppedScene";
import PhaserTextStyle = Phaser.PhaserTextStyle;

export default class GameOverScene extends TimesteppedScene {
	/**
	 * Load sprites and various assets here.
	 */
	preload() {
		this.game.load.spritesheet('touchButton', 'assets/touchTheScreenButton.png', 199, 38);
		this.game.load.spritesheet('gameOverBg', 'assets/gameOverBackground.png', 768, 432);
	}

	/**
	 * Ran once at initialization.
	 */
	create() {
		const Bg = this.add.image(0, 0, "gameOverBg");

		const touchMessage = this.game.add.button(this.game.width / 2, 295, 'touchButton', this.buttonOnClick, this);
		touchMessage.anchor.set(0.5, 0.5);

		const onMouseDown = () => {
			this.buttonOnClick();
			this.game.canvas.removeEventListener('mousedown', onMouseDown);
		};

		this.game.canvas.addEventListener('mousedown', onMouseDown);
	}

	/**
	 * Ran every frame (this.fixedDt).
	 */
	fixedUpdate(dt: number) {
		// Skip to next scene with space or return
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			//ゲーム中、スペースキーを押しっぱなしにして死亡する可能性があるため、ゲームオーバージーンからはキー入力で遷移させない。
			//this.buttonOnClick();
		}
	}

	/**
	 * Callback for button.
	 */
	buttonOnClick() {
		this.game.state.start('TitleScene');
	}
}