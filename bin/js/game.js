/// <reference path="../../tsDefinitions/phaser.d.ts" />

var Game = function() {
  var game = new Phaser.Game(256, 240, Phaser.CANVAS, "", {
    preload: preload,
    init: init,
    create: create,
    update: update
  });

  function preload() {
    game.load.tilemap(
      "room1",
      "assets/room1.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    game.load.spritesheet(
      "gamesprite",
      "assets/16x16_Jerom_CC-BY-SA-3.0.png",
      16,
      16,
      200
    );

    game.world.setBounds(0, 0, game.width, game.height - 16 * 5);
    //game.stage.disableVisibilityChange = true;
  }

  function init() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  }

  var ship;
  var cursors;
  var pad1;

  var map;

  function makeRoom(name) {
    if (map) map.destroy();

    map = game.add.tilemap(name);
    map.addTilesetImage("16x16_Jerom_CC-BY-SA-3.0", "gamesprite");
    var layer1 = map.createLayer("floor");
    layer1.resizeWorld();
    map.setCollision(250, true, "collision");
    game.physics.p2.convertTilemap(map, "collision");

    if (map.objects.object) {
      const objs = map.objects.object;
      objs.forEach(obj => {
        createObj(obj);
      });
    }
  }

  function createObj(obj) {
    if (obj.type == "player") {
      ship = game.add.sprite(obj.x, obj.y, "gamesprite");
      ship.frame = obj.gid - 1;
      ship.anchor.set(0.5);
      ship.smoothed = false;

      game.physics.p2.enable(ship);

      //ship.body.fixedRotation = true;
      ship.body.collideWorldBounds = true;
      return ship;
    }

    var mapObj = game.add.sprite(obj.x, obj.y, "gamesprite");
    game.physics.p2.enable(mapObj);
    mapObj.frame = obj.gid - 1;
    mapObj.body.setRectangle(obj.width, obj.height);
    mapObj.body.fixedRotation = true;
    mapObj.anchor.set(0.5);
    mapObj.smoothed = false;
    mapObj.body.collideWorldBounds = true;
    mapObj.body.applyDamping(0.9);
    mapObj.body.debug = true;
    mapObj.body.setZeroDamping();
    return mapObj;
  }

  function create() {
    game.touchControl = game.plugins.add(Phaser.Plugin.TouchControl);
    game.touchControl.inputEnable();
    game.touchControl.settings.maxDistanceInPixels = 32;
    game.touchControl.setPos(50, 200);

    game.physics.startSystem(Phaser.Physics.P2JS);
    makeRoom("room1");

    game.physics.p2.restitution = 0.7;
    game.physics.p2.applyDamping = true;
    game.physics.p2.gravity = 0;

    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    console.log(pad1);

    cursors = game.input.keyboard.createCursorKeys();
  }

  function update() {
    ship.body.setZeroVelocity();
    var playerSpeed = 64;

    if (pad1.connected) {
      var leftStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
      var leftStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

      if (leftStickX) {
        ship.body.moveRight(leftStickX * playerSpeed);
        ship.body.angle =
          360 - Math.atan2(leftStickX, leftStickY) * 180 / Math.PI;
      }

      if (leftStickY) {
        ship.body.moveDown(leftStickY * playerSpeed);
        ship.body.angle =
          360 - Math.atan2(leftStickX, leftStickY) * 180 / Math.PI;
      }

      //ship.body.angle += 10;

      //      console.log(Math.atan2(leftStickX, leftStickY) * 180 / Math.PI);
    }

    var speed = this.game.touchControl.speed;
    if (speed.y) {
      ship.body.moveUp(speed.y);
      ship.body.angle =
        180 - Math.atan2(speed.x, speed.y) * 180 / Math.PI;
    }
    if (speed.x)
    {
      ship.body.moveLeft(speed.x);
      ship.body.angle =
        180 - Math.atan2(speed.x, speed.y) * 180 / Math.PI;
    }

    if (cursors.left.isDown) {
      ship.body.moveLeft(playerSpeed);
    } else if (cursors.right.isDown) {
      ship.body.moveRight(playerSpeed);
    }

    if (cursors.up.isDown) {
      ship.body.moveUp(playerSpeed);
    } else if (cursors.down.isDown) {
      ship.body.moveDown(playerSpeed);
    }
  }
};

window.onload = function() {
  var game = new Game();
};
