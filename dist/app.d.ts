declare module Heaven {
    class Application {
        static logger: Utils.Logger;
        static start(): void;
    }
}
declare module Heaven.Utils {
    class Config {
        fileName: string;
        doc: any;
        constructor(fileName: string);
        load(): void;
    }
}
declare module Heaven.Utils {
    class Logger {
        name: string;
        constructor(name: string);
        log(message: any): void;
    }
}
