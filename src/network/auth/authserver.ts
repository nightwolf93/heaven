module Heaven.Network.Auth {
  export class AuthServer {

    host: string;
    port: int;

    logger: Utils.Logger;

    constructor(host: string, port: int) {
      this.host = host;
      this.port = port;

      this.logger = new Utils.Logger("AuthServer");
    }

    start() : void {
      var net = require('net');
      net.createServer(function(sock) {
          return () => {
            this.logger('Connection incoming from ' + sock.remoteAddress +':'+ sock.remotePort);

            // Add a 'data' event handler to this instance of socket
            //sock.on('data', function(data) {

            //    console.log('DATA ' + sock.remoteAddress + ': ' + data);
            //    // Write the data back to the socket, the client will receive it as data from the server
            //    sock.write('You said "' + data + '"');

            //});
//
            //// Add a 'close' event handler to this instance of socket
          //  sock.on('close', function(data) {
          //      console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
          //  });
          }
      }).listen(this.port, this.host);

      Interop.AddonManager.call("onAuthServerStarted", this);
      this.logger.log('Listen on ' + this.host + ':' + this.port);
    }
  }
}
