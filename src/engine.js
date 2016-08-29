LightSaber.Engine = function (settings, saber) {
    this._container_id = settings.container_id;
    this._spec = settings.spec;
    this._callbacks = settings.callbacks;
    this._boot_deferred = LightSaber.utils.Deferred();
    this._boot_deferred_pending = true;
    this.saber = saber;
    
    var self = this;
    this._boot_deferred.promise().done(function(){
        self._boot_deferred_pending = false;
    });
    
    if (document.getElementById(this._container_id)) {
        this._size = {height: "100%", width: "100%"}
    } else {
        this._size = {height: settings.height, width: settings.width}
    }
};
LightSaber_Engine_prototype = {
    constructor: LightSaber.Engine,
    resize:function (width, height) {        
        var bounds = new Phaser.Rectangle(0, 0, width, height);
        
        var $obj = LightSaber.utils.$("#" + this._container_id);
        if ($obj.length > 0) {
            var pos = $obj.css("position");
            if (pos == "absolute") {                
                this.game.renderer.view.style.position = "absolute";
                this.game.renderer.view.style.top = "0px";
                this.game.renderer.view.style.left = "0px";
            } else {
                this.game.renderer.view.style.position = "relative";
                this.game.renderer.view.style.height = "100%";
                this.game.renderer.view.style.width = "100%";
                
                // Si el container tiene padding o algun otro modificador puede que el tamaño interno real sea diferente del calculado
                var computed_style = window.getComputedStyle( this.game.renderer.view );
                height = parseInt(computed_style.height);
                width = parseInt(computed_style.width);
            }
        } else {
            this.game.renderer.view.style.position = "absolute";
            this.game.renderer.view.style.top = "0px";
            this.game.renderer.view.style.left = "0px";
            this.game.renderer.view.style.height = height + "px";
            this.game.renderer.view.style.width = width + "px";
        }
        if (pos != "relative" || pos != "absolute") {
            $obj.css("position", "relative");
        }            

        this.game.renderer.resize(width, height);
        if (this.game.renderType === 1) {
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        }
        this.game.camera.setSize(width, height);
        this.game.camera.bounds = bounds;
        this.game.world.bounds = bounds;
        this.game.width = width;
        this.game.height = height;           
        if (this.scene) this.scene.resize();
        this.game.raf.updateRAF(this.game.time.time);
    },
    start: function () {
        this.game = new Phaser.Game(this._size.width, this._size.height, Phaser.AUTO, this._container_id);        
        this.game.saber = this.saber;
        this.game.state.add( 'LightSaber', this );
        this.game.state.start( 'LightSaber' );        
        return this._boot_deferred.promise();
    },
    preload: function () {        
        for (var type in this._spec.preload) {
            switch (type) {
                case "image":
                    for (var name in this._spec.preload[type]) {
                        this.game.load.image(name, this._spec.preload[type][name]);
                    }
                    break;
                case "bitmapFont":
                    for (var name in this._spec.preload[type]) {                        
                        this.game.load.bitmapFont(name, this._spec.preload[type][name].texture, this._spec.preload[type][name].xml);
                    }
                    break;
                default:
                    console.error("ERROR: unknown type: ", type);
            }
        }        
    },
    updateSpec:function () {
        if (this.scene) this.scene.updateSpec();
    },    
    createScene:function () {        
        this.scene = new LightSaber.Scene(this.game, this._data.scene);
        this.scene.createGraphics();
    },
    parse_gamejson:function (gamejson) {
        this._data = gamejson;
        if (typeof this._data == "string") {
            try {
                this._data = JSON.parse(this._data);
            } catch(e) {
                console.error("ERROR: gamejson must be a plane map object or a valid json string. ", gamejson);
                return false;
            }
        }
        return true;
    },  
    create: function () {
        if (this.parse_gamejson(this._spec)) {
            console.assert(this._data, "ERROR: this._data not set");
            this.createScene();            
        } else {
            console.warn("WARNING: this._data not set properly");
        };
        if (typeof this._callbacks.create == "function") {
            this._callbacks.create(this.game);
        }
    },
    render: function () {
        //console.log("render()");        
        if (typeof this._callbacks.render == "function") {
            this._callbacks.render(this.game);            
        }        
    },
    update: function (delta) {
        //console.log("update()");
        if (this.scene) this.scene.doUpdate(delta);
        if (this._boot_deferred_pending) this._boot_deferred.resolve();
        if (typeof this._callbacks.update == "function") {
            this._callbacks.update(this.game);            
        }        
    }
};
LightSaber.Engine.prototype = LightSaber_Engine_prototype;