module Heaven
{
  export class Application {

    static logger: Utils.Logger;
    static config: Utils.Config;
    static authserver: Network.Auth.AuthServer;

    static start() : void {
      console.log('\n');

      Application.logger = new Utils.Logger("Application");
      Application.logger.log('Starting Heaven v' + Definitions.getVersionString() + ' ..');
      Application.logger.log('Please wait, we load some data ..')

      Application.loadConfig();
      Application.loadDatabase();
      Application.loadAddons();
      Application.loadNetwork();

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
    }

    static waitInput() : void {
      var readline = require('readline');

      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("> ", function(answer) {
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

    static getVersionString() : string {
      var version = Definitions.version;
      return version.major + '.' + version.minor + '.' + version.revision + '.' + version.patch;
    }
  }
}

setTimeout(function(){
  Heaven.Application.start();
}, 100);
