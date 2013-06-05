// UI panel
function Panel() {
    var self = this;
    self.id = 0;
    self.type = "panel";
    
    self.name = ko.observable("UI Panel");
    self.width = ko.observable(512);
    self.height = ko.observable(374);
}

// Generic UI element
function Component() {
    var self = this;
    self.id = 0;
    self.type = "none";
    
    self.name = ko.observable("Component");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
}

// Label
function Label() {
    var self = this;
    self.id = 0;
    self.type = "label";
    
    self.name = ko.observable("Label");
    self.text = ko.observable("Label");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
}


// View model
function ViewModel() {
    var self = this;
    self.panel = new Panel();
    self.components = ko.observableArray();
    self.properties = ko.observableArray();
    
    
    // Initialization
    self.init = function() {
        for(var i = 0; i < 4; i++) {
            var c = new Label();
            c.text = ko.observable("butts" + i);
            self.addComponent(c);
        }
    };
    
    
    // Add a component
    self.addComponent = function(component) {
        self.components.push(component);
        $(".component").draggable();
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


$(function() {
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
    
    $(".component").draggable({ 
        containment: ".panel", 
        scroll: false
    });
});