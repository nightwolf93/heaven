module Heaven.Database {
  export class Manager {

    static db: any;

    static initialize() : void {
      sqlite3 = require("sqlite3").verbose();
      this.db = new sqlite3.Database(Heaven.Application.config.get().database.path);
    }
  }
}
