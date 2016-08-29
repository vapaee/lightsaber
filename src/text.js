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
        this.state.text = this.data.text;
        if (typeof this.data.bitmap == "undefined") {
            this.state.style = LightSaber.utils.extend({
                font: "24px Arial",
                fill: "#aaaaaa",
                align: "left"
            }, this.data.style);
            this.phaser.text = this.game.add.text(this.state.x, this.state.y, this.state.text, this.state.style);
            this.phaser.group.addChild(this.phaser.text);
        } else {
            this.state.fontSize = this.data.fontSize || 24;
            console.assert(typeof this.data.bitmap == "string", this.data.bitmap)
            this.phaser.text = this.game.add.bitmapText(this.state.x, this.state.y, this.data.bitmap, this.state.text, this.state.fontSize);            
        }
        this.phaser.target = this.phaser.text;        
        this.state.width = this.phaser.text.width;
        this.state.height = this.phaser.text.height;
        
    },
    computeDeployment: function (apply) {
        var dep = LightSaber.DisplayObject.prototype.computeDeployment.call(this, apply);
        if (dep.pending.height && this.phaser.text) {
            dep.height = this.phaser.text.height;
            delete dep.pending.height;
        } 
        if (dep.pending.width && this.phaser.text) {
            dep.width = this.phaser.text.width;
            delete dep.pending.width;
        } 
        if (apply) {
            this.state.height = dep.height;
            this.state.width = dep.width;
            this.state.pending = dep.pending;
        }
        console.assert(this.children.length == 0, "ERROR: LightSaber.Text cant manage children (for now)", this.children);
        return dep;
    }
});