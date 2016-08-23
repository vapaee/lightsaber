LightSaber.Scene = function (game, spec, parent) {
    this.data = game.saber.extend_spec(spec);
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.Scene.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    create: function() {
        this.phaser.target = this.phaser.group;        
    },
    init: function(game, spec, parent) {
        LightSaber.DisplayObject.prototype.init.call(this, game, spec, parent);
        this.state = {
            width: this.game.world.width,
            height: this.game.world.height,
            x: 0,
            y: 0
        }        
    },
    update: function(delta) {        
    },
    getName: function () {
        return "root";
    },
    getType: function () {
        return "Scene";
    },
    resize: function () {
        this.state = {
            width: this.game.world.width,
            height: this.game.world.height,
            x: 0,
            y: 0
        }
        this._update_state = true;
        for (var i in this.children) {
            this.children[i].resize();
        }        
    }
});