module Heaven.Managers {
  export class AuthManager {

    static tickets : array = [];

    static registerTicket(ticket: string, account: Database.Account) : void {
      AuthManager.tickets[ticket] = account;
    }

    static getTicket(ticket: string) : Database.Account {
      if(AuthManager.tickets[ticket] != undefined) {
        return AuthManager.tickets[ticket];
      }
      else {
        return undefined;
      }
    }
  }
}
