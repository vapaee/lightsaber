/*
LightSaber.DisplayObject = function (game,spec,parent) {
    // console.log("LightSaber.DisplayObject");    
    Phaser.Sprite.call(this, game, 0, 0, spec.texture);
    this.game = game;
    this.spec = spec;
    this.data = spec;
    this.state = {x:0, y:0, width: 123, height: 456};
    this.name = spec.name;
    this.parent = parent;    
    if (parent) {
        // parent.addChild(this);
        this.game.world.addChild(this);
    }
    
    this.subscribeToEvents();
    this.createChildren();
    this.sortChildren();
};
*/
LightSaber.DisplayObject = function (game,spec,parent) {    
    this.init(game,spec,parent);
}

LightSaber.DisplayObject.prototype = {

    constructor: LightSaber.DisplayObject,
    init: function (game, spec, parent) {
        this.initVars(game, spec, parent);        
        this.createChildren();
        this.sortChildren();
    },
    initVars: function (game, spec, parent) {
        this.game = game;
        this.spec = spec;
        this.parent = parent;
        this.data = spec;
        this.state = {x:0, y:0, width: 0, height: 0};
        this.phaser = {};
    },
    doUpdate: function (delta) {
        this.update(delta);
        for (var i in this.children) {
            this.children[i].doUpdate(delta);
        }
    },
    debugPhaser: function () {
        var self = {
            name: this.getName(),
            group: this.phaser.group,
            target: this.phaser.target,
            type: this.getType()
        };
        
        self.children = this.children.map(function (n) { return n.debugPhaser(); });
        return self;
    },
    serialize: function () {
        var self = {
            name: this.spec.name,
            type: this.getType()
        };
        
        for (var i in this) {
            self[i] = this[i];
            if (typeof self[i] == "function") {
                delete self[i];
            }
        }
        
        self.children = this.children.map(function (n) { return n.serialize(); });
        return self;
    },
    getType: function () {
        return "DisplayObject";
    },
    getName: function () {
        return this.spec.name;
    },
    getDependencies: function () {
        var result = [];
        if (this.data.position) {
            result.push(this.data.position.of);
        }
        if (this.data.anchors) {
            for (var i in this.data.anchors) {
                result.push(this.data.anchors[i].of);
            }            
        }        
        return result;
    },
    sortChildren: function () {
        console.assert(this.children, "ERROR: this.children does't exist");
        var index = 0;
        var list = this.children.map(function (n) { return n; }); // copia limpia
        var ready = {};
        var new_order = [];
        var counter = 100;
        while (list.length > 0) {
            if (counter--<0) {
                console.error("ERROR: infinite dependency loop");
                break;
            } 
            var child = list.shift();
            var deps = child.getDependencies();
            console.assert(typeof child.spec.name == "string", "ERROR: child.spec.name is not a string", child);
            ready[child.spec.name] = true;
            for (var i=0; i<deps.length; i++) {
                if (deps[i] == "parent") continue;
                index = deps[i].indexOf("parent.");
                if (index == 0) {
                    var dep = deps[i].substr(7);
                    if (!(dep in ready)) {
                        ready[child.spec.name] = false;
                        list.push(child);
                    }
                }
            }
            if (ready[child.spec.name]) new_order.push(child);
        }
        console.assert(this.children.length == new_order.length, "ERROR: some child lost in the sorting proccess");
        this.children = new_order;
    },
    createChildren: function () {
        console.assert(this.data, "ERROR: this.data does't exist");
        this.children = [];
        for (var name in this.data.children) {   
            var child_spec = this.data.children[name];
            child_spec.name = name;  
            child_spec = this.game.saber.extend_spec(child_spec);
            var child = null;
            var constructor = LightSaber[child_spec.type];
            console.assert(constructor, "ERROR: type not found: ", child_spec.type, [child_spec]);
            child = new constructor(this.game, child_spec, this);         
            this.children.push(child);
        }
    },
    createPhaserGroup: function () {
        this.phaser.group = this.game.add.group();
        this.phaser.group._ls_group = this.getName();        
        if (this.parent) {
            this.parent.phaser.group.addChild(this.phaser.group);
        }        
    },    
    createGraphics: function () {
        //dep = this.computeDeployment(false);
        //this.state = { x:dep.x,y:dep.y,height:dep.height,width:dep.width };
        this.state = this.computeDeployment(false);
        this.createPhaserGroup();
        this.create();
        this.phaser.target._ls_target = this.getName();
        this.phaser.target._ls_ref = this;
        this.subscribeToEvents();
        for (var i in this.children) {
            var child = this.children[i];
            child.createGraphics();
        }
        // this.state = this.computeDeployment();
    },
    subscribeToEvents: function () {
        for (var name in this.spec) {
            var event_spec = this.spec[name];
            switch(name) {
                case "onInputOver":
                case "onInputDown":
                    var handler = this.game.saber.create_handler(name, event_spec);
                    this.phaser.target.inputEnabled = true;
                    this.phaser.target.events[name].add(handler, this);
                    break;
                default:
                    if (name.indexOf("on") == 0) {
                        console.warn("WARNING: if not an event handler, dont use 'on' as a prefix. property found: ", name);
                    }
            }
        }
    },
    updateSpec: function() {
        console.assert(this.children, "ERROR: this.children does't exist");
        this.data = this.game.saber.extend_spec(this.spec);
        for (var prop in this.data) {
            if (prop in this.game.saber.tweenable_properties) {
                if (this.data[prop] != this.state[prop]) {
                    // console.log("Estoy agregando la prop:", prop);
                    this.state[prop] = this.data[prop];
                }
                // console.log(">", this.spec.name, this.state);
            }
        }
        for (var i=0; i<this.children.length; i++) {
            this.children[i].updateSpec();
            // this.children[i].childrenDoCreate();
        }        
    },
    childrenDoCreate: function() {
        console.error("DEPRECATED");
        console.assert(this.children, "ERROR: this.children does't exist");
        for (var i=0; i<this.children.length; i++) {
            this.children[i].create();
            // this.children[i].childrenDoCreate();
        }        
    },
    getChild: function(name) {        
        for (var i=0; i<this.children.length; i++) {
            if (this.children[i].getName() == name) {
                return this.children[i];
            }
        }
        console.error("ERROR: no child with name '"+name+"' was found", this.children);
    },
    translateToCoords: function (str) {
        var x, y, ox, oy;
        console.assert(typeof str == "string", "ERROR: str must be a string. got: ", typeof str);
        var parts = str.split(" ");
        console.assert(parts.length == 2, "ERROR: str MUST have two expresions separated by one space. got: ", str);
        
        switch (parts[0]) {
            case "top":    oy = 0;   break;
            case "middle": oy = 0.5; break;
            case "bottom": oy = 1;   break;
            case "center": oy = 0.5;
                console.error("ERROR: use 'middle' instead of 'center' for vertical aligment");
                break;
            default:
                if (parts[0].indexOf("%") != -1) {
                    oy = parseInt(parts[0].substr(0, parts[0].indexOf("%"))) * 0.01;
                } else {
                    oy = parts[0] / this.state.height;
                }
        }
        
        switch (parts[1]) {
            case "left":   ox = 0;   break;
            case "center": ox = 0.5; break;
            case "right":  ox = 1;   break;
            default:
                if (parts[1].indexOf("%") != -1) {
                    ox = parseInt(parts[1].substr(0, parts[1].indexOf("%"))) * 0.01;
                } else {
                    ox = parts[1] / this.state.width;
                }
        }
        
        x = this.state.x + this.state.width * ox;
        y = this.state.y + this.state.height * oy;        
        return {x:x, y:y, ox:ox, oy:oy};
        
    },
    setDeployment: function (dep) {    
        this.setSize(dep);
        this.setPosition(dep);
    },
    updateDeployment: function () {
        this.state = this.computeDeployment(true);
        return this;
    },
    getPrevChild: function (obj) {
        return this.children[this.children.indexOf(obj)-1];
    },
    getNextChild: function (obj) {
        return this.children[this.children.indexOf(obj)+1];
    },
    getFirstChild: function () {
        return this.children[0];
    },
    getLastChild: function () {
        return this.children[this.children.length-1];
    },
    resolveReference: function (line) {
        var refobj = null;        
        if (line.indexOf("parent.") != -1) {
            refobj = this.parent.getChild(line.substr("parent.".length));
        } else if (line.indexOf("siblings.") != -1) {
            switch (line) {
                case "siblings.prev":
                    refobj = this.parent.getPrevChild(this);
                    break;
                case "siblings.next":
                    refobj = this.parent.getNextChild(this);
                    break;
                case "siblings.first":
                    refobj = this.parent.getFirstChild();
                    break;
                case "siblings.last":
                    refobj = this.parent.getLastChild();
                    break;                    
                default:
                    console.error("ERROR:", line);
            }            
        } else if (line == "parent") {
            refobj = this.parent;
        } 
        return refobj;
    },
    computeDeployment: function (apply) {        
        var result = {
                width: this.state.width,
                height: this.state.height,
                x: this.state.x,
                y: this.state.y
            },
            before = {
                width: this.state.width,
                height: this.state.height
            };
        
        

        if (this.data.anchors) {
            console.assert(this.data.anchors.length == 2, "ERROR: anchors MUST be an array-like object width 2 objects containing {my, at, of} map each");
            var refobj = [this.parent,this.parent],
                index = [],
                my_coords=[],
                at_coords=[];
            
            this.y = this.x = 0;        
            for (var i=0;i<2;i++) {
                refobj[i] = this.resolveReference(this.data.anchors[i].of);
                /*
                index[i] = this.data.anchors[i].of.indexOf("parent.");
                if (index[i] != -1) {
                    refobj[i] = this.parent.getChild(this.data.anchors[i].of.substr("parent.".length));
                }
                */
                my_coords[i] = this.translateToCoords(this.data.anchors[i].my);
                at_coords[i] = refobj[i].translateToCoords(this.data.anchors[i].at);
            }
            
            /*
            // Despeje 
            result.x + result.width * my_coords[0].ox = at_coords[0].x;
            result.x + result.width * my_coords[1].ox = at_coords[1].x;
            
            result.x + result.width * my_coords[0].ox - (result.x + result.width * my_coords[1].ox)= at_coords[0].x - (at_coords[1].x);            
            result.x + result.width * my_coords[0].ox - result.x - result.width * my_coords[1].ox = at_coords[0].x - at_coords[1].x;
            result.width * my_coords[0].ox - result.width * my_coords[1].ox = at_coords[0].x - at_coords[1].x;
            result.width * (my_coords[0].ox - my_coords[1].ox) = at_coords[0].x - at_coords[1].x;
            result.width = (at_coords[0].x - at_coords[1].x) / (my_coords[0].ox - my_coords[1].ox);  <<--- (width)
            
            result.x = at_coords[0].x - result.width * my_coords[0].ox; <<--- (x)
            
            */
            
            result.width  = Math.abs((at_coords[0].x - at_coords[1].x));
            result.x      = at_coords[0].x - result.width * my_coords[0].ox;
            result.height = Math.abs((at_coords[0].y - at_coords[1].y));
            result.y      = at_coords[0].y - result.height * my_coords[0].oy;

        }        
        
        
        calculate_side = function (side, prop, self) {
            if (self.data[prop]) {
                if (typeof self.data[prop] == "string" && self.data[prop].indexOf("%") != -1) {
                    var percent = parseFloat(self.data[prop].substr(0, self.data[prop].indexOf("%")));
                    result[prop] = percent * self.parent.state[side] / 100;
                } else {
                    result[prop] = parseInt(self.data[prop]);
                }
                result[side] = Math.min(result[prop], result[side]);
            }
        }
        
        calculate_side("width","width", this);
        calculate_side("width","maxWidth", this);
        calculate_side("width","minWidth", this);
        
        calculate_side("height","height", this);
        calculate_side("height","maxHeight", this);
        calculate_side("height","minHeight", this);
        
        // el objeto ya tiene que tener seteado su tamaño antes de ejecutar this.translateToCoords(this.data.position.my);
        this.state.width = result.width;
        this.state.height = result.height;
        
        if (this.data.position) {
            console.assert(typeof this.data.position.of == "string", "ERROR: position MUST have a 'of' attribute referencing a valid object");
            console.assert(typeof this.data.position.at == "string", "ERROR: position MUST have a 'at' attribute referencing a valid object");
            var refobj = this.resolveReference(this.data.position.of);
            /*
            var index = this.data.position.of.indexOf("parent.");
            if (index != -1) {
                refobj = this.parent.getChild(this.data.position.of.substr("parent.".length));
            }
            */
            this.state.y = this.state.x = 0;            
            var my_coords = this.translateToCoords(this.data.position.my);
            var at_coords = refobj.translateToCoords(this.data.position.at);
            result.x = at_coords.x - my_coords.x;
            result.y = at_coords.y - my_coords.y;
        }

        if (apply) {
            this.setDeployment(result);
        } else {
            this.state.width = before.width;
            this.state.height = before.height;
        }            
        // console.debug(this.name, result, "this.parent.state.width:", this.parent.state.width);        
        return result;
    },/*
    setBounds: function (bounds) {
        this.setSize(bounds);
        this.setPosition(bounds);
    }, */   
    setSize: function (size) {
        this.state.width  = size.width;
        this.state.height = size.height;
        this._update_state_use_tween = this._update_not_first_time && !isNaN(size.width) && !isNaN(size.height) && this.spec.tween;
        this._update_state = true;
    },
    setPosition: function (pos) {
        this.state.y = pos.y;
        this.state.x = pos.x;
        this._update_state_use_tween = this._update_not_first_time && !isNaN(pos.x) && !isNaN(pos.y) && this.spec.tween;
        this._update_state = true;
    },
    resize: function () {
        this.updateDeployment();
        for (var i in this.children) {
            this.children[i].resize();
        }
    },
    update: function () {
        if (this._update_state) {
            this._update_state = false;
            this._update_not_first_time = true;
            if (this._update_state_use_tween) {
                this.applyStateSmooth();
            } else {                
                this.applyState();
            }
        }
    },
    applyState: function () {
        var state = { width: this.state.width, height: this.state.height, x: this.state.x, y: this.state.y }
        LightSaber.utils.extend(this.phaser.target, state);
    },    
    applyStateSmooth: function () {
        var state = { width: this.state.width, height: this.state.height, x: this.state.x, y: this.state.y }
        var tween = this.game.add.tween(this.phaser.target).to( state, this.spec.tween.time, this.spec.tween.ease, true, this.spec.tween.delay);
    },    
    create: function (){
        console.error(this.getType() + ".create() not found");        
    }
};