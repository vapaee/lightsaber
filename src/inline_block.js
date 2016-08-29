LightSaber.InlineBlock = function (game, spec, parent) {    
    LightSaber.DisplayObject.call(this, game, spec, parent);
};

LightSaber.InlineBlock.prototype = LightSaber.utils.extend(Object.create(LightSaber.DisplayObject.prototype), {    
    getType: function () {
        return "InlineBlock";
    },
    create: function () {
        this.phaser.target = this.game.add.image(this.state.x, this.state.y);
        this.phaser.target.anchor.set(0, 0);
        this.phaser.target.scale.set(1, 1);
        this.phaser.target.alpha = 1;
        
        this.phaser.group.addChild(this.phaser.target);                
    },
    computeDeployment: function (apply) {
        console.log("AAAAAAAAAAAAAAAAAa");
        var dep = LightSaber.DisplayObject.prototype.computeDeployment.call(this, apply);        
        if (typeof this.children_absolute == "undefined") {
            this.children_absolute = [];
            this.children_static = [];
            for (var i in this.children_ordered) {
                var ch_state = this.children_ordered[i].computeDeployment(false);
                if (ch_state.pending.y && ch_state.pending.x) {
                    this.children_static.push(this.children[i]);
                } else {
                    this.children_absolute.push(this.children[i]);
                }
            }            
        }
        
        var my = dep;
        if (apply) {
            my = this.state;
        }
        my.lines = [];
        my.line = 0;
        
        // verifico si cada hijo estático entra en el with de su padre.
        // Si no entra, lo coloco en la siguiente linea
        for (var i in this.children_static) {
            var ch = this.children_static[i];
            var ch_state = ch.computeDeployment(apply);
            var new_line = false;
            if (my.lines.length <= my.line) {
                new_line = true;
            } else {
                if (!dep.pending.width && 
                    my.lines[my.line].width + ch_state.width > my.width) {
                        my.line++;
                        new_line = true;                    
                }
            }
            if (new_line) {
                var offset = 0;
                my.lines.map(function (v) { offset += v.height; });                
                my.lines.push({
                    width:ch_state.width,
                    height:ch_state.height,
                    children:[ch],
                    offset:offset
                });
            } else {
                my.lines[my.line].children.push(ch);
                my.lines[my.line].width += ch_state.width;
                my.lines[my.line].height = Math.max(my.lines[my.line].height, ch_state.height);
            }            
            ch.state.line = my.lines.length-1;
            ch.state.line_index = my.lines[ch.state.line].children.length-1;
        }
        
        
        // resuelvo mi w/h según lo que resulte de las lineas formadas por mis hijos estáticos
        for (var i in my.lines) {
            my.width = Math.max(my.width, my.lines[i].width);            
        }
        my.height = 0;
        my.lines.map(function (v) { my.height += v.height; });                

        // re calculo mi posición ahora sabiendo mi tamaño
        var dep = LightSaber.DisplayObject.prototype.computeDeployment.call(this, apply);   
        
        // actualizo la posición de mis hijos estáticos ahora que se mi tamaño y posición
        for (var i in this.children_static) {
            var ch = this.children_static[i];
            var line = my.lines[ch.state.line];
            ch.state.y = my.y + line.offset;
            ch.state.x = my.x;
            for (var j in line.children) {                
                if (j < ch.state.line_index) {
                    ch.state.x += line.children[j].state.width;
                }
            }
        }
        
        // tengo mi estado, ahora mis hijos absolutos pueden resolver su despliegue
        for (var i in this.children_absolute) {
            this.children_absolute[i].computeDeployment(apply);
        }
        
    }
});