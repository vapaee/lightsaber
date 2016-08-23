LightSaber.BitmapData = function (game, spec, parent) {    
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.BitmapData.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    init: function(game, spec, parent) {
        LightSaber.DisplayObject.prototype.init.call(this, game, spec, parent);
    },
    getType: function () {
        return "BitmapData";
    },
    create: function () {
        this.phaser.bmd = this.game.make.bitmapData(this.state.width, this.state.height);
        this.phaser.bmd.x = this.phaser.bmd.y = 0;
        if (this.spec.fillStyle) {
            var color = LightSaber.utils.hexToRgb(this.spec.fillStyle);
            this.phaser.bmd.fill(color.r, color.g, color.b);
        }
        
        this.phaser.target = this.game.add.image(this.state.x, this.state.y, this.phaser.bmd);
        this.phaser.target.anchor.set(0, 0);
        this.phaser.target.scale.set(1, 1);
        this.phaser.target.alpha = 1;
        
        this.phaser.group.addChild(this.phaser.target);
    },
    setBounds: function (bounds) {
        LightSaber.DisplayObject.prototype.setBounds.call(this, bounds);
    }
});