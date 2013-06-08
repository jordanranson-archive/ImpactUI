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
    var self = this;
    self.panel = new Panel();
    self.components = ko.observableArray();
    self.properties = ko.observableArray();
    self.zoom = ko.observable(2);
    
    
    // Initialization
    self.init = function() {
        Mousetrap.bind("del",   self.removeComponent);
    };
    
    
    // Displays a modal dialog
    self.showModal = function(selector) {
        $(".overlay").fadeIn();
        $(".modal").fadeOut();
        $(selector).fadeIn();
    };
    
    
    // Hides all modal dialogs
    self.hideModals = function() {
        $(".overlay").fadeOut();
        $(".modal").fadeOut();
    };
    
    
    // Creates a new component and adds it to the list
    self.createComponent = function(type) {
        var component;
        
        switch(type) {
            case "label": component = new MLabel(); break;
            case "button": component = new MButton(); break;
            case "image": component = new MImage(); break;
            default: component = new MComponent();
        }
        
        self.addComponent(component);
    };
    
    
    // Removes a component
    self.removeComponent = function() {
        self.components.remove(function(item) {
            return item.display.selected() === true;
        });
        self.properties.removeAll();
    };
    
    
    // Add a component
    self.addComponent = function(component) {
        self.components.push(component);
        self.bindjQuery();
        
        for(var i = 0; i < self.components().length; i++) {
            self.components()[i].display.selected(false)
        }
        self.panel.display.selected(false);
        component.display.selected(true);
        self.displayProperties(component);
    };
    
    
    // jQuery crap
    self.bindjQuery = function() {
        $(".component:not(.label)").resizable({
            grid: 4 * self.zoom(),
            resize: function() {
                $(this).css("line-height", $(this).height() + "px");
            }
        });
        $(".component.label").resizable({
            grid: 4 * self.zoom()
        });
        $(".component").draggable({ 
            containment: ".editor-content", 
            scroll: false,
            grid: [ 4 * self.zoom(), 4 * self.zoom() ]
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
    };
    
    
    // Displays a models properties in the side bar
    self.displayProperties = function(component) {
        var model = component === false ? self.panel : component;
        var properties = [];
        var row, type, value;
        
        for (var key in model) {
            if(key !== "id" && key !== "type" && key !== "display") {
                
                if(key === "z") 
                    type = "readonly";
                else if(key === "lineHeight") 
                    type = "lineHeight";
                else if(key === "x" || key === "y" || key === "z") 
                    type = "position";
                else if(key === "width" || key === "height") 
                    type = "size";
                else if(key === "anchor")
                    type = "anchor";
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
        
        self.properties(properties);
        
        // Show selected component
        self.panel.display.selected(false);
        for(var i = 0; i < self.components().length; i++) {
            self.components()[i].display.selected(false);
        }
        model.display.selected(true);
    };
    
    
    self.init();
}


// On page ready
$(function() {
    var app = new App();
    ko.applyBindings(app);
    
    $(".panel")
    .draggable({ 
        scroll: false
    });
});