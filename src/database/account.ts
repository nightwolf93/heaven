module Heaven.Database {
  export class Account {

    id: int;
    username: string;
    password: string;
    email: string;
    secretQuestion: string;
    secretAnswer: string;
    roleId: int;
    nickname: string;

    constructor(id: int, username: string, password: string, email: string, secretQuestion: string, secretAnswer: string, roleId: int, nickname: string){
      this.id = id;
      this.username = username;
      this.password = password;
      this.email = email;
      this.secretQuestion = secretQuestion;
      this.secretAnswer = secretAnswer;
      this.roleId = roleId;
      this.nickname = nickname;
    }

    static getAccountByUsername(username: string, callback: any) : Account {
      var db = Manager.db;
      db.get('SELECT * FROM accounts WHERE username=?', [username],
        function(err: any, row: int){
          if(err){
            Utils.Logger.global.error('Account->getAccountByUsername >>> An error as occured');
          }
          if(row != undefined){
            callback(new Account(
                row.id,
                row.username,
                row.password,
                row.email,
                row.secret_question,
                row.secret_answer,
                row.role_id,
                row.nickname
              ));
          }
          else {
            callback(undefined);
          }
        }
      );
    }
  }
}
