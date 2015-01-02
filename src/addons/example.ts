module Heaven.Addons {

  export class Example implements Interop.Addon {

    name: string;
    author: string;
    logger: Utils.Logger;

    load() : void {
      this.name = "ExampleAddon";
      this.author = "Nightwolf";
      this.logger = new Utils.Logger(this.name);
    }

    onAuthServerStarted(server : Network.Auth.AuthServer) : void {
      //this.logger.log('Hook on authserver starting event');
    }
  }
}
