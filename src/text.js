LightSaber.Text = function (game, spec, parent) {    
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.Text.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    init: function(game, spec, parent) {
        LightSaber.DisplayObject.prototype.init.call(this, game, spec, parent);
    },
    getType: function () {
        return "Text";
    },
    create: function () {
        this.phaser.target = this.game.add.image(this.state.x, this.state.y);
        this.phaser.target.anchor.set(0, 0);
        this.phaser.target.scale.set(1, 1);
        this.phaser.target.alpha = 1;
        
        this.phaser.group.addChild(this.phaser.target);
    },
    setBounds: function (bounds) {
        LightSaber.DisplayObject.prototype.setBounds.call(this, bounds);
    }
});