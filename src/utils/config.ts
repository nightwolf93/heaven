module Heaven.Utils {
  export class Config {

    fileName: string;
    doc: any;

    constructor(fileName: string){
      this.fileName = fileName;
      this.load();
    }

    load() : void{
      var yaml = require('js-yaml');
      var fs   = require('fs');

      this.doc = yaml.safeLoad(fs.readFileSync(this.fileName, 'utf8'));
    }

    get() : object {
      return this.doc;
    }
  }
}
