module Heaven.Utils {
  export class Basic {

    static hash : array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'];
    static cleanHash : array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                'V', 'W', 'X', 'Y', 'Z'];

    static randomString(length: number, ch: boolean = false) : string {
      var str : string = '';
      for(var i = 0; i <= length; i++){
        if(ch){
          str += Basic.cleanHash[Basic.randomNum(0, Basic.cleanHash.length)];
        }
        else {
          str += Basic.hash[Basic.randomNum(0, Basic.hash.length)];
        }
      }
      return str;
    }

    static randomNum(min: number, max: number) : number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static encryptPassword(key: string, pwd: string){
      hash = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_");
      var _loc4 = "";
      var _loc5 = 0;
      while (++_loc5, _loc5 < pwd.length)
      {
          var _loc6 = pwd.charCodeAt(_loc5);
          var _loc7 = key.charCodeAt(_loc5);
          var _loc8 = Math.floor(_loc6 / 16);
          var _loc9 = _loc6 % 16;
          _loc4 += (hash[(_loc8 + _loc7 % hash.length) % hash.length]);
  		    _loc4 += (hash[(_loc9 + _loc7 % hash.length) % hash.length]);
      }
      return (_loc4);
    }
  }
}
