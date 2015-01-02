var Heaven;
(function (Heaven) {
    var Addons;
    (function (Addons) {
        var Example = (function () {
            function Example() {
            }
            Example.prototype.load = function () {
                this.name = "ExampleAddon";
                this.author = "Nightwolf";
                this.logger = new Heaven.Utils.Logger(this.name);
            };
            Example.prototype.onAuthServerStarted = function (server) {
                //this.logger.log('Hook on authserver starting event');
            };
            return Example;
        })();
        Addons.Example = Example;
    })(Addons = Heaven.Addons || (Heaven.Addons = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Application = (function () {
        function Application() {
        }
        Application.start = function () {
            console.log('\n');
            Application.logger = new Heaven.Utils.Logger("Application");
            Application.logger.log('Starting Heaven v' + Definitions.getVersionString() + ' ..');
            Application.logger.log('Please wait, we load some data ..');
            Application.loadConfig();
            Application.loadDatabase();
            Application.loadAddons();
            Application.loadNetwork();
            Application.waitInput();
        };
        Application.loadConfig = function () {
            Application.config = new Heaven.Utils.Config('config.yml');
            Application.logger.log('Config loaded');
        };
        Application.loadDatabase = function () {
            Heaven.Database.Manager.initialize();
            Application.logger.log('Connected to database');
        };
        Application.loadAddons = function () {
            Heaven.Interop.AddonManager.load();
        };
        Application.loadNetwork = function () {
            Application.authserver = new Heaven.Network.Auth.AuthServer(Application.config.get().network.auth.host, Application.config.get().network.auth.port);
            Application.authserver.start();
        };
        Application.waitInput = function () {
            var readline = require('readline');
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question("> ", function (answer) {
                //TODO
                rl.close();
                Application.waitInput();
            });
        };
        return Application;
    })();
    Heaven.Application = Application;
    var Definitions = (function () {
        function Definitions() {
        }
        Definitions.getVersionString = function () {
            var version = Definitions.version;
            return version.major + '.' + version.minor + '.' + version.revision + '.' + version.patch;
        };
        Definitions.version = {
            major: 1,
            minor: 0,
            revision: 0,
            patch: 0
        };
        Definitions.author = "Nightwolf";
        return Definitions;
    })();
    Heaven.Definitions = Definitions;
})(Heaven || (Heaven = {}));
setTimeout(function () {
    Heaven.Application.start();
}, 100);
var Heaven;
(function (Heaven) {
    var Database;
    (function (Database) {
        var Manager = (function () {
            function Manager() {
            }
            Manager.initialize = function () {
                sqlite3 = require("sqlite3").verbose();
                this.db = new sqlite3.Database(Heaven.Application.config.get().database.path);
            };
            return Manager;
        })();
        Database.Manager = Manager;
    })(Database = Heaven.Database || (Heaven.Database = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Interop;
    (function (Interop) {
        var Addon = (function () {
            function Addon() {
            }
            return Addon;
        })();
        Interop.Addon = Addon;
    })(Interop = Heaven.Interop || (Heaven.Interop = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Interop;
    (function (Interop) {
        var AddonManager = (function () {
            function AddonManager() {
            }
            AddonManager.load = function () {
                AddonManager.logger = new Heaven.Utils.Logger("AddonManager");
                AddonManager.addons = new Array();
                for (var addonClass in Heaven.Addons) {
                    var addon = new Heaven.Addons[addonClass]();
                    addon.load();
                    AddonManager.addons.push(addon);
                    AddonManager.logger.warning("Addon '" + addon.name + "' by " + addon.author + " loaded");
                }
            };
            AddonManager.call = function (method, parameters) {
                for (var i in AddonManager.addons) {
                    var addon = AddonManager.addons[i];
                    if (addon[method] != undefined) {
                        addon[method](parameters);
                    }
                }
            };
            return AddonManager;
        })();
        Interop.AddonManager = AddonManager;
    })(Interop = Heaven.Interop || (Heaven.Interop = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Network;
    (function (Network) {
        var Auth;
        (function (Auth) {
            var AuthServer = (function () {
                function AuthServer(host, port) {
                    this.host = host;
                    this.port = port;
                    this.logger = new Heaven.Utils.Logger("AuthServer");
                }
                AuthServer.prototype.start = function () {
                    var _this = this;
                    var net = require('net');
                    net.createServer(function (sock) {
                        _this.logger('Connection incoming from ' + sock.remoteAddress + ':' + sock.remotePort);
                        // Add a 'data' event handler to this instance of socket
                        //sock.on('data', function(data) {
                        //    console.log('DATA ' + sock.remoteAddress + ': ' + data);
                        //    // Write the data back to the socket, the client will receive it as data from the server
                        //    sock.write('You said "' + data + '"');
                        //});
                        //
                        //// Add a 'close' event handler to this instance of socket
                        //  sock.on('close', function(data) {
                        //      console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
                        //  });
                    }).listen(this.port, this.host);
                    Heaven.Interop.AddonManager.call("onAuthServerStarted", this);
                    this.logger.log('Listen on ' + this.host + ':' + this.port);
                };
                return AuthServer;
            })();
            Auth.AuthServer = AuthServer;
        })(Auth = Network.Auth || (Network.Auth = {}));
    })(Network = Heaven.Network || (Heaven.Network = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Network;
    (function (Network) {
        var Auth;
        (function (Auth) {
            var AuthSession = (function () {
                function AuthSession(socket) {
                    this.socket = socket;
                    this.init();
                }
                AuthSession.prototype.init = function () {
                    this.socket.on('data', function (data) {
                    });
                    this.socket.on('close', function () {
                        var _this = this;
                        return function () {
                            _this.onClose();
                        };
                    });
                };
                AuthSession.prototype.onClose = function () {
                    //TODO
                    Heaven.Interop.AddonManager.call('onSessionClosed', this);
                };
                return AuthSession;
            })();
        })(Auth = Network.Auth || (Network.Auth = {}));
    })(Network = Heaven.Network || (Heaven.Network = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Utils;
    (function (Utils) {
        var Config = (function () {
            function Config(fileName) {
                this.fileName = fileName;
                this.load();
            }
            Config.prototype.load = function () {
                var yaml = require('js-yaml');
                var fs = require('fs');
                this.doc = yaml.safeLoad(fs.readFileSync(this.fileName, 'utf8'));
            };
            Config.prototype.get = function () {
                return this.doc;
            };
            return Config;
        })();
        Utils.Config = Config;
    })(Utils = Heaven.Utils || (Heaven.Utils = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Utils;
    (function (Utils) {
        var Logger = (function () {
            function Logger(name) {
                this.name = name;
                var colors = require('colors');
            }
            Logger.prototype.log = function (message) {
                console.log(('[' + this.name + ']').green + ' : ' + message);
                this.write('infos', message);
            };
            Logger.prototype.warning = function (message) {
                console.log(('[' + this.name + ']').yellow + ' : ' + message);
                this.write('warning', message);
            };
            Logger.prototype.error = function (message, write) {
                if (write === void 0) { write = true; }
                console.log(('[' + this.name + ']').red + ' : ' + message);
                if (write) {
                    this.write('error', message);
                }
            };
            Logger.prototype.write = function (from, message) {
                var _this = this;
                var fs = require('fs');
                var filename = 'logs/' + from + '.log';
                if (fs.existsSync(filename)) {
                    fs.appendFile(filename, '[' + this.getTimeNow() + '][' + this.name + '] : ' + message + '\n', function (err) {
                        if (err) {
                            _this.error("Can't write into log file, check rights on your computer", false);
                        }
                    });
                }
                else {
                    fs.writeFile('logs/' + from + '.log', "Log file created \n================\n", function (err) {
                        var _this = this;
                        return function () {
                            if (err) {
                                _this.error("Can't write into log file, check rights on your computer", false);
                            }
                        };
                    });
                }
            };
            Logger.prototype.getTimeNow = function () {
                var now = new Date(), ampm = 'am', h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
                if (h >= 12) {
                    if (h > 12)
                        h -= 12;
                    ampm = 'pm';
                }
                if (m < 10)
                    m = '0' + m;
                if (s < 10)
                    s = '0' + s;
                return now.toLocaleDateString() + ' ' + h + ':' + m + ':' + s + ' ' + ampm;
            };
            return Logger;
        })();
        Utils.Logger = Logger;
    })(Utils = Heaven.Utils || (Heaven.Utils = {}));
})(Heaven || (Heaven = {}));
//# sourceMappingURL=app.js.map