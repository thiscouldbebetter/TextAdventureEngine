"use strict";
class Program {
    main() {
        var worldCreate = () => Game.worldBuild();
        var universe = Universe.fromWorldCreate(worldCreate);
        universe.initialize();
    }
}
