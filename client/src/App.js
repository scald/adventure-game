import React, { Component } from 'react';
import './App.css';
import Phaser from 'phaser';



class App extends Component {

  componentDidMount() {
    var game;
    var cursors;
    var emitter;
    var avatarMain;
    var dude;
    var dudeAttack;
    var stars;
    var score = 0;
    var scoreText;
    var titleText = "";
    var clouds1;
    var clouds2;
    var mainText; 
    var mainSubText;
    var level = { previous: 0, current: 1, dead: false, complete: false, text: "", subText: "", getNextLevel: function () { return false; }, startLevel: function () { return false; } };
    var health = 100;
    var healthText;
    var levelText;
    var music;
    var damageFX;
    var lowHealthFX;
    var lives = 3;

    level.startLevel = function () {
      if (lives === 0) {
        lives = 3;
      }
      avatarMain.displayWidth = 48;
      avatarMain.displayHeight = 48;
      avatarMain.enableBody(true, 0, 0, true, true);
      dude.enableBody(true, Phaser.Math.Between(512, 1024), Phaser.Math.Between(0, 768), true, true);

      health = 100;
      level.dead = false;
      level.complete = false;
      level.text = "";
      level.subText = "";

      // .setVelocity(20, 20);
      avatarMain.setBounce(1, 0.2);
      avatarMain.setCollideWorldBounds(true);
      avatarMain.setAccelerationX(3);
      // avatarMain.setAccelerationY(-200);

      emitter.active = true;
      emitter.startFollow(dude);

      //  Player physics properties. Give the little guy a slight bounce.
      dude.setBounce(0.2);
      dude.setCollideWorldBounds(true);

      // console.log(stars.children);
      stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setVelocityY(Phaser.Math.FloatBetween(160, 200));
        child.setAccelerationX(Phaser.Math.FloatBetween(550, 900));
        child.setBounceY(Phaser.Math.FloatBetween(0.7, 1.0));
        child.setCollideWorldBounds(true);
        child.enableBody(true, child.x, 0, true, true);
      });

