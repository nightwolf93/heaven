module Heaven.Handlers {
  export class ApproachHandler {

    static logger: Utils.Logger;

    static load() {
      this.logger = new Utils.Logger('ApproachHandler');
    }

    static handleAuthentificationTicket(session : Network.World.WorldSession, packet: string) : void {
      var ticket : string = packet.substring(2);
      var account = Managers.AuthManager.getTicket(ticket);

      if(account != undefined) {
        session.account = account;
        this.logger.log("Account '" + account.username + "' logged on worldserver");
        this.sendCharactersList(session);
      }
    }

    static sendCharactersList(session: Network.World.WorldSession) : void {
      var packet : string = 'ALK31600000000|0';

      Database.Character.getCharactersForAccount(session.account.id, function(characters){
          for(var i in characters){
            var c = characters[i];
            packet += "|" + c.id + ";" + c.name + ";" + c.level + ";" + c.getLook() +
              ";" + c.color1 + ";" + c.color2 + ";" + c.color3 + ";" + "" + ";0;1;0;0;";
          }
          session.send(packet);
        });
    }

    static handleCharacterRandomName(session: Network.World.WorldSession, packet: string) : void {
      var name = Utils.Basic.randomString(4, Utils.Basic.randomNum(5, 9));
      name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();

      session.send('APK' + name);
    }

    static handleCharacterRequestList(session: Network.World.WorldSession, packet: string) : void {
        this.sendCharactersList(session);
    }

    static handleCharacterCreation(session: any, packet: string) : void {
      var data = packet.substring(2).split('|');

      var name = data[0];
      var breedId = parseInt(data[1]);
      var sexId = parseInt(data[2]);
      var color1 = parseInt(data[3]);
      var color2 = parseInt(data[4]);
      var color3 = parseInt(data[5]);

      var character = {
        name: name,
        owner: session.account.id,
        breed: breedId,
        sexId: sexId,
        c1: color1,
        c2: color2,
        c3: color3,
        kamas: 0,
        mapid: 10354,
        cellid: 255,
        direction: 1,
        level: Application.config.get().gameplay.start.level,
        exp: 0
      };

      Heaven.Database.Character.createCharacter(character, () => {
          this.logger.log("Character '" + name + "' created by player '" + session.account.username + "'");
          this.sendCharactersList(session);
        });
    }

    static handleCharacterDeletion(session: any, packet: string) : void {
      var id = parseInt(packet.substring(2).replace('|', ''));
      if(id > 0){
        Database.Character.deleteCharacterById(id, session.account.id, () => {
            this.sendCharactersList(session);
          });
      }
      else {
        this.sendCharactersList(session);
      }
    }

    static handleCharacterSelection(session: any, packet: string) : void {
      var id = parseInt(packet.substring(2));
      if(id > 0){
         Database.Character.getCharactersForAccount(session.account.id, (characters) => {
               var character = undefined;
               for(var i in characters){
                 var c = characters[i];
                 if(id == c.id) { character = c; }
               }
               if(character != undefined){
                 session.player = new Game.Player(session, character);
                 session.send('ASK|' + character.id + "|" + character.name + "|" + character.level + "|" + character.breed +
                  "|" + character.getLook() + "|" + character.color1 + "|" + character.color2 + "|" + character.color3 +
                  "||" + "" + "|");
                 session.send('BAP' + Application.config.get().general.name);
                 this.logger.log("Character '" + character.name + "' spawn in world");
               }
               else {
                 this.sendCharactersList(session);
               }
           });
      }
    }

    static handleRequestContext(session: Network.World.WorldSession, packet: string) : void {
      var context = parseInt(packet.substring(2));
      switch (context) {
        case Constants.GAMECONTEXT_ROLEPLAY:
            session.send('GCK|1|' + session.player.character.name);
            session.send('cC+*#$pi:?%');
            session.send('AR6bk');
            break;
      }
    }
  }
}
