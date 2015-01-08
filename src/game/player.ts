module Heaven.Game {
    export class Player {

        session: Network.World.WorldSession;
        character: Database.Character;

        constructor(session: Network.World.WorldSession, character: Database.Character) {
            this.session = session;
            this.character = character;
        }
    }
}