var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var parent, child;
var bmd, bmd2, bmd3, bmdContainer, bmdChild, bmdChild3;
var friendAndFoe;
var enemies;

function preload() {

    game.load.image('mushroom', 'lib/phaser-examples/examples/assets/sprites/mushroom2.png');
    game.load.image('ufo', 'lib/phaser-examples/examples/assets/sprites/ufo.png');
    game.load.image('baddie', 'lib/phaser-examples/examples/assets/sprites/space-baddie.png');    

}

function create() {

        
    //  Here we create 2 new groups
    friendAndFoe = game.add.group();
    enemies = game.add.group();

    for (var i = 0; i < 16; i++)
    {
        //  This creates a new Phaser.Sprite instance within the group
        //  It will be randomly placed within the world and use the 'baddie' image to display
        enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'baddie');
    }

    //  You can also add existing sprites to a group.
    //  Here we'll create a local sprite called 'ufo'
    var ufo = game.add.sprite(200, 240, 'ufo');

    //  And then add it to the group
    friendAndFoe.add(ufo);
    
    console.log("game:", [game]);
    
}

function update() {
    if (!this._not_first_time) {
        console.log("enemies.getBounds():", enemies.getBounds());
        this._not_first_time = true;
    }

}

function render() {

    //game.debug.text(parent.width, 500, 32);
    //game.debug.text(child.width, 532, 64);
    // game.debug.geom(parent.getBounds());

    //game.debug.spriteInfo(parent, 420, 32);
    game.debug.groupInfo(enemies, 420, 332);
    game.debug.groupInfo(friendAndFoe, 420, 332);
    game.debug.geom(friendAndFoe.getBounds());
    game.debug.geom(enemies.getBounds());

}

Phaser.Utils.Debug.prototype.groupInfo = function (group, x, y, color) {
    /*
    console.log([group]);
    this.start(x, y, color);

    this.line('Sprite: ' + ' (' + group.width + ' x ' + group.height + ') anchor: ' + group.anchor.x + ' x ' + group.anchor.y);
    this.line('x: ' + group.x.toFixed(1) + ' y: ' + group.y.toFixed(1));
    this.line('angle: ' + group.angle.toFixed(1) + ' rotation: ' + group.rotation.toFixed(1));
    this.line('visible: ' + group.visible + ' in camera: ' + group.inCamera);
    this.line('bounds x: ' + group._bounds.x.toFixed(1) + ' y: ' + group._bounds.y.toFixed(1) + ' w: ' + group._bounds.width.toFixed(1) + ' h: ' + group._bounds.height.toFixed(1));

    this.stop();
    */
}

