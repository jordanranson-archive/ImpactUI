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
    
    // Initialization
    self.init = function() {
        
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
    
    
    // Add a component
    self.addComponent = function(component) {
        self.components.push(component);
        $(".component").draggable({ 
            containment: ".editor-window", 
            scroll: false,
            grid: [ 8, 8 ]
        });
    };
    
    
    // Displays a models properties in the side bar
    self.displayProperties = function(component, event) {
        var model = component === false ? self.panel : component;
        var properties = [];
        var row;
        
        for (var key in model) {
            if(key !== "id" && key !== "type") {
                row = { key: key, value: ko.observable(model[key]) };
                properties.push(row);
            }
        }
        
        self.properties(properties);
        
        var $tar = $(event.delegateTarget);
        $tar.closest("div").find("li").removeClass("selected");
        $tar.addClass("selected");
    };
    
    
    self.init();
}


// On page ready
$(function() {
    var app = new App();
    ko.applyBindings(app);
    
    $(".component").draggable({ 
        containment: ".editor-window", 
        scroll: false,
        grid: [ 8, 8 ]
    });
});