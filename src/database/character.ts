module Heaven.Database {
  export class Character {
    id: number;
    name: string;
    owner: number;
    breed: number;
    sex: number;
    color1: number;
    color2: number;
    color3: number;
    kamas: number;
    mapid: number;
    cellid: number;
    direction: number;
    level: number;
    exp: number;

    constructor(id, name, owner, breed, sex, color1, color2, color3, kamas, mapid, cellid, direction, level, exp) {
      this.id = id;
      this.name = name;
      this.owner = owner;
      this.breed = breed;
      this.sex = sex;
      this.color1 = color1;
      this.color2 = color2;
      this.color3 = color3;
      this.kamas = kamas;
      this.mapid = mapid;
      this.cellid = cellid;
      this.direction = direction;
      this.level = level;
      this.exp = exp;
    }

    getLook() : number {
      return this.breed.toString() + "" + this.sex.toString();
    }

    static createCharacter(c, callback) : void {
      var db = Manager.db;
      db.run("INSERT INTO characters (name, owner, breed, sex, color1, color2, color3, kamas, mapid, cellid, direction, level, exp) VALUES " +
            "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [c.name, c.owner, c.breed, c.sexId, c.c1, c.c2, c.c3, c.kamas, c.mapid, c.cellid, c.direction, c.level, c.exp],
            function(err){
                callback();
              });
    }

    static deleteCharacterById(id, owner, callback) : void {
      var db = Manager.db;
      db.run('DELETE FROM characters WHERE id=? AND owner=?', [id, owner], function(err){
          callback(err);
        });
    }

    static getCharactersForAccount(accountId, callback) : void {
      var db = Manager.db;
      var characters = new Array();
      db.each("SELECT * FROM characters WHERE owner=?", [accountId], function(err, row){
          characters.push(new Character(
            row.id, row.name, row.owner, row.breed, row.sex, row.color1, row.color2, row.color3,
            row.kamas, row.mapid, row.cellid, row.direction, row.level, row.exp
            ));
        }, function(err, rows){
            callback(characters);
          });
    }
  }
}
