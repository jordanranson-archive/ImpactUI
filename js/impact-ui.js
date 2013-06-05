// UI panel
function Panel() {
    var self = this;
    
    self.id = 0;
    self.name = ko.observable("UI Panel");
    self.width = ko.observable(512);
    self.height = ko.observable(374);
}

// Generic UI element
function Component() {
    var self = this;
    
    self.id = 0;
    self.name = ko.observable("Component");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
}

// Label
function Label() {
    var self = this;
    
    self.name = "Label";
    self.text = "Label";
}
Label.prototype = new Component();


// View model
function ViewModel() {
    var self = this;
    self.panel = new Panel();
    self.components = ko.observableArray();
    self.properties = ko.observableArray();
    
    
    // Initialization
    self.init = function() {
        for(var i = 0; i < 10; i++) {
            self.addComponent(new Component());
        }
    };
    
    
    // Add a component
    self.addComponent = function(component) {
        self.components.push(component);
    };
    
    
    // Displays a models properties in the side bar
    self.displayProperties = function(panel) {
        var model = panel === true ? self.panel : this;
        var properties = [];
        var row;
        
        for (var key in model) {
            if(key !== "id") {
                row = { key: key, value: model[key] };
                properties.push(row);
            }
        }
        
        self.properties(properties);
    };
    
    
    self.init();
}


$(function() {
    ko.applyBindings(new ViewModel());
});