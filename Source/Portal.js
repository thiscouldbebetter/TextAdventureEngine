"use strict";
class Portal {
    constructor(name, description, placeDestinationName) {
        this.name = name;
        this.description = description;
        this.placeDestinationName = placeDestinationName;
    }
    // Clonable.
    clone() {
        return new Portal(this.name, this.description, this.placeDestinationName);
    }
}
