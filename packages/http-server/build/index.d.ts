/// <reference types="node" />
import Koa from 'koa';
import Router from 'koa-router';
import { Server } from 'http';
export interface HTTPServerOptions {
    auth?: {
        type: 'jwt';
        options: {
            secretKey: string;
        };
    } | {
        type: 'basic';
        options: {
            authenticate: (username: string, password: string) => Promise<boolean>;
        };
    };
    routerOption?: Router.IRouterOptions;
    port: number;
}
export default class HTTPServer {
    protected options: HTTPServerOptions;
    app: Koa;
    router: Router;
    server?: Server;
    constructor(options: HTTPServerOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map