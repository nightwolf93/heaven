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
            Heaven.Utils.Logger.global = new Heaven.Utils.Logger("Global");
            Application.logger = new Heaven.Utils.Logger("Application");
            Application.logger.log('Starting Heaven v' + Definitions.getVersionString() + ' ..');
            Application.logger.log('Please wait, we load some data ..');
            Application.loadConfig();
            Application.loadDatabase();
            Application.loadAddons();
            Application.loadNetwork();
            Application.loadHandlers();
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
            Application.worldserver = new Heaven.Network.World.WorldServer(Application.config.get().network.world.host, Application.config.get().network.world.port);
            Application.worldserver.start();
        };
        Application.loadHandlers = function () {
            for (var i in Heaven.Handlers) {
                var h = Heaven.Handlers[i];
                h.load();
            }
        };
        Application.waitInput = function () {
            var readline = require('readline');
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question("", function (answer) {
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
        Definitions.deviceName = "Heaven";
        Definitions.dofusVersion = "1.29.1";
        return Definitions;
    })();
    Heaven.Definitions = Definitions;
})(Heaven || (Heaven = {}));
setTimeout(function () {
    Heaven.Application.start();
}, 100);
var Heaven;
(function (Heaven) {
    var Constants = (function () {
        function Constants() {
        }
        Constants.GAMECONTEXT_ROLEPLAY = 1;
        return Constants;
    })();
    Heaven.Constants = Constants;
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Database;
    (function (Database) {
        var Account = (function () {
            function Account(id, username, password, email, secretQuestion, secretAnswer, roleId, nickname) {
                this.id = id;
                this.username = username;
                this.password = password;
                this.email = email;
                this.secretQuestion = secretQuestion;
                this.secretAnswer = secretAnswer;
                this.roleId = roleId;
                this.nickname = nickname;
            }
            Account.getAccountByUsername = function (username, callback) {
                var db = Database.Manager.db;
                db.get('SELECT * FROM accounts WHERE username=?', [username], function (err, row) {
                    if (err) {
                        Heaven.Utils.Logger.global.error('Account->getAccountByUsername >>> An error as occured');
                    }
                    if (row != undefined) {
                        callback(new Account(row.id, row.username, row.password, row.email, row.secret_question, row.secret_answer, row.role_id, row.nickname));
                    }
                    else {
                        callback(undefined);
                    }
                });
            };
            return Account;
        })();
        Database.Account = Account;
    })(Database = Heaven.Database || (Heaven.Database = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Database;
    (function (Database) {
        var Character = (function () {
            function Character(id, name, owner, breed, sex, color1, color2, color3, kamas, mapid, cellid, direction, level, exp) {
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
            Character.prototype.getLook = function () {
                return this.breed.toString() + "" + this.sex.toString();
            };
            Character.createCharacter = function (c, callback) {
                var db = Database.Manager.db;
                db.run("INSERT INTO characters (name, owner, breed, sex, color1, color2, color3, kamas, mapid, cellid, direction, level, exp) VALUES " + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [c.name, c.owner, c.breed, c.sexId, c.c1, c.c2, c.c3, c.kamas, c.mapid, c.cellid, c.direction, c.level, c.exp], function (err) {
                    callback();
                });
            };
            Character.deleteCharacterById = function (id, owner, callback) {
                var db = Database.Manager.db;
                db.run('DELETE FROM characters WHERE id=? AND owner=?', [id, owner], function (err) {
                    callback(err);
                });
            };
            Character.getCharactersForAccount = function (accountId, callback) {
                var db = Database.Manager.db;
                var characters = new Array();
                db.each("SELECT * FROM characters WHERE owner=?", [accountId], function (err, row) {
                    characters.push(new Character(row.id, row.name, row.owner, row.breed, row.sex, row.color1, row.color2, row.color3, row.kamas, row.mapid, row.cellid, row.direction, row.level, row.exp));
                }, function (err, rows) {
                    callback(characters);
                });
            };
            return Character;
        })();
        Database.Character = Character;
    })(Database = Heaven.Database || (Heaven.Database = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Database;
    (function (Database) {
        var Manager = (function () {
            function Manager() {
            }
            Manager.initialize = function () {
                var _this = this;
                this.logger = new Heaven.Utils.Logger('Database');
                var sqlite3 = require("sqlite3").verbose();
                this.db = new sqlite3.Database(Heaven.Application.config.get().database.path);
                this.db.on('trace', function (e) {
                    _this.logger.debug(("(SQL) ").green + e);
                });
            };
            return Manager;
        })();
        Database.Manager = Manager;
    })(Database = Heaven.Database || (Heaven.Database = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Game;
    (function (Game) {
        var Player = (function () {
            function Player(session, character) {
                this.session = session;
                this.character = character;
            }
            return Player;
        })();
        Game.Player = Player;
    })(Game = Heaven.Game || (Heaven.Game = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Handlers;
    (function (Handlers) {
        var ApproachHandler = (function () {
            function ApproachHandler() {
            }
            ApproachHandler.load = function () {
                this.logger = new Heaven.Utils.Logger('ApproachHandler');
            };
            ApproachHandler.handleAuthentificationTicket = function (session, packet) {
                var ticket = packet.substring(2);
                var account = Heaven.Managers.AuthManager.getTicket(ticket);
                if (account != undefined) {
                    session.account = account;
                    this.logger.log("Account '" + account.username + "' logged on worldserver");
                    this.sendCharactersList(session);
                }
            };
            ApproachHandler.sendCharactersList = function (session) {
                var packet = 'ALK31600000000|0';
                Heaven.Database.Character.getCharactersForAccount(session.account.id, function (characters) {
                    for (var i in characters) {
                        var c = characters[i];
                        packet += "|" + c.id + ";" + c.name + ";" + c.level + ";" + c.getLook() + ";" + c.color1 + ";" + c.color2 + ";" + c.color3 + ";" + "" + ";0;1;0;0;";
                    }
                    session.send(packet);
                });
            };
            ApproachHandler.handleCharacterRandomName = function (session, packet) {
                var name = Heaven.Utils.Basic.randomString(4, Heaven.Utils.Basic.randomNum(5, 9));
                name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
                session.send('APK' + name);
            };
            ApproachHandler.handleCharacterRequestList = function (session, packet) {
                this.sendCharactersList(session);
            };
            ApproachHandler.handleCharacterCreation = function (session, packet) {
                var _this = this;
                var data = packet.substring(2).split('|');
                var name = data[0];
                var breedId = parseInt(data[1]);
                var sexId = parseInt(data[2]);
                var color1 = parseInt(data[3]);
                var color2 = parseInt(data[4]);
                var color3 = parseInt(data[5]);
                var character = {
                    name: name,
                    owner: session.account.id,
                    breed: breedId,
                    sexId: sexId,
                    c1: color1,
                    c2: color2,
                    c3: color3,
                    kamas: 0,
                    mapid: 10354,
                    cellid: 255,
                    direction: 1,
                    level: Heaven.Application.config.get().gameplay.start.level,
                    exp: 0
                };
                Heaven.Database.Character.createCharacter(character, function () {
                    _this.logger.log("Character '" + name + "' created by player '" + session.account.username + "'");
                    _this.sendCharactersList(session);
                });
            };
            ApproachHandler.handleCharacterDeletion = function (session, packet) {
                var _this = this;
                var id = parseInt(packet.substring(2).replace('|', ''));
                if (id > 0) {
                    Heaven.Database.Character.deleteCharacterById(id, session.account.id, function () {
                        _this.sendCharactersList(session);
                    });
                }
                else {
                    this.sendCharactersList(session);
                }
            };
            ApproachHandler.handleCharacterSelection = function (session, packet) {
                var _this = this;
                var id = parseInt(packet.substring(2));
                if (id > 0) {
                    Heaven.Database.Character.getCharactersForAccount(session.account.id, function (characters) {
                        var character = undefined;
                        for (var i in characters) {
                            var c = characters[i];
                            if (id == c.id) {
                                character = c;
                            }
                        }
                        if (character != undefined) {
                            session.player = new Heaven.Game.Player(session, character);
                            session.send('ASK|' + character.id + "|" + character.name + "|" + character.level + "|" + character.breed + "|" + character.getLook() + "|" + character.color1 + "|" + character.color2 + "|" + character.color3 + "||" + "" + "|");
                            session.send('BAP' + Heaven.Application.config.get().general.name);
                            _this.logger.log("Character '" + character.name + "' spawn in world");
                        }
                        else {
                            _this.sendCharactersList(session);
                        }
                    });
                }
            };
            ApproachHandler.handleRequestContext = function (session, packet) {
                var context = parseInt(packet.substring(2));
                switch (context) {
                    case Heaven.Constants.GAMECONTEXT_ROLEPLAY:
                        session.send('GCK|1|' + session.player.character.name);
                        session.send('cC+*#$pi:?%');
                        session.send('AR6bk');
                        break;
                }
            };
            return ApproachHandler;
        })();
        Handlers.ApproachHandler = ApproachHandler;
    })(Handlers = Heaven.Handlers || (Heaven.Handlers = {}));
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
    var Managers;
    (function (Managers) {
        var AuthManager = (function () {
            function AuthManager() {
            }
            AuthManager.registerTicket = function (ticket, account) {
                AuthManager.tickets[ticket] = account;
            };
            AuthManager.getTicket = function (ticket) {
                if (AuthManager.tickets[ticket] != undefined) {
                    return AuthManager.tickets[ticket];
                }
                else {
                    return undefined;
                }
            };
            AuthManager.tickets = [];
            return AuthManager;
        })();
        Managers.AuthManager = AuthManager;
    })(Managers = Heaven.Managers || (Heaven.Managers = {}));
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
                    this.clients = new Array();
                    this.logger = new Heaven.Utils.Logger("AuthServer");
                }
                AuthServer.prototype.start = function () {
                    var _this = this;
                    var net = require('net');
                    net.createServer(function (sock) {
                        _this.logger.log('Connection incoming from ' + sock.remoteAddress + ':' + sock.remotePort);
                        var session = new Auth.AuthSession(sock);
                        _this.clients.push(session);
                    }).listen(this.port, this.host);
                    Heaven.Interop.AddonManager.call("onAuthServerStarted", this);
                    this.logger.log('Listen on ' + this.host + ':' + this.port);
                };
                AuthServer.prototype.removeSession = function (session) {
                    var i = this.clients.indexOf(session);
                    if (i != -1) {
                        this.clients.splice(i, 1);
                    }
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
                    this.logger = new Heaven.Utils.Logger('AuthSession(' + socket.remoteAddress + ':' + socket.remotePort + ')');
                    this.state = 0;
                    this.key = Heaven.Utils.Basic.randomString(32);
                    this.init();
                }
                AuthSession.prototype.init = function () {
                    var _this = this;
                    this.socket.on('data', function (data) {
                        _this.onData(data);
                    });
                    this.socket.on('close', function () {
                        _this.onClose();
                    });
                    this.send('HC' + this.key);
                };
                AuthSession.prototype.onData = function (data) {
                    var packets = data.toString().replace('\x0a', '').split('\x00');
                    for (var i in packets) {
                        var packet = packets[i].trim();
                        if (packet != '') {
                            this.logger.debug('<<<<< ' + packet);
                            this.handle(packet);
                        }
                    }
                };
                AuthSession.prototype.onClose = function () {
                    Heaven.Application.authserver.removeSession(this);
                    this.logger.log('Connection closed by client');
                    Heaven.Interop.AddonManager.call('onAuthSessionClosed', this);
                };
                AuthSession.prototype.send = function (packet) {
                    if (this.socket != undefined) {
                        this.socket.write(packet + "\x00");
                        this.logger.debug('>>>>> ' + packet);
                    }
                };
                AuthSession.prototype.handle = function (packet) {
                    if (packet == 'Af') {
                        //TODO: Waiting queue
                        return;
                    }
                    switch (this.state) {
                        case 0:
                            this.handleCheckVersion(packet);
                            break;
                        case 1:
                            this.handleCheckAccount(packet);
                            break;
                        case 2:
                            if (packet.indexOf('Ax') == 0) {
                                this.handleServerList(packet);
                            }
                            else {
                                this.handleServerSelection(packet);
                            }
                            break;
                    }
                };
                AuthSession.prototype.handleCheckVersion = function (packet) {
                    if (packet == '1.29.1') {
                        this.state = 1;
                        this.logger.debug('AuthSession->handleCheckVersion >>> ' + packet);
                    }
                    else {
                    }
                };
                AuthSession.prototype.handleCheckAccount = function (packet) {
                    var _this = this;
                    var username = packet.split('#')[0];
                    var cryptedPassword = packet.split('#')[1].substring(3);
                    this.logger.debug('AuthSession->handleCheckAccount >>> username=' + username + ', password=' + cryptedPassword);
                    Heaven.Database.Account.getAccountByUsername(username, function (account) {
                        if (account != undefined) {
                            var originalPass = Heaven.Utils.Basic.encryptPassword(_this.key, account.password);
                            _this.logger.debug('AuthSession->handleCheckAccount >>> password=' + cryptedPassword + ', originalPass=' + originalPass);
                            if (cryptedPassword == originalPass) {
                                _this.account = account;
                                _this.state = 2;
                                _this.send("Ad" + _this.account.nickname);
                                _this.send("Ac0");
                                _this.send('AH1;1;75;1');
                                _this.send("AlK" + (_this.account.roleId > 0 ? 1 : 0));
                            }
                            else {
                                _this.send('AlEx');
                            }
                        }
                        else {
                            _this.send('AlEx');
                        }
                    });
                };
                AuthSession.prototype.handleServerList = function (packet) {
                    this.send('AxK100000000000000|1,1');
                };
                AuthSession.prototype.handleServerSelection = function (packet) {
                    var id = parseInt(packet.substring(2));
                    var ticket = Heaven.Utils.Basic.randomString(32);
                    Heaven.Managers.AuthManager.registerTicket(ticket, this.account);
                    this.send('AYK' + Heaven.Application.config.get().network.world.host + ":" + Heaven.Application.config.get().network.world.port + ";" + ticket);
                };
                return AuthSession;
            })();
            Auth.AuthSession = AuthSession;
        })(Auth = Network.Auth || (Network.Auth = {}));
    })(Network = Heaven.Network || (Heaven.Network = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Network;
    (function (Network) {
        var World;
        (function (World) {
            var WorldServer = (function () {
                function WorldServer(host, port) {
                    this.host = host;
                    this.port = port;
                    this.clients = new Array();
                    this.logger = new Heaven.Utils.Logger("WorldServer");
                }
                WorldServer.prototype.start = function () {
                    var _this = this;
                    var net = require('net');
                    net.createServer(function (sock) {
                        _this.logger.log('Connection incoming from ' + sock.remoteAddress + ':' + sock.remotePort);
                        var session = new World.WorldSession(sock);
                        _this.clients.push(session);
                    }).listen(this.port, this.host);
                    Heaven.Interop.AddonManager.call("onWorldServerStarted", this);
                    this.logger.log('Listen on ' + this.host + ':' + this.port);
                };
                WorldServer.prototype.removeSession = function (session) {
                    var i = this.clients.indexOf(session);
                    if (i != -1) {
                        this.clients.splice(i, 1);
                    }
                };
                return WorldServer;
            })();
            World.WorldServer = WorldServer;
        })(World = Network.World || (Network.World = {}));
    })(Network = Heaven.Network || (Heaven.Network = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Network;
    (function (Network) {
        var World;
        (function (World) {
            var WorldSession = (function () {
                function WorldSession(socket) {
                    this.socket = socket;
                    this.logger = new Heaven.Utils.Logger('WorldSession(' + socket.remoteAddress + ':' + socket.remotePort + ')');
                    this.state = 0;
                    this.init();
                }
                WorldSession.prototype.init = function () {
                    var _this = this;
                    this.socket.on('data', function (data) {
                        _this.onData(data);
                    });
                    this.socket.on('close', function () {
                        _this.onClose();
                    });
                    this.send('HG');
                };
                WorldSession.prototype.onData = function (data) {
                    var packets = data.toString().replace('\x0a', '').split('\x00');
                    for (var i in packets) {
                        var packet = packets[i].trim();
                        if (packet != '') {
                            this.logger.debug('<<<<< ' + packet);
                            this.handle(packet);
                        }
                    }
                };
                WorldSession.prototype.onClose = function () {
                    Heaven.Application.worldserver.removeSession(this);
                    this.logger.log('Connection closed by client');
                    Heaven.Interop.AddonManager.call('onWorldSessionClosed', this);
                };
                WorldSession.prototype.send = function (packet) {
                    if (this.socket != undefined) {
                        this.socket.write(packet + "\x00");
                        this.logger.debug('>>>>> ' + packet);
                    }
                };
                WorldSession.prototype.handle = function (packet) {
                    switch (packet.charAt(0)) {
                        case 'A':
                            switch (packet.charAt(1)) {
                                case 'T':
                                    Heaven.Handlers.ApproachHandler.handleAuthentificationTicket(this, packet);
                                    break;
                                case 'P':
                                    Heaven.Handlers.ApproachHandler.handleCharacterRandomName(this, packet);
                                    break;
                                case 'L':
                                    Heaven.Handlers.ApproachHandler.handleCharacterRequestList(this, packet);
                                    break;
                                case 'A':
                                    Heaven.Handlers.ApproachHandler.handleCharacterCreation(this, packet);
                                    break;
                                case 'D':
                                    Heaven.Handlers.ApproachHandler.handleCharacterDeletion(this, packet);
                                    break;
                                case 'S':
                                    Heaven.Handlers.ApproachHandler.handleCharacterSelection(this, packet);
                                    break;
                            }
                            break;
                        case 'G':
                            switch (packet.charAt(1)) {
                                case 'C':
                                    Heaven.Handlers.ApproachHandler.handleRequestContext(this, packet);
                                    break;
                            }
                            break;
                    }
                };
                return WorldSession;
            })();
            World.WorldSession = WorldSession;
        })(World = Network.World || (Network.World = {}));
    })(Network = Heaven.Network || (Heaven.Network = {}));
})(Heaven || (Heaven = {}));
var Heaven;
(function (Heaven) {
    var Utils;
    (function (Utils) {
        var Basic = (function () {
            function Basic() {
            }
            Basic.randomString = function (length, ch) {
                if (ch === void 0) { ch = false; }
                var str = '';
                for (var i = 0; i <= length; i++) {
                    if (ch) {
                        str += Basic.cleanHash[Basic.randomNum(0, Basic.cleanHash.length)];
                    }
                    else {
                        str += Basic.hash[Basic.randomNum(0, Basic.hash.length)];
                    }
                }
                return str;
            };
            Basic.randomNum = function (min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            };
            Basic.encryptPassword = function (key, pwd) {
                hash = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_");
                var _loc4 = "";
                var _loc5 = 0;
                while (++_loc5, _loc5 < pwd.length) {
                    var _loc6 = pwd.charCodeAt(_loc5);
                    var _loc7 = key.charCodeAt(_loc5);
                    var _loc8 = Math.floor(_loc6 / 16);
                    var _loc9 = _loc6 % 16;
                    _loc4 += (hash[(_loc8 + _loc7 % hash.length) % hash.length]);
                    _loc4 += (hash[(_loc9 + _loc7 % hash.length) % hash.length]);
                }
                return (_loc4);
            };
            Basic.hash = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'];
            Basic.cleanHash = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            return Basic;
        })();
        Utils.Basic = Basic;
    })(Utils = Heaven.Utils || (Heaven.Utils = {}));
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
            Logger.prototype.debug = function (message) {
                console.log(('[' + this.name + ']').cyan + ' : ' + message);
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