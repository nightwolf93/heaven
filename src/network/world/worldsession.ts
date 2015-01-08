module Heaven.Network.World {
  export class WorldSession {

    socket: any;
    logger: Utils.Logger;
    state: number;
    account: Database.Account;
    player: Game.Player;

    constructor(socket: any){
      this.socket = socket;
      this.logger = new Utils.Logger('WorldSession(' + socket.remoteAddress + ':' + socket.remotePort + ')');
      this.state = 0;
      this.init();
    }

    init() : void {
      this.socket.on('data', (data: string) => { this.onData(data); });
      this.socket.on('close', () => { this.onClose(); });

      this.send('HG');
    }

    onData(data: string) : void {
      var packets : Array = data.toString().replace('\x0a', '').split('\x00');
      for(var i : number in packets){
        var packet : string = packets[i].trim();
        if(packet != ''){
          this.logger.debug('<<<<< ' + packet);
          this.handle(packet);
        }
      }
    }

    onClose() : void {
      Application.worldserver.removeSession(this);

      this.logger.log('Connection closed by client');
      Interop.AddonManager.call('onWorldSessionClosed', this);
    }

    send(packet: string) : void {
      if(this.socket != undefined) {
        this.socket.write(packet + "\x00");
        this.logger.debug('>>>>> ' + packet);
      }
    }

    handle(packet: string) : void {
      switch(packet.charAt(0)){
        case 'A':
          switch(packet.charAt(1)){
            case 'T':
              Handlers.ApproachHandler.handleAuthentificationTicket(this, packet);
              break;

            case 'P':
              Handlers.ApproachHandler.handleCharacterRandomName(this, packet);
              break;

            case 'L':
              Handlers.ApproachHandler.handleCharacterRequestList(this, packet);
              break;

            case 'A':
              Handlers.ApproachHandler.handleCharacterCreation(this, packet);
              break;

            case 'D':
              Handlers.ApproachHandler.handleCharacterDeletion(this, packet);
              break;

            case 'S':
              Handlers.ApproachHandler.handleCharacterSelection(this, packet);
              break;
          }
          break;

        case 'G':
          switch(packet.charAt(1)){
            case 'C':
              Handlers.ApproachHandler.handleRequestContext(this, packet);
              break;
          }
          break;
      }
    }
  }
}
