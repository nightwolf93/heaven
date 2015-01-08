module Heaven.Database {
  export class Manager {

    static db: any;
    static logger: any;

    static initialize() : void {
      this.logger = new Utils.Logger('Database');
      var sqlite3 = require("sqlite3").verbose();
      this.db = new sqlite3.Database(Heaven.Application.config.get().database.path);
      this.db.on('trace', (e) => {
          this.logger.debug(("(SQL) ").green + e);
        });
    }
  }
}
