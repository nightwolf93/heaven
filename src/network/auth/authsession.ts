module Heaven.Network.Auth {
  class AuthSession {

    socket: any;

    constructor(socket: any){
      this.socket = socket;
      this.init();
    }

    init() : void {
      this.socket.on('data', function(data){

        });

      this.socket.on('close', function(){ return () => { this.onClose(); } });
    }

    onClose() : void {
      //TODO
      Interop.AddonManager.call('onSessionClosed', this);
    }
  }
}
