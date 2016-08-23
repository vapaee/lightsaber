LightSaber.Sprite = function (game, spec, parent) {
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.Sprite.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {
    getType: function () {
        return "Sprite";
    },
    create: function () {
        console.debug("create()");
        //this.game.add.existing(this.phaserObj);    
        var target = this.game.add.sprite(this.state.x, this.state.y, this.spec.texture);
        target.anchor.set(0, 0);
        target.scale.set(1, 1);
        target.alpha = 1;
        
        this.phaser.target = target;
        this.phaser.group.addChild(target);        
        
        this.texture_size = {h:target.texture.height, w: target.texture.width};
        this.aspectRatio = this.texture_size.w / this.texture_size.h;        
        
        console.log('this.spec["texture-size"]', this.spec["texture-size"]);
        if (this.spec["texture-size"] == "cover") {
            var target = this.phaser.target;
            var mask = this.game.add.graphics(0, 0);
            this.phaser.target.mask = mask;
            mask.beginFill(0xffffff);
            mask.drawRect(0, 0, this.state.width, this.state.height);
            mask.endFill();
            mask.x = this.state.x;
            mask.y = this.state.y;
            mask.width = this.state.width;
            mask.height = this.state.height;
            this.mask = mask;
        }

    },
    computeDeployment: function (apply) {    
        var dep = LightSaber.DisplayObject.prototype.computeDeployment.call(this, false);
        console.debug("Sprite.computeDeployment("+  apply + ")");
        var temp, percent;    
        var size = this.spec["texture-size"];
        if (this.aspectRatio) {            
            switch (size) {
                case "cover":
                    dep.mask = {x:dep.x,y:dep.y,width:dep.width,height:dep.height};            
                    if (this.aspectRatio <= dep.width / dep.height) {
                        temp = dep.width / this.aspectRatio;
                        percent = 0.5 * (temp-dep.height)/temp;
                        // dep.crop = {height:Math.floor(this.texture.h*(1-percent*2))+1};
                        // console.log(dep.crop.height, percent, temp, dep.height);
                        // dep.crop = {height:dep.height};
                        // dep.crop = {y:percent*this.texture.h, height:(1-percent*2) * this.texture.h};
                        dep.y -= 0.5 * (temp-dep.height);
                        dep.height = temp;
                    } else {
                        temp = dep.height * this.aspectRatio;
                        //percent = 0.5 * (temp-dep.width)/temp;
                        //dep.crop = { x:percent*this.texture.w, width:(1-percent*2) * this.texture.w};
                        dep.x -= 0.5 * (temp-dep.width);
                        dep.width = temp;
                    }
                    console.debug("compute mask", dep);
                    break;
                case "contain":
                    if (this.aspectRatio <= dep.width / dep.height) {                
                        temp = dep.height * this.aspectRatio;
                        dep.x += 0.5 * (temp-dep.width);
                        dep.width = temp;
                    } else {
                        temp = dep.width / this.aspectRatio;
                        dep.y += 0.5 * (temp-dep.height);
                        dep.height = temp;  
                    }
                    break;
                default:
            }    
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
        // var state = { width: this.state.width, height: this.state.height, x: this.state.x, y: this.state.y }
        if (this.state.mask && this.mask) {
            LightSaber.utils.extend(this.mask, this.state.mask);
            console.debug("applyState()", [this.state.mask]);            
        }        
    },
    applyStateSmooth: function () {
        /*
        LightSaber.DisplayObject.prototype.applyStateSmooth.call(this);
        var target = this.phaser.target;
        if (this.state.mask && target && target.mask) {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", [target.mask, this.state.mask]);
            var tween = this.game.add.tween(target.mask).to( this.state.mask, this.spec.tween.time, this.spec.tween.ease, true, this.spec.tween.delay);
        }
        */
    }, 
});