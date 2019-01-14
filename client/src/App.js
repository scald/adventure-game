import React, { Component } from 'react';
import './App.css';
import Phaser from 'phaser';



class App extends Component {

  componentDidMount() {
    var level;
    var cursors;
    var emitter;
    var avatarMain;
    var dude;
    var dudeAngle;
    var stars;
    var score = 0;
    var scoreText;
    var titleText;
    var clouds1;
    var clouds2;
    var gameOver = {status: false, text:"", subText: ""};
    var mainText;
    var mainSubText;
    var levelComplete = {status: false, text:"", subText: "", getNextLevel: function(){ return false; }};
    var health = 100;
    var healthText;
    var music;
    var damageFX;
    var lowHealthFX;

    levelComplete.getNextLevel = function() {
      level += 1;
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    };

    var collectStar = function(player, star) {
      star.disableBody(true, true);

      avatarMain.displayWidth *= 1.1;
      avatarMain.displayHeight *= 1.1;

      //  Add and update the score
      score += 10;
      scoreText.setText('Score: ' + score);

      if (stars.countActive(true) === 0) {
        dude.disableBody(true, true);
        levelComplete.status = true;
        levelComplete.text = "Nicely done."
        levelComplete.subText = "Press Space";
      }
    }

    function dudeCollision(player, dude) {
      damageFX.play();

      avatarMain.setTint(0xff0000);
      health -= 2;

      if (health <= 30) {
        lowHealthFX.play();
      }
      if (health <= 0) {
        gameOver.status = true;
        gameOver.text = "You're dead.";
        gameOver.subText = "Press Space";
        avatarMain.disableBody(true, true);

      }
      healthText.setText('Health: ' + health);
      window.setTimeout(function() { avatarMain.clearTint(); }, 200 );

    }
// ##################################################

    var preload = function () {
      this.load.audio('music', [ 'music/a_plus.m4a' ]);
      this.load.audio('damageFX', [ 'fx/damageFX.m4a' ]);
      this.load.audio('low_healthFX', [ 'fx/low_healthFX.m4a' ]);
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

      level = config.level;

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
      titleText = this.add.text(30, 30, "Emojiball", { fontSize: '24px', fill: '#000' });
      scoreText = this.add.text(30, 60, 'Score: ' + score, { fontSize: '24px', fill: '#000' });
      healthText = this.add.text(800, 30, 'Health: ' + health, { fontSize: '24px', fill: '#000' });
      mainText = this.add.text(30, 300, "", { fontSize: '72px', fill: '#000' });
      mainSubText = this.add.text(35, 400, "", { fontSize: '24px', fill: '#242424' });

      avatarMain = this.physics.add.image(0, 0, 'avatar_main');

      // .setVelocity(20, 20);
      avatarMain.setBounce(1, 0.2);
      avatarMain.setCollideWorldBounds(true);
      avatarMain.setAccelerationX(3);
      // avatarMain.setAccelerationY(-200);

      // sparkleavatarMain
      var particles = this.add.particles('star');
      emitter = particles.createEmitter({
        speed: 200,
        scale: { start: -0.1, end: 1 },
        blendMode: "ADD"
      });
      emitter.active = true;
      emitter.startFollow(avatarMain);


    // The dude and its settings
    dude = this.physics.add.sprite(Phaser.Math.Between(512,1024), Phaser.Math.Between(0,768), 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    dude.setBounce(0.2);
    dude.setCollideWorldBounds(true);

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

      //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
      stars = this.physics.add.group({
        key: 'star', 
        repeat: Phaser.Math.Between(5,10),
        setXY: { x: 100, y: 0, stepX: 80 }
      });

      // console.log(stars.children);
      stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setVelocityY(Phaser.Math.FloatBetween(160, 200));
        child.setBounceY(Phaser.Math.FloatBetween(0.7, 1.0));
        child.setCollideWorldBounds(true);
      });

      this.physics.add.collider(avatarMain, stars, collectStar, null, this);
      this.physics.add.collider(avatarMain, dude, dudeCollision, null, this);

      music.play();

    }

// ##################################################

    function update() {
      if (gameOver.status)
      {
        mainText.setText(gameOver.text);
        mainSubText.setText(gameOver.subText);
        return;
      }

      if (levelComplete.status)
      {
        mainText.setText(levelComplete.text);
        mainSubText.setText(levelComplete.subText);
        if (cursors.space.isDown) {
          levelComplete.getNextLevel();
        }
      }

      else if (cursors.space.isDown) {
        avatarMain.setVelocityY(-530);
      
        // emitter.active = true;
        // emitter.setAlpha = 1;

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
        
        dudeAngle = Phaser.Math.RadToDeg(this.physics.moveToObject(dude, avatarMain, 0.9, 1500));

        if ((dudeAngle >= 0 && dudeAngle <= 90) || (dudeAngle <= 0 && dudeAngle > -90)) {
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
      },
      level: 1
    };

    var game = new Phaser.Game(config);
  }

  render() {
    return (<div id="game" />);
  }
}

export default App;
