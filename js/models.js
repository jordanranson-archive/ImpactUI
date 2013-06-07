// UI panel
function Panel() {
    var self = this;
    self.id = 0;
    self.type = "panel";
    self.display = {};
    self.display.selected = ko.observable(false);
    
    self.name = ko.observable("UI Panel");
    self.width = ko.observable(512);
    self.height = ko.observable(374);
}

// Generic UI element
function MComponent() {
    var self = this;
    self.id = 0;
    self.type = "none";
    self.display = {};
    self.display.selected = ko.observable(false);
    
    self.name = ko.observable("Component");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
}

// Label
function MLabel() {
    var self = this;
    self.id = 0;
    self.type = "label";
    self.display = {};
    self.display.selected = ko.observable(false);
    
    self.name = ko.observable("Label");
    self.text = ko.observable("Label");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
}

// Button
function MButton() {
    var self = this;
    self.id = 0;
    self.type = "button";
    self.display = {};
    self.display.selected = ko.observable(false);
    
    self.name = ko.observable("Button");
    self.text = ko.observable("Button");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
    self.width = ko.observable(48);
    self.height = ko.observable(16);
}

// Image
function MImage() {
    var self = this;
    self.id = 0;
    self.type = "image";
    self.display = {};
    self.display.selected = ko.observable(false);
    
    self.name = ko.observable("Image");
    self.src = ko.observable("");
    self.x = ko.observable(0);
    self.y = ko.observable(0);
    self.width = ko.observable(96);
    self.height = ko.observable(96);
}