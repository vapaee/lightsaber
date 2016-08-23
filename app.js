jwk.ajax({url:"games/prueba.json"}).done(function (json) {
    var saber = new LightSaber({
        spec: json,
        full_document: true,
        // container_id: 'container',
        create: function (game) {            
        },
        update: function (game) {
            // console.log("update", game);
        },
        render: function (game) {
            // game.debug.spriteInfo(game.saber.engine.scene.children[0], 010, 20);
            // game.debug.spriteInfo(game.saber.engine.scene, 010, 220);
            // game.debug.spriteBounds(game.saber.engine.scene);
            // game.debug.spriteBounds(game.saber.engine.scene.children[0]);
            var mask = game.saber.engine.scene.children[0].mask;            
    game.debug.text("x: " + mask.x, 10, 10);
    game.debug.text("y: " + mask.y, 10, 30);            
    game.debug.text("w: " + mask.width, 10, 50);
    game.debug.text("h: " + mask.height, 10, 70);
        }
    });    
}).fail(function (e) {
    console.error(e);
})
