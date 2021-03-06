module Heaven
{
  export class Application {

    static logger: Utils.Logger;
    static config: Utils.Config;
    static authserver: Network.Auth.AuthServer;
    static worldserver: Network.World.WorldServer;

    static start() : void {
      console.log('\n');

      Utils.Logger.global = new Utils.Logger("Global");

      Application.logger = new Utils.Logger("Application");
      Application.logger.log('Starting Heaven v' + Definitions.getVersionString() + ' ..');
      Application.logger.log('Please wait, we load some data ..')

      Application.loadConfig();
      Application.loadDatabase();
      Application.loadAddons();
      Application.loadNetwork();
      Application.loadHandlers();

      Application.waitInput();
    }

    static loadConfig() : void {
      Application.config = new Utils.Config('config.yml');
      Application.logger.log('Config loaded');
    }

    static loadDatabase() : void {
      Database.Manager.initialize();
      Application.logger.log('Connected to database');
    }

    static loadAddons() : void {
      Interop.AddonManager.load();
    }

    static loadNetwork() : void {
      Application.authserver = new Network.Auth.AuthServer(Application.config.get().network.auth.host, Application.config.get().network.auth.port);
      Application.authserver.start();

      Application.worldserver = new Network.World.WorldServer(Application.config.get().network.world.host, Application.config.get().network.world.port);
      Application.worldserver.start();
    }

    static loadHandlers() : void {
      for(var i in Heaven.Handlers) {
        var h = Heaven.Handlers[i];
        h.load();
      }
    }

    static waitInput() : void {
      var readline = require('readline');

      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("", function(answer) {
        //TODO
        rl.close();
        Application.waitInput();
      });
    }
  }

  export class Definitions {
    static version: any = {
      major: 1,
      minor: 0,
      revision: 0,
      patch: 0
    }
    static author: string = "Nightwolf";
    static deviceName: string = "Heaven";
    static dofusVersion: string = "1.29.1";

    static getVersionString() : string {
      var version = Definitions.version;
      return version.major + '.' + version.minor + '.' + version.revision + '.' + version.patch;
    }
  }
}

setTimeout(function(){
  Heaven.Application.start();
}, 100);
