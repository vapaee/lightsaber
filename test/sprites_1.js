var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var parent, child;
var bmd, bmd2, bmd3, bmdContainer, bmdChild, bmdChild3;

function preload() {

    game.load.image('mushroom', 'lib/phaser-examples/examples/assets/sprites/mushroom2.png');

}

function create() {

    parent = game.add.sprite(000, 000, 'mushroom');
    parent.width = 400;
    parent.height = 300;

    child = parent.addChild(game.make.sprite(0, 0, 'mushroom'));
    child.scale.set(0.5);
    child.anchor.set(0);
    child.x = 32;
    child.y = 32;
    
    // -----------------------------
    
    
    bmd = game.add.bitmapData(game.width, game.height);
    bmdContainer = bmd.addToWorld(0, 300, 0, 0, 0.5, 0.5); // x, y, anchorX, anchorY, scaleX, scaleY        
    bmd.fill(255,0,0);
    
    bmd2 = game.add.bitmapData(game.width, game.height);    
    bmdChild = new Phaser.Image(game, 400, 300, bmd2); // x, y, bitmapData
    bmdChild.anchor.set(0, 0);
    bmdChild.scale.set(0.5, 0.5);    
    bmd2.fill(0,255,0);
    
    bmdContainer.addChild(bmdChild);
    
    // -----------------------------
    
    bmd3 = game.add.bitmapData(64, 64);    
    bmdChild3 = new Phaser.Image(game, 0, 32, bmd3); // x, y, bitmapData
    bmdChild3.anchor.set(0, 0);
    bmdChild3.scale.set(0.5, 0.5);    
    bmd3.fill(0,0,255);
    
    parent.addChild(bmdChild3);
    
    console.log("bmdContainer.width", bmdContainer.width);
    console.log("bmdChild.width", bmdChild.width);
    
}

function update() {

    //parent.x += 0.1;
    //child.x += 0.1;

}

function render() {

    //game.debug.text(parent.width, 500, 32);
    //game.debug.text(child.width, 532, 64);
    // game.debug.geom(parent.getBounds());

    game.debug.spriteInfo(parent, 420, 32);
    game.debug.spriteInfo(child, 420, 332);
    game.debug.spriteBounds(child);

}