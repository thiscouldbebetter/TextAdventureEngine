"use strict";
class Program {
    main() {
        var worldCreate = () => Game.worldBuild();
        var universe = new Universe(worldCreate);
        universe.initialize();
        //universe.update();
    }
}
