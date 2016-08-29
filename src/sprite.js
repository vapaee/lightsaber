LightSaber.Sprite = function (game, spec, parent) {
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.Sprite.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    getType: function () {
        return "Sprite";
    },
    create: function () {        
        //this.game.add.existing(this.phaserObj);    
        var target = this.game.add.sprite(this.state.x, this.state.y, this.spec.texture);
        target.anchor.set(0, 0);
        target.scale.set(1, 1);
        target.alpha = 1;
        
        this.phaser.target = target;
        this.phaser.group.addChild(target);        
        
        this.texture_size = {h:target.texture.height, w: target.texture.width};
        this.aspectRatio = this.texture_size.w / this.texture_size.h;        
        
        if (this.spec["texture-size"] == "cover") {
            var target = this.phaser.target;

            this.initsize = 100;
            var mask = this.game.add.graphics(0, 0);
            this.phaser.target.mask = mask;
            mask.beginFill(0xffffff);
            mask.drawRect(0, 0, this.initsize, this.initsize);
            mask.endFill();        
            this.phaser.group.addChild(this.phaser.target);        
            this.mask = mask;
        }

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
    }  ,  
    
    computeDeployment: function (apply) {    
        var dep = LightSaber.DisplayObject.prototype.computeDeployment.call(this, apply);        
        var temp, percent;    
        var size = this.spec["texture-size"];
        if (this.aspectRatio) {            
            switch (size) {
                case "cover":
                    dep.mask = {x:dep.x,y:dep.y,width:dep.width,height:dep.height};            
                    if (this.aspectRatio <= dep.width / dep.height) {
                        temp = dep.width / this.aspectRatio;
                        percent = 0.5 * (temp-dep.height)/temp;
                        dep.y -= 0.5 * (temp-dep.height);
                        dep.height = temp;
                    } else {
                        temp = dep.height * this.aspectRatio;
                        dep.x -= 0.5 * (temp-dep.width);
                        dep.width = temp;
                    }
                    break;
                case "contain":
                    if (this.aspectRatio <= dep.width / dep.height) {
                        temp = dep.height * this.aspectRatio;
                        dep.x += 0.5 * (dep.width-temp);
                        dep.width = temp;
                    } else {
                        temp = dep.width / this.aspectRatio;
                        dep.y += 0.5 * (dep.height - temp); 
                        dep.height = temp;  
                    }
                    break;
                default:
            }    
        }
        
        if (dep.pending.height && this.phaser.target && this.phaser.target.texture) {
            dep.height = this.phaser.target.texture.height;
            delete dep.pending.height;
        } 
        if (dep.pending.width && this.phaser.target && this.phaser.target.texture) {
            dep.width = this.phaser.target.texture.width;
            delete dep.pending.width;
        } 
        if (apply) {
            this.state.height = dep.height;
            this.state.width = dep.width;
            this.state.pending = dep.pending;
        }
        
        if (!this.phaser.target || !this.phaser.target.texture) {
            console.error(this.getName(), "no tengo la textura", dep.width);
        } else {
            console.debug(this.getName(),"ya consegui la textura", dep.width);
        }

        
        if (apply) {
            this.setDeployment(dep);   
        }        
        return dep;
    },
    setDeployment: function (dep) {
        LightSaber.DisplayObject.prototype.setDeployment.call(this, dep);
        this.state.mask = dep.mask;
    },
    
    applyState: function () {        
        LightSaber.DisplayObject.prototype.applyState.call(this);
        if (this.state.mask && this.mask) {
            this.mask.x = this.state.mask.x;
            this.mask.y = this.state.mask.y;
            this.mask.scale.y = this.state.mask.height / this.initsize;
            this.mask.scale.x = this.state.mask.width / this.initsize;
        }
    },
    applyStateSmooth: function () {
        LightSaber.DisplayObject.prototype.applyStateSmooth.call(this);
        if (this.state.mask && this.mask) {
            var mask = {
                x: this.state.mask.x,
                y: this.state.mask.y,
            }, scale = {
                y: this.state.mask.height / this.initsize,
                x: this.state.mask.width / this.initsize
            }
            this.game.add.tween(this.mask).to( mask, this.spec.tween.time, this.spec.tween.ease, true, this.spec.tween.delay);
            this.game.add.tween(this.mask.scale).to( scale, this.spec.tween.time, this.spec.tween.ease, true, this.spec.tween.delay);
        }
        
    }
});