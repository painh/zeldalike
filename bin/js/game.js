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
  var customBounds;

  var map;

  function makeRoom(name) {
    if (map) map.destroy();

    map = game.add.tilemap(name);
    map.addTilesetImage("16x16_Jerom_CC-BY-SA-3.0", "gamesprite");
    var layer1 = map.createLayer("floor");
    layer1.resizeWorld();
    map.setCollision(250, true, 'collision');
    game.physics.p2.convertTilemap(map, "collision");

    if (map.objects.object) {
      const objs = map.objects.object;
      objs.forEach(obj => {
        var ball = game.add.sprite( obj.x, obj.y, "gamesprite");
        game.physics.p2.enable(ball);
        ball.frame = obj.gid - 1;
        ball.body.setRectangle(obj.width, obj.height);
        ball.body.fixedRotation = true;
        ball.anchor.set(0.5);
        ball.smoothed = false;
        ball.body.collideWorldBounds = true;
        ball.body.applyDamping(0.9);
        ball.body.debug = true;
        ball.body.setZeroDamping(); 
      });
    }
  }

  function create() { 
    game.physics.startSystem(Phaser.Physics.P2JS);
    makeRoom("room1");

    game.physics.p2.restitution = 0.7;
    game.physics.p2.applyDamping = true;
    // game.physics.p2.applyGravity = false;
    // game.physics.p2.applySpringForces = false;
    game.physics.p2.gravity = 0;

    //  Some balls to collide with
    balls = game.add.physicsGroup(Phaser.Physics.P2JS);

    for (var i = 0; i < 1; i++) {
      var ball = balls.create(
        20 + 1,
        20 + i * 16 + 1,
        "gamesprite"
      );
      ball.frame = 10 * 21;
      ball.body.setRectangle(16, 16);
      ball.body.fixedRotation = true;
      ball.anchor.set(0.5);
      ball.smoothed = false;
      ball.body.collideWorldBounds = true;
      ball.body.applyDamping(0.9);
      ball.body.debug = true;
      ball.body.setZeroDamping();
      //ball.body.static = true;
    }

    ship = game.add.sprite(
      game.world.randomX,
      game.world.randomY,
      "gamesprite"
    );
    ship.frame = 10 * 19;
    ship.anchor.set(0.5);
    ship.smoothed = false;

    //  Create our physics body. A circle assigned the playerCollisionGroup
    game.physics.p2.enable(ship);

    //ship.body.setCircle(16);
//    ship.body.setRectangle(16, 16);
    ship.body.fixedRotation = true;
    ship.body.collideWorldBounds = true;

    //  Create a new custom sized bounds, within the world bounds
    customBounds = { left: null, right: null, top: null, bottom: null };

    //    createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

    //  Just to display the bounds
    // var graphics = game.add.graphics(bounds.x, bounds.y);
    // graphics.lineStyle(4, 0xffd900, 1);
    // graphics.drawRect(0, 0, bounds.width, bounds.height);

    cursors = game.input.keyboard.createCursorKeys();
  }

  function update() {
    ship.body.setZeroVelocity();
    var playerSpeed = 64;

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
