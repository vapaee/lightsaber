LightSaber.Scene = function (game, spec, parent) {
    this.data = game.saber.extend_spec(spec);
    game.saber.engine.scene = this;
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.Scene.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    create: function() {
        this.phaser.target = this.phaser.group;        
    },
    init: function(game, spec, parent) {
        this.state = {
            width: game.world.width,
            height: game.world.height,
            x: 0,
            y: 0
        }        
        LightSaber.DisplayObject.prototype.init.call(this, game, spec, parent);
    },
    update: function(delta) {        
    },
    getName: function () {
        return "root";
    },
    getType: function () {
        return "Scene";
    },
    computeDeployment: function (apply) {
        this.state = {
            width: this.game.world.width,
            height: this.game.world.height,
            x: 0,
            y: 0
        }
        return this.state;
    }
});