      // music.play();

    }

    level.getNextLevel = function () {
      level.current += 1;
      level.startLevel();
    };

    var collectStar = function (player, star) {
      star.disableBody(true, true);

      if (stars.countActive(true) <= 10) {

        avatarMain.displayWidth *= 1.1;
        avatarMain.displayHeight *= 1.1;
      }

      //  Add and update the score
      score += 10;


      if (stars.countActive(true) === 0) {
        // dude.disableBody(true, true);
        level.complete = true;
        level.text = "Nicely done."
        level.subText = "Press Space";
        dude.disableBody(true, true); 
        emitter.active = false;
        emitter.setAlpha = 0;
      }
    }

    function dudeCollision(player, dude) {
      if (!level.dead && !level.complete) {
        damageFX.play();

        avatarMain.setTint(0xff0000);
        health -= 2;

        if (health <= 30) {
          lowHealthFX.play();
        }
        if (health <= 0) {
          score = 0;
          lives -= 1;
          level.dead = true;
          level.text = "You're dead.";
          level.subText = "Press Space";
          avatarMain.disableBody(true, true);
          emitter.active = false;
          emitter.setAlpha = 0;
          dude.disableBody(true, true);
        
          stars.children.iterate(function (child) {
            child.setCollideWorldBounds(false);
          });
        }

        if (lives === 0) {
          level.gameOver = true;
          level.text = "Better luck next time.";
          level.subText = "Game Over - Press Space";
        }

        window.setTimeout(function () { avatarMain.clearTint(); }, 200);
      }
    }
    // ##################################################

    var preload = function () {
      this.load.audio('music', ['music/a_plus.m4a']);
      this.load.audio('damageFX', ['fx/damageFX.m4a']);
      this.load.audio('low_healthFX', ['fx/low_healthFX.m4a']);
      this.load.image('sky', 'game_background_4/layers/sky.png');
      this.load.image('sky2', 'sky2.png');
      this.load.image('platform', 'platform.png');
      // this.load.image('star', 'star.png');
      this.load.image('ground', 'game_background_4/layers/ground.png');
      this.load.image('rocks', 'game_background_4/layers/rocks.png');
      this.load.image('clouds_1', 'game_background_4/layers/clouds_1.png');
      this.load.image('clouds_2', 'game_background_4/layers/clouds_2.png');
      this.load.image('avatar_main', 'grandpa-emoji-72.png');
      this.load.image('star', 'grandpa-emoji-24.png');

      this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });

      // this.load.image('scarlett', 'scarlett-headphones.png');
    }

    // ##################################################

    var create = function () {
      // SOUNDS 🥁
      music = this.sound.add('music');
      damageFX = this.sound.add('damageFX');
      damageFX.setRate(2.8);
      damageFX.setDetune(150);
      lowHealthFX = this.sound.add('low_healthFX');
      lowHealthFX.setRate(3);
      lowHealthFX.setDetune(150);

      // IMAGES 
      this.add.image(500, 250, 'sky');
      clouds1 = this.physics.add.image(10, 250, 'clouds_1');
      clouds1.setAccelerationY(-621);
      clouds1.setVelocityX(4);
      clouds2 = this.physics.add.image(40, 150, 'clouds_2');
      clouds2.setAccelerationY(-621);
      clouds2.setVelocityX(20);
      this.add.image(250, 250, 'ground');

      // TEXT
      titleText = this.add.text(30, 30, "", { fontSize: '24px', fill: '#000' });
      scoreText = this.add.text(30, 60, '', { fontSize: '24px', fill: '#000' });
      healthText = this.add.text(30, 90, '', { fontSize: '24px', fill: '#000' });
      levelText = this.add.text(500, 30, '' + health, { fontSize: '48px', fill: '#000' });
      mainText = this.add.text(30, 300, "", { fontSize: '72px', fill: '#000' });
      mainSubText = this.add.text(35, 400, "", { fontSize: '24px', fill: '#242424' });

      avatarMain = this.physics.add.image(0, 0, 'avatar_main');

      // sparkleavatarMain
      var particles = this.add.particles('star');
      emitter = particles.createEmitter({
        speed: 100,
        scale: { start: -0.1, end: 1 },
        blendMode: "ADD"
      });

      // The dude and its settings
      dude = this.physics.add.sprite(Phaser.Math.Between(512, 1024), Phaser.Math.Between(0, 768), 'dude');

      //  Our player animations, turning, walking left and walking right.
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 20,
        repeat: -1
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 20,
        repeat: -1
      });

      cursors = this.input.keyboard.createCursorKeys();

      stars = this.physics.add.group({
        key: 'star',
        repeat: 50,
        setXY: { x: 0, y: Phaser.Math.Between(100,800), stepX: 18 }
      });
      this.physics.add.collider(avatarMain, stars, collectStar, null, this);
      this.physics.add.collider(avatarMain, dude, dudeCollision, null, this);

      level.startLevel();
    }

    // ##################################################

    function update() {
      mainText.setText(level.text);
      mainSubText.setText(level.subText);
      titleText.setText('👴🏽 ' + lives);
      scoreText.setText('🏆 ' + score);
      healthText.setText('❤️ ' + health);
      levelText.setText(level.current);

      if (cursors.space.isDown) {
        if (level.dead) {
          level.startLevel();
        }

        if (level.complete) {
          level.getNextLevel();
        }

        avatarMain.setVelocityY(-530);
      }

      if (cursors.left.isDown) {
        avatarMain.setVelocityX(-260);
        // dude.setVelocityX(-300);

      }
      else if (cursors.right.isDown) {
        avatarMain.setVelocityX(260);
        // dude.setVelocityX(300);

        // dude.anims.play('right', true);
      }
      else {
        //
      }
      dudeAttack = Phaser.Math.RadToDeg(this.physics.moveToObject(dude, avatarMain, 0.9, Phaser.Math.Between(1300, 1500)));

      if ((dudeAttack >= 0 && dudeAttack <= 90) || (dudeAttack <= 0 && dudeAttack > -90)) {
        dude.anims.play('right', true);
      } else {
        dude.anims.play('left', true);

      }
    }


    var config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      autoFocus: true,
      parent: 'game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 620 }
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      audio: {
        disableWebAudio: true
      }
    };

    game = new Phaser.Game(config);
  }

  render() {
    return (<div id="game" />);
  }
}

export default App;
