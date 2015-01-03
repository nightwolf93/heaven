module Heaven.Network.Auth {
  export class AuthSession {

    socket: any;
    logger: Utils.Logger;
    state: int;
    key: string;
    account: Database.Account;

    constructor(socket: any){
      this.socket = socket;
      this.logger = new Utils.Logger('AuthSession(' + socket.remoteAddress + ':' + socket.remotePort + ')');
      this.state = 0;
      this.key = Utils.Basic.randomString(32);
      this.init();
    }

    init() : void {
      this.socket.on('data', (data: string) => { this.onData(data); });
      this.socket.on('close', () => { this.onClose(); });

      this.send('HC' + this.key);
    }

    onData(data: string) : void {
      var packets : Array = data.toString().replace('\x0a', '').split('\x00');
      for(var i : int in packets){
        var packet : string = packets[i].trim();
        if(packet != ''){
          this.logger.debug('<<<<< ' + packet);
          this.handle(packet);
        }
      }
    }

    onClose() : void {
      Application.authserver.removeSession(this);

      this.logger.log('Connection closed by client');
      Interop.AddonManager.call('onSessionClosed', this);
    }

    send(packet: string) : void {
      if(this.socket != undefined) {
        this.socket.write(packet + "\x00");
        this.logger.debug('>>>>> ' + packet);
      }
    }

    handle(packet: string) : void {
      if(packet == 'Af'){
        //TODO: Waiting queue
        return;
      }
      switch(this.state){
        case 0: // Check version
          this.handleCheckVersion(packet);
          break;

        case 1: // Check account
          this.handleCheckAccount(packet);
          break;
      }
    }

    handleCheckVersion(packet: string) : void {
      if(packet == '1.29.1'){
        this.state = 1;
        this.logger.debug('AuthSession->handleCheckVersion >>> ' + packet);
      }
      else {
        //TODO: Disconnection
      }
    }

    handleCheckAccount(packet: string) : void {
      var username = packet.split('#')[0];
      var cryptedPassword = packet.split('#')[1].substring(3);

      this.logger.debug('AuthSession->handleCheckAccount >>> username=' + username + ', password=' + cryptedPassword);

      Database.Account.getAccountByUsername(username, (account) => {
        if(account != undefined){
          var originalPass = Utils.Basic.encryptPassword(this.key, account.password);
          this.logger.debug('AuthSession->handleCheckAccount >>> password=' + cryptedPassword + ', originalPass=' + originalPass);
          if(cryptedPassword == originalPass) {
            this.account = account;
            this.state = 2;

            this.send("Ad" + this.account.nickname);
            this.send("Ac0");

          }
          else {
            this.send('AlEx');
          }
        }
        else {
          this.send('AlEx');
        }
      });
    }
  }
}
