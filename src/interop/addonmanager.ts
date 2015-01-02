module Heaven.Interop {
  export class AddonManager {

    static addons: array;
    static logger: Utils.Logger;

    static load() : void {
      AddonManager.logger = new Utils.Logger("AddonManager");
      AddonManager.addons = new Array();

      for(var addonClass in Heaven.Addons){
        var addon = new Heaven.Addons[addonClass]();
        addon.load();
        AddonManager.addons.push(addon);

        AddonManager.logger.warning("Addon '" + addon.name + "' by " + addon.author + " loaded");
      }
    }

    static call(method: string, parameters: any) : void {
      for(var i in AddonManager.addons){
        var addon = AddonManager.addons[i];
        if(addon[method] != undefined){
          addon[method](parameters);
        }
      }
    }
  }
}
