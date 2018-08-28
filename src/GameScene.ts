import TimesteppedScene from "./base/TimesteppedScene";
import { EnemiesManager } from "./GameObject/EnemiesManager";
import { PlayerClass } from "./GameObject/PlayerClass";
import { BgClass } from "./GameObject/BgClass";
import Bullet from "./GameObject/bullet"

export default class GameScene extends TimesteppedScene {

	private scrollSpeed: number;

	private enemiesManager: EnemiesManager;

	private playerObject: PlayerClass;
	private tilesetObject: BgClass;

	private bullets: Bullet[];
	private lastShotTime: number;

	init() {
		this.bullets = [];
		this.lastShotTime = 0;

		this.scrollSpeed = 3;

		this.playerObject = new PlayerClass(this.game);
		this.tilesetObject = new BgClass(this.game);

		this.enemiesManager = new EnemiesManager(this.game, this.playerObject);
		this.enemiesManager.init();//敵
	}

	preload() {
		this.game.load.image('background', 'assets/stageBackground.png');

		this.game.load.tilemap('map', 'assets/json/mapTest001B.json', null, Phaser.Tilemap.TILED_JSON); // タイルマップのjsonファイル
		this.game.load.image('tiles', 'assets/exptest01.png');  // タイルセット画像ファイル

		this.game.load.image('enemyA', 'assets/nyan.png');//敵画像
		this.game.load.image('enemyB', 'assets/purin.png');
		this.game.load.image('enemyD', 'assets/omurise.png');
		this.game.load.image('enemyC', 'assets/bossenemy.png');
		this.game.load.image('enemyE', 'assets/ebihurai.png');
		this.game.load.image('bullet', 'assets/fork.png');
		this.enemiesManager.preload();//敵

		this.game.load.spritesheet('playerSprite', 'assets/playerA.png', 50, 50);
	}

	create() {
		this.tilesetObject.createTileset();

		this.enemiesManager.create();//敵

		this.playerObject.createPlayer();

		this.game.physics.arcade.enable([this.playerObject.mySprite]);//todo:Player.tsに移す

		//テスト用でゲームオーバーに遷移させる機能。ゲームが完成したら削除する。
		const onMouseDown = () => {
			this.buttonOnClick();
			this.game.canvas.removeEventListener('mousedown', onMouseDown);
		};

		this.game.canvas.addEventListener('mousedown', onMouseDown);
	}

	fixedUpdate(dt: number) {
		this.game.camera.x += this.scrollSpeed;

		this.tilesetObject.update();
		this.playerObject.update();
		this.enemiesManager.update();//敵の更新

		//bulletの生成
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && new Date().getTime() - this.lastShotTime >= 200){
			//todo:mySpriteもらうのかっこ悪いし、長くなる。player.tsはPhaser.spriteを継承したクラスにする。
			const bullet = new Bullet(this.game, this.playerObject.mySprite.x, this.playerObject.mySprite.y, "bullet");
			this.bullets.push(bullet);
			this.lastShotTime = new Date().getTime();
		}

		//bulletの処理と当たり判定
		for (const bullet of this.bullets){
			bullet.fixedUpdate();
		}

	}

	buttonOnClick() {
		this.game.state.start('GameOverScene');
	}

}

