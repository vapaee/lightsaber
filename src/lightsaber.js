function LightSaber(settings) {
    this.init(settings);
};

LightSaber.utils = {};
LightSaber.utils.$ = window.$ 
    || window.jQuery 
    || (typeof angular != "undefined" ? angular.element : null)
    || (typeof jwk != "undefined" ? jwk.query : null)
    || window.TreeQuery;
LightSaber.utils.Deferred = LightSaber.utils.$.Deferred 
    || (typeof jwk != "undefined" ? jwk.Deferred : null);    
LightSaber.utils.extend = LightSaber.utils.$.extend 
    || (typeof angular != "undefined" ? angular.extend : null)
    || (typeof jwk != "undefined" ? jwk.extend : null);    
LightSaber.utils.mapping = (typeof jwk != "undefined" ? jwk.Node : null);

LightSaber.prototype = {
    constructor: LightSaber,
    tweenable_properties: {
        alpha: true
    },
    init:function (settings) {
        var defaults = {
            height:300,
            width:400,
            container_id:'',
            full_document: true,
            auto_resize: true,
            section: "/",
            callbacks: {}
        }
        
        for (var prop in settings) {
            if (typeof settings[prop] == "function") {
                defaults.callbacks[prop] = settings[prop];
                delete settings[prop];
            }
        }
        
        this.settings = LightSaber.utils.extend(defaults, settings);                
        if (this.settings.spec) this.createEngine(this.settings);
        
    },
    createEngine: function (settings) {
        var saber = this;        
        this.clear();
        this.engine = new LightSaber.Engine(settings, saber);
        this.engine.start().done(function (){            
            if (saber.settings.auto_resize) {
                saber.engine.game.renderer.autoResize = true;
                window.onresize = saber.resize.bind(saber);                            
                saber.enter_section(saber.settings.section);
            }            
        });
    },
    clear: function () {
    },
    resize :function () {        
        var height, width;
        if (this.settings.full_document) {
            height = window.innerHeight;
            width = window.innerWidth;
        } else {
            var $obj = LightSaber.utils.$("#" + this.settings.container_id);
            if ($obj.length > 0) {
                height = $obj.height();
                width = $obj.width();
            }            
        }
        
        if (this.engine) this.engine.resize(width, height);
    },
    enter_section: function (section) {
        console.log("enter_section ->", section);
        this._section = section;
        this.updateSpec();
        this.resize();
    },
    updateSpec: function (spec) {
        if (this.engine) this.engine.updateSpec();
    },
    // -------------------------------------------------------
    
    create_handler: function (event_name) {
        var saber = this;
        return function (target, pointer) {
            console.assert(target._ls_ref)
            switch(target._ls_ref.spec[event_name].handler) {
                case "scene-enter-section":
                    saber.enter_section(target._ls_ref.spec[event_name].params);
                    break;
                default:
                    console.error("ERROR", target, event_name, pointer);                    
            }
        }
    },
    extend_spec: function (spec) {
        var self = this;
        var obj = LightSaber.utils.extend({}, spec);
        var class_list = [];
        
        if (spec.class) {
            if (typeof spec.class == "string") {
                spec.class = spec.class.split(" ");
            }
            console.assert(Array.isArray(spec.class), spec.class);
            console.assert(this.settings.spec.class, this.settings.spec.class);
            for (var i in spec.class) {
                var _class_name = spec.class[i];
                var _class_spec = this.settings.spec.class[_class_name];
                var _class_final = this.extend_spec(_class_spec);
                obj = LightSaber.utils.extend(obj, _class_final);
                class_list.push(_class_name);
            }
            obj.class = class_list;
        }
        
        if (spec.name && this._section && this.settings.spec.scene.sections) {
            
            function section_iterate(_section, callback) {
                if (_section == "/") {
                    callback(_section);
                } else {
                    var list = _section.split("/");
                    list.pop();
                    var newsection = list.join("/");
                    if (newsection == "") newsection = "/";
                    section_iterate(newsection, callback);
                    callback(_section);
                }
            }

            section_iterate(this._section, function (path) {
                // console.log("section_iterate() ---> ", path);
                var sec = self.settings.spec.scene.sections[path];
                if (sec && sec[spec.name]) {
                    var _section_spec = sec[spec.name];
                    _section_spec = self.extend_spec(_section_spec);
                    obj = LightSaber.utils.extend(obj, _section_spec);
                }
            });
            
        }
        return obj;
    }
};