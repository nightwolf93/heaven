module Heaven.Network.World {
  export class WorldServer {
    host: string;
    port: number;
    clients: array;

    logger: Utils.Logger;

    constructor(host: string, port: number) {
      this.host = host;
      this.port = port;
      this.clients = new Array();

      this.logger = new Utils.Logger("WorldServer");
    }

    start() : void {
      var net = require('net');
      net.createServer((sock) => {
          this.logger.log('Connection incoming from ' + sock.remoteAddress +':'+ sock.remotePort);
          var session: WorldSession = new WorldSession(sock);
          this.clients.push(session);
      }).listen(this.port, this.host);

      Interop.AddonManager.call("onWorldServerStarted", this);
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
