module Heaven.Utils {
  export class Logger {

    name: string;

    constructor (name: string){
      this.name = name;
      var colors = require('colors');
    }

    log(message: string) : void {
      console.log(('[' + this.name + ']').green + ' : ' + message);
      this.write('infos', message);
    }

    warning(message: string) : void {
      console.log(('[' + this.name + ']').yellow + ' : ' + message);
      this.write('warning', message);
    }

    error(message: string) : void {
      console.log(('[' + this.name + ']').red + ' : ' + message);
      this.write('error', message);
    }

    write(from: string, message: string) : void {
      var fs = require('fs');
      var filename = 'logs/' + from + '.log';
      if (fs.existsSync(filename)) {
        fs.appendFile(filename, '[' + this.getTimeNow() + '][' + this.name + '] : ' + message + '\n', function (err) {
          return () => {
            if(err){
              this.error("Can't write into log file, check rights on your computer");
            }
          };
        });
      }
      else {
        fs.writeFile('logs/' + from + '.log', "Log file created \n================\n", function(err) {
            return () => {
              if(err){
                this.error("Can't write into log file, check rights on your computer");
              }
            };
        });
      }
    }

    getTimeNow() : string {
        var now= new Date(),
        ampm= 'am',
        h= now.getHours(),
        m= now.getMinutes(),
        s= now.getSeconds();
        if(h>= 12){
            if(h>12) h -= 12;
            ampm= 'pm';
        }

        if(m<10) m= '0'+m;
        if(s<10) s= '0'+s;
        return now.toLocaleDateString()+ ' ' + h + ':' + m + ':' + s + ' ' + ampm;
    }
  }
}
