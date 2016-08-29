jwk.ajax({url:"games/prueba.json"}).done(function (json) {
//jwk.ajax({url:"games/inline_block.json"}).done(function (json) {
    var saber = new LightSaber({
        spec: json,
        full_document: true,
        auto_resize: true,
        // container_id: 'container',
        create: function (game) {
            /*
            //	Here we add a Sprite to the display list
            var sprite = game.add.sprite(0, 0, 'book');
            // sprite.scale.set(2);

            //	A mask is a Graphics object
            mask = game.add.graphics(0, 0);

            //	Shapes drawn to the Graphics object must be filled.
            mask.beginFill(0xffffff);

            //	Here we'll draw a circle
            mask.drawCircle(100, 100, 100);

            //	And apply it to the Sprite
            sprite.mask = mask;
            

            //	As you move the mouse / touch, the circle will track the sprite
            game.input.addMoveCallback(function (pointer, x, y) {

                mask.x = x - 100;
                mask.y = y - 100;

            }, this);            
            
            */            
        },
        update: function (game) {
            // console.log("update", game);
        },
        render: function (game) {
            // game.debug.spriteInfo(game.saber.engine.scene.children[0], 010, 20);
            // game.debug.spriteInfo(game.saber.engine.scene, 010, 220);
            // game.debug.spriteBounds(game.saber.engine.scene);
            // game.debug.spriteBounds(game.saber.engine.scene.children[0]);
            /*
            var mask = game.saber.engine.scene.children[0].mask;
            
            if (!mask) return ; 
            game.debug.text("x: " + mask.x, 10, 10);
            game.debug.text("y: " + mask.y, 10, 30);            
            game.debug.text("w: " + mask.width, 10, 50);
            game.debug.text("h: " + mask.height, 10, 70);*/
        }
    });    
}).fail(function (e) {
    console.error(e);
})
