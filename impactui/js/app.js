// ImpactUI
//
// Copyright (c) 2013 All Right Reserved, Jordan Ranson - http://www.jordanranson.com/
//
// This source is subject to the GNU General Public License.
// Please see the License.txt file for more information.
// All other rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.



// Impact UI
function App() {
    var app = this;
    app.panel = new Panel();
    app.sliceModal = new SliceModal();
    app.components = ko.observableArray();
    app.properties = ko.observableArray();
    app.zoom = ko.observable(2);
    app.showGrid = ko.observable(true);
    
    // UI panel
    function Panel() {
        var self = this;
        self.id = 0;
        self.type = "panel";
        
        self._impactui = {};
        self._impactui.selected = ko.observable(false);
        
        self.name = ko.observable("UI Panel");
        self.z = ko.observable(0);
        self.width = ko.observable(512);
        self.height = ko.observable(374);
        
        self.backgroundColor = ko.observable("transparent");
    }

    // Generic UI element
    function MComponent() {
        var self = this;
        self.id = 0;
        self.type = "none";

        self._impactui = {};
        self._impactui.selected = ko.observable(false);
        
        self.name = ko.observable("Component");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.anchor = ko.observable("center-center");
        
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
    }

    // Label
    function MLabel() {
        var self = this;
        self.id = 0;
        self.type = "label";
        
        self.name = ko.observable("Label");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(32);
        self.height = ko.observable(12);
        self.anchor = ko.observable("center-center");
        
        self.text = ko.observable("Label");
        self.font = ko.observable("04b03");
        self.color = ko.observable("#f0f0f0");
        self.textShadow = ko.observable("1px 1px #222");
        self.textAlign = ko.observable("left");
        self.lineHeight = ko.observable(1.6);
        
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
        
        
        // Web app specific parameters
        self._impactui = {};
        self._impactui.selected = ko.observable(false);
        self._impactui.left = ko.computed(function() {
            return ((Number(self.originX()) + Number(self.x())) * app.zoom()) + 'px'
        });
        self._impactui.top = ko.computed(function() {
            return ((Number(self.originY()) + Number(self.y())) * app.zoom()) + 'px'
        });
        self._impactui.textShadow = ko.computed(function() {
            var str = self.textShadow().split(" ");
            var shadow = (Number(str[0].replace("px","")) * app.zoom()) + "px " +
                         (Number(str[1].replace("px","")) * app.zoom()) + "px " +
                         str[2]
            return shadow;
        });
    }

    // Button
    function MButton() {
        var self = this;
        self.id = 0;
        self.type = "button";
        
        self.name = ko.observable("Button");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(48);
        self.height = ko.observable(16);
        self.anchor = ko.observable("center-center");
        
        self.text = ko.observable("Button");
        self.font = ko.observable("04b03");
        self.color = ko.observable("#f0f0f0");
        self.textShadow = ko.observable("1px 1px #222");
        
        self.imagePath = ko.observable("media/ui/");
        self.imageMode = ko.observable("none");
        self.slices = ko.observableArray([4,4,12,12]);
        
        self.focused = ko.observable("");
        self.blurred = ko.observable("");
        self.pressed = ko.observable("");
        
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
        
        
        // Web app specific parameters
        self._impactui = {};
        self._impactui.flag1 = ko.observable(0);
        self._impactui.slices = [0,0];
        self._impactui.selected = ko.observable(false);
        self._impactui.image = new Image();
        
        self._impactui.left = ko.computed(function() {
            return ((Number(self.originX()) + Number(self.x())) * app.zoom()) + 'px'
        });
        
        self._impactui.top = ko.computed(function() {
            return ((Number(self.originY()) + Number(self.y())) * app.zoom()) + 'px'
        });
        
        self._impactui.textShadow = ko.computed(function() {
            var str = self.textShadow().split(" ");
            
            // Invalid string or "none"
            if(str.length !== 3 || self.textShadow() === "none")
                return "none";
            
            var shadow = (Number(str[0].replace("px","")) * app.zoom()) + "px " +
                         (Number(str[1].replace("px","")) * app.zoom()) + "px " +
                         str[2]
            return shadow;
        });
        
        self._impactui.backgroundUrl = function (position) {
            var src = self._impactui.image.src;
            
            if(position !== "all" && (self.imageMode() === "sliceTile" || self.imageMode() === "sliceStretch")) {
                var anchor = position.split("-");
                var zoom = 4;
                
                var origImg = self._impactui.image;
                var origCvs = document.createElement("canvas");
                    origCvs.width = origImg.width;
                    origCvs.height = origImg.height;
                var origCtx = origCvs.getContext("2d");
                
                var slicedCvs = document.createElement("canvas");
                var slicedCtx = slicedCvs.getContext("2d");
                var x, y, w, h;
                
                // Three slice points for the x axis
                var x1 = self.slices()[0]*zoom;
                var x2 = origImg.width - self.slices()[2]*zoom;
                var x3 = origImg.width - (x1 + x2);
                
                // Three slice points for the y axis
                var y1 = self.slices()[1]*zoom;
                var y2 = origImg.height - self.slices()[3]*zoom;
                var y3 = origImg.height - (y1 + y2);
                
                if(anchor[1] === "left") {
                    x = 0;
                    w = x1;
                }
                if(anchor[1] === "center") {
                    x = self.slices()[0]*zoom;
                    w = x3;
                    
                    self._impactui.slices[0] = w;
                }
                if(anchor[1] === "right") {
                    x = self.slices()[2]*zoom;
                    w = x2;
                }
                
                if(anchor[0] === "top") {
                    y = 0;
                    h = y1;
                }
                if(anchor[0] === "center") {
                    y = self.slices()[1]*zoom;
                    h = y3;
                    
                    self._impactui.slices[1] = h;
                }
                if(anchor[0] === "bottom") {
                    y = self.slices()[3]*zoom;
                    h = y2;
                }
                
                slicedCvs.width = w;
                slicedCvs.height = h;
                slicedCtx.drawImage(origImg, x, y, w, h, 0, 0, w, h);
                
                src = slicedCvs.toDataURL();
            }
            
            return "url('"+src+"')";
        }
        
        self._impactui.backgroundImage = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("all");
        });
        
        self._impactui.backgroundImageTL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-left");
        });
        
        self._impactui.backgroundImageTR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-right");
        });
        
        self._impactui.backgroundImageTC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-center");
        });
        
        self._impactui.backgroundImageCL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-left");
        });
        
        self._impactui.backgroundImageCR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-right");
        });
        
        self._impactui.backgroundImageCC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-center");
        });
        
        self._impactui.backgroundImageBL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-left");
        });
        
        self._impactui.backgroundImageBR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-right");
        });
        
        self._impactui.backgroundImageBC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-center");
        });
        
        self._impactui.backgroundSize = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceStretch" || self.imageMode() === "sliceTile") {
                return "100% 100%";
            }
            
            return ((self._impactui.image.width / 4)  * app.zoom()) + "px " + 
                   ((self._impactui.image.height / 4) * app.zoom()) + "px";
        });
        
        self._impactui.backgroundSizeTileX = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return ((self._impactui.slices[0] / 4) * app.zoom()) + "px 100%";
            }
            
            return "100% 100%";
        });
        
        self._impactui.backgroundSizeTileY = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return "100% " + ((self._impactui.slices[1] / 4) * app.zoom()) + "px";
            }
            
            return "100% 100%";
        });
        
        self._impactui.backgroundSizeTile = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return ((self._impactui.slices[0] / 4) * app.zoom()) + "px " + ((self._impactui.slices[1] / 4) * app.zoom()) + "px";
            }
            
            return "100% 100%";
        });
        
        
        // Subscriptions
        self.imagePath.subscribe(function(value) {
            var image = new Image();
            
            image.onload = function() {
                var zoom = 4;
                
                var originalCvs = document.createElement('canvas');
                originalCvs.width = this.width;
                originalCvs.height = this.height;
                
                var scaledCvs = document.createElement('canvas');
                scaledCvs.width = this.width*zoom;
                scaledCvs.height = this.height*zoom;
                
                // Create an offscreen canvas, draw an image to it, and fetch the pixels
                var originalCtx = originalCvs.getContext('2d');
                originalCtx.drawImage(this, 0, 0);
                var imgData = originalCtx.getImageData(0, 0, this.width, this.height).data;

                // Draw the zoomed-up pixels to a different canvas context
                var scaledCtx = scaledCvs.getContext('2d');
                for (var x = 0;x < this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        // Find the starting index in the one-dimensional image data
                        var i = (y*this.width + x)*4;
                        var r = imgData[i];
                        var g = imgData[i+1];
                        var b = imgData[i+2];
                        var a = imgData[i+3];
                        scaledCtx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
                        scaledCtx.fillRect(x*zoom,y*zoom,zoom,zoom);
                    }
                }
                
                self._impactui.image.width = scaledCvs.width;
                self._impactui.image.height = scaledCvs.height;
                self._impactui.image.src = scaledCvs.toDataURL();
                
                self._impactui.flag1(self._impactui.flag1() + 1);
            };
            
            image.src = "../" + value;
        });
    }

    // Image
    function MImage() {
        var self = this;
        self.id = 0;
        self.type = "image";
        
        self.name = ko.observable("Image");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(96);
        self.height = ko.observable(96);
        self.anchor = ko.observable("center-center");
        
        self.imagePath = ko.observable("media/ui/");
        self.imageMode = ko.observable("none");
        self.slices = ko.observableArray([4,4,12,12]);
        
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
        
        
        // Web app specific parameters
        self._impactui = {};
        self._impactui.flag1 = ko.observable(0);
        self._impactui.slices = [0,0];
        self._impactui.selected = ko.observable(false);
        self._impactui.image = new Image();
        
        self._impactui.left = ko.computed(function() {
            return ((Number(self.originX()) + Number(self.x())) * app.zoom()) + 'px'
        });
        
        self._impactui.top = ko.computed(function() {
            return ((Number(self.originY()) + Number(self.y())) * app.zoom()) + 'px'
        });
        
        self._impactui.backgroundUrl = function (position) {
            var src = self._impactui.image.src;
            
            if(position !== "all" && (self.imageMode() === "sliceTile" || self.imageMode() === "sliceStretch")) {
                var anchor = position.split("-");
                var zoom = 4;
                
                var origImg = self._impactui.image;
                var origCvs = document.createElement("canvas");
                    origCvs.width = origImg.width;
                    origCvs.height = origImg.height;
                var origCtx = origCvs.getContext("2d");
                
                var slicedCvs = document.createElement("canvas");
                var slicedCtx = slicedCvs.getContext("2d");
                var x, y, w, h;
                
                // Three slice points for the x axis
                var x1 = self.slices()[0]*zoom;
                var x2 = origImg.width - self.slices()[2]*zoom;
                var x3 = origImg.width - (x1 + x2);
                
                // Three slice points for the y axis
                var y1 = self.slices()[1]*zoom;
                var y2 = origImg.height - self.slices()[3]*zoom;
                var y3 = origImg.height - (y1 + y2);
                
                if(anchor[1] === "left") {
                    x = 0;
                    w = x1;
                }
                if(anchor[1] === "center") {
                    x = self.slices()[0]*zoom;
                    w = x3;
                    
                    self._impactui.slices[0] = w;
                }
                if(anchor[1] === "right") {
                    x = self.slices()[2]*zoom;
                    w = x2;
                }
                
                if(anchor[0] === "top") {
                    y = 0;
                    h = y1;
                }
                if(anchor[0] === "center") {
                    y = self.slices()[1]*zoom;
                    h = y3;
                    
                    self._impactui.slices[1] = h;
                }
                if(anchor[0] === "bottom") {
                    y = self.slices()[3]*zoom;
                    h = y2;
                }
                
                slicedCvs.width = w;
                slicedCvs.height = h;
                slicedCtx.drawImage(origImg, x, y, w, h, 0, 0, w, h);
                
                src = slicedCvs.toDataURL();
            }
            
            return "url('"+src+"')";
        }
        
        self._impactui.backgroundImage = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("all");
        });
        
        self._impactui.backgroundImageTL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-left");
        });
        
        self._impactui.backgroundImageTR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-right");
        });
        
        self._impactui.backgroundImageTC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("top-center");
        });
        
        self._impactui.backgroundImageCL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-left");
        });
        
        self._impactui.backgroundImageCR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-right");
        });
        
        self._impactui.backgroundImageCC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("center-center");
        });
        
        self._impactui.backgroundImageBL = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-left");
        });
        
        self._impactui.backgroundImageBR = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-right");
        });
        
        self._impactui.backgroundImageBC = ko.computed(function() {
            self._impactui.flag1();
            return self._impactui.backgroundUrl("bottom-center");
        });
        
        self._impactui.backgroundSize = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceStretch" || self.imageMode() === "sliceTile") {
                return "100% 100%";
            }
            
            return ((self._impactui.image.width / 4)  * app.zoom()) + "px " + 
                   ((self._impactui.image.height / 4) * app.zoom()) + "px";
        });
        
        self._impactui.backgroundSizeTileX = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return ((self._impactui.slices[0] / 4) * app.zoom()) + "px 100%";
            }
            
            return "100% 100%";
        });
        
        self._impactui.backgroundSizeTileY = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return "100% " + ((self._impactui.slices[1] / 4) * app.zoom()) + "px";
            }
            
            return "100% 100%";
        });
        
        self._impactui.backgroundSizeTile = ko.computed(function() {
            self._impactui.flag1();
            
            if(self.imageMode() === "sliceTile") {
                return ((self._impactui.slices[0] / 4) * app.zoom()) + "px " + ((self._impactui.slices[1] / 4) * app.zoom()) + "px";
            }
            
            return "100% 100%";
        });
        
        
        // Subscriptions
        self.imagePath.subscribe(function(value) {
            var image = new Image();
            
            image.onload = function() {
                var zoom = 4;
                
                var originalCvs = document.createElement('canvas');
                originalCvs.width = this.width;
                originalCvs.height = this.height;
                
                var scaledCvs = document.createElement('canvas');
                scaledCvs.width = this.width*zoom;
                scaledCvs.height = this.height*zoom;
                
                // Create an offscreen canvas, draw an image to it, and fetch the pixels
                var originalCtx = originalCvs.getContext('2d');
                originalCtx.drawImage(this, 0, 0);
                var imgData = originalCtx.getImageData(0, 0, this.width, this.height).data;

                // Draw the zoomed-up pixels to a different canvas context
                var scaledCtx = scaledCvs.getContext('2d');
                for (var x = 0;x < this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        // Find the starting index in the one-dimensional image data
                        var i = (y*this.width + x)*4;
                        var r = imgData[i];
                        var g = imgData[i+1];
                        var b = imgData[i+2];
                        var a = imgData[i+3];
                        scaledCtx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
                        scaledCtx.fillRect(x*zoom,y*zoom,zoom,zoom);
                    }
                }
                
                self._impactui.image.width = scaledCvs.width;
                self._impactui.image.height = scaledCvs.height;
                self._impactui.image.src = scaledCvs.toDataURL();
                
                self._impactui.flag1(self._impactui.flag1() + 1);
            };
            
            image.src = "../" + value;
        });
    }
    
    
    
    // Slice modal
    function SliceModal() {
        var self = this;
        self.component = ko.observable(null);
    }
    
    
    // Initialization
    app.init = function() {
        Mousetrap.bind("del",   app.removeComponent);
    };
    
    
    // Finds the draw offset for computed observables
    app.drawOffset = function(anchor, pos, panel, direction) {
        if(direction) {
            switch(anchor) {
                case "top":
                    return Number(pos);
                case "center":
                    return Number(pos) + Number(panel) * 0.5;
                case "bottom":
                    return Number(pos) + Number(panel);
            }
        } else {
            switch(anchor) {
                case "left":
                    return Number(pos);
                case "center":
                    return Number(pos) + Number(panel) * 0.5;
                case "right":
                    return Number(pos) + Number(panel);
            }
        }
    };
    
    
    // Displays a modal dialog
    app.showModal = function(selector) {
        app.bindjQuery();
        $(".overlay").fadeIn();
        $(".modal").fadeOut();
        $(selector).fadeIn();
    };
    
    
    // Displays the slice modal dialog
    app.showSliceModal = function() {
        if(app.getSelected()._impactui.image.width > 0) {
            app.sliceModal.component(app.getSelected());
            app.showModal('.nineslice');
        } else {
            alert("No image set.");
        }
    };
    
    
    // Hides all modal dialogs
    app.hideModals = function() {
        $(".overlay").fadeOut();
        $(".modal").fadeOut();
    };
    
    
    // Creates a new component and adds it to the list
    app.createComponent = function(type) {
        var component;
        
        switch(type) {
            case "label": component = new MLabel(); break;
            case "button": component = new MButton(); break;
            case "image": component = new MImage(); break;
            default: component = new MComponent();
        }
        
        app.align(component);
        app.addComponent(component);
    };
    
    
    // Removes a component
    app.removeComponent = function() {
        app.components.remove(function(item) {
            return item._impactui.selected() === true;
        });
        app.properties.removeAll();
    };
    
    
    // Aligns the component to the grid
    app.align = function(component) {  
    
        var anchor = component.anchor().split("-");
        component.x(0);
        component.y(0);
        
        // Finds remainder 
        if(app.panel.width / 16 % 1 !== 1 && (anchor[1] === "center" || anchor[1] === "right")) {
            component.x((app.panel.width() / 16 % 1) * 16);
        }
        
        if(app.panel.height / 16 % 1 !== 1 && (anchor[0] === "center" || anchor[0] === "bottom")) {
            component.y((app.panel.height() / 16 % 1) * 16);
        }
    };
    
    
    // Realigns the component to the grid
    app.realign = function() {
        app.align(app.getSelected());
        return true;
    };
    
    
    // Add a component
    app.addComponent = function(component) {
        app.components.unshift(component);
        app.bindjQuery();
        
        for(var i = 0; i < app.components().length; i++) {
            app.components()[i]._impactui.selected(false)
        }
        app.panel._impactui.selected(false);
        component._impactui.selected(true);
        app.displayProperties(component);
    };
    
    
    // Updates a component when moved in the gui
    app.updateComponent = function() {
        var component = app.getSelected();
        var $tar = $(".component.selected");
        
        if($tar.length > 0) {
            var pos = $tar.position();
            var w = $tar.width();
            var h = $tar.height();
            
            component.x((pos.left / app.zoom()) - component.originX());
            component.y((pos.top / app.zoom()) - component.originY());
            component.width(w / app.zoom());
            component.height(h / app.zoom());
            
            app.bindjQuery();
        }
    },
    
    
    // Updates the slices of a component
    app.updateSlices = function() {
        var component = app.getSelected();
        
        var x1 = $(".slice-left").position().left / 4;
        var y1 = $(".slice-top").position().top / 4;
        var x2 = $(".slice-right").position().left / 4;
        var y2 = $(".slice-bottom").position().top / 4;
        
        component.slices([x1, y1, x2, y2]);
    },
    
    
    // Gets the currently selected component
    app.getSelected = function() {
        for(var i = 0; i < app.components().length; i++) {
            if(app.components()[i]._impactui.selected() === true) {
                return app.components()[i];
            }
        }
        
        return null;
    };
    
    
    // jQuery crap
    app.bindjQuery = function() {
        $(".component:not(.label)").resizable({
            grid: 4 * app.zoom(),
            resize: function() {
                $(this).css("line-height", $(this).height() + "px");
            }
        });
        
        $(".component.label").resizable({
            grid: 4 * app.zoom()
        });
        
        $(".component").draggable({ 
            containment: ".editor-content", 
            scroll: false,
            grid: [ 4 * app.zoom(), 4 * app.zoom() ]
        });
        
        $(".components-list").sortable({
            axis: "y",
            stop: function() {
                var len = $(".components-list").length;
                $(".components-list li").each(function(i) {
                    $(this).find("input").val(i);
                    $(this).find("input").trigger("change");
                });
            }
        });
        
        var len = $(".components-list").length;
        $(".components-list li").each(function(i) {
            $(this).find("input").val(i);
            $(this).find("input").trigger("change");
        });
        
        $(".slice-left,.slice-right")
        .draggable({
            scroll: false,
            axis: "x",
            containment: "parent",
            grid: [4, 4],
            stop: app.updateSlices
        });
        
        $(".slice-bottom,.slice-top")
        .draggable({
            scroll: false,
            axis: "y",
            containment: "parent",
            grid: [4, 4],
            stop: app.updateSlices
        });
    };
    
    
    // Displays a models properties in the side bar
    app.displayProperties = function(component) {
        var model = component === false ? app.panel : component;
        var properties = [];
        var row, type, value;
        var hiddenKeys = [
            "id",
            "type",
            "_impactui",
            "originX",
            "originY"
        ];
        
        for (var key in model) {
            // Hide certain keys
            var hidden = false;
            for(var i = 0; i < hiddenKeys.length; i++) {
                if(hiddenKeys[i] === key) {
                    hidden = true;
                    break;
                }
            }
            
            if(!hidden) {
                if(key === "z") 
                    type = "readonly";
                else if(key === "lineHeight" || key === "anchor" || key === "textAlign" || key === "slices" || key === "imageMode") 
                    type = key;
                else if(key === "x" || key === "y" || key === "z") 
                    type = "position";
                else if(key === "width" || key === "height") 
                    type = "size";
                else 
                    type = "string";
                
                row = { 
                    key: key, 
                    value: model[key],
                    type: type
                };
                properties.push(row);
            }
        }
        
        app.properties(properties);
        
        // Show selected component
        app.panel._impactui.selected(false);
        for(var i = 0; i < app.components().length; i++) {
            app.components()[i]._impactui.selected(false);
        }
        model._impactui.selected(true);
    };
    
    
    // Serializes data for saving
    app.toJSON = function() {
        var data = [];
        var panel = app.panel;
        var components = app.components();
        
        for(prop in panel) {
            if(prop === "_impactui") {
                delete panel[prop];
            }
        }
        data.push(panel);
        
        for(var i = 0; i < components.length; i++) {
            for(prop in components[i]) {
                if(prop === "_impactui") {
                    delete components[i][prop];
                }
            }
        }
        data.push(components);
        
        return ko.toJSON(data);
    };
    
    
    // Saves a file
    app.save = function() {
        
    };
    
    
    // Loads a file
    app.load = function() {
        var data = '[{"id":0,"type":"panel","name":"UI Panel","z":0,"width":"256","height":"128","backgroundColor":"transparent"},[{"id":0,"type":"image","name":"Image","x":-120,"y":-56,"z":"2","width":240,"height":112,"anchor":"center-center","imagePath":"media/ui/btn4.png","imageMode":"sliceTile","slices":[6,6,10,10],"originX":128,"originY":64},{"id":0,"type":"button","name":"Button","x":8,"y":20,"z":"0","width":100,"height":24,"anchor":"center-center","text":"This is a button","font":"04b03","color":"#f0f0f0","textShadow":"1px 1px #222","imagePath":"media/ui/btn3.png","imageMode":"sliceTile","slices":[6,6,10,10],"focused":"","blurred":"","pressed":"","originX":128,"originY":64},{"id":0,"type":"label","name":"Label","x":-108,"y":-44,"z":"1","width":52,"height":20,"anchor":"center-center","text":"Label text","font":"04b03","color":"#000","textShadow":"1px 1px #fff","textAlign":"left","lineHeight":1.6,"originX":128,"originY":64}]]';
        var json = JSON.parse(data);
        
        // Load panel
        var viewModel = ko.mapping.fromJS(json[0], Panel);
        viewModel._impactui = (new Panel())._impactui;
        app.panel = viewModel;
        
        // Load components
        app.components([]);
        for(var i = 0; i < json[1].length; i++) {
            var c = json[1][i];
            var view = MComponent;
            
            switch(c.type) {
                case "label": view = MLabel;
                case "button": view = MButton;
                case "image": view = MImage;
            }
            
            viewModel = ko.mapping.fromJS(json[1][i], view);
            viewModel._impactui = (new view())._impactui;
            app.components.push(viewModel);
        }
        //console.log(app.components);
    };
    
    
    app.init();
}


// On page ready
var application;
$(function() {
    application = new App();
    ko.applyBindings(application);
    application.bindjQuery();
    
    document.body.addEventListener("mouseup", function() {
        application.updateComponent();
        
        return true;
    }, true);
    
    $(".panel")
    .draggable({ 
        scroll: false
    });
});