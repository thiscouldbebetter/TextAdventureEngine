"use strict";
class Script {
    constructor(name, run) {
        this.name = name;
        this.run = run;
    }
    // Clonable.
    clone() {
        return new Script(this.name, this.run // todo
        );
    }
}
