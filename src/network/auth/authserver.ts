module Heaven.Network.Auth {
  export class AuthServer {

    host: string;
    port: int;
    clients: array;

    logger: Utils.Logger;

    constructor(host: string, port: int) {
      this.host = host;
      this.port = port;
      this.clients = new Array();

      this.logger = new Utils.Logger("AuthServer");
    }

    start() : void {
      var net = require('net');
      net.createServer((sock) => {
          this.logger.log('Connection incoming from ' + sock.remoteAddress +':'+ sock.remotePort);
          var session: AuthSession = new AuthSession(sock);
          this.clients.push(session);
      }).listen(this.port, this.host);

      Interop.AddonManager.call("onAuthServerStarted", this);
      this.logger.log('Listen on ' + this.host + ':' + this.port);
    }

    removeSession(session) : void {
      var i = this.clients.indexOf(session);
      if(i != -1) {
      	this.clients.splice(i, 1);
      }
    }
  }
}
