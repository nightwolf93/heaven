module Heaven.Game {
    export class Player {

        session: Network.World.WorldSession;
        character: Database.Character;

        state: number;

        constructor(session: Network.World.WorldSession, character: Database.Character) {
            this.session = session;
            this.character = character;

            this.state = 0;
        }

        motd() : void {
            var str:string = Application.config.get().general.motd;
            str = str.replace('%version%', Definitions.getVersionString());
            str = str.replace('%owner%', Definitions.author);
            this.message(str);

            if(this.hasAdminRights()){
                //TODO: Show admin motd
            }
        }

        message(msg: string, color: string = '#f00000') : void {
            this.session.send("cs<font color=\"" + color + "\">" + msg + "</font>");
        }

        hasAdminRights() : boolean {
            return this.session.account.roleId > 0;
        }
    }
}