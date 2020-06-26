import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestExplorerBindings, RestExplorerComponent,} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {EmailServiceBindings, MyAuthBindings, PasswordHasherBindings} from "./utils/namespaces";
import {MyAuthAuthenticationStrategyProvider} from "./providers/MyAuthAuthenticationStrategyProvider";
import {MyAuthMetadataProvider} from "./providers/MyAuthMetadataProvider";
import {MyAuthActionProvider} from "./providers/MyAuthActionProvider";
import {BcryptHasher} from "./services/hash.password.bcryptjs";
import {AuthenticationBindings} from "@loopback/authentication";
import {SECURITY_SCHEME_SPEC} from "./utils/enums";
import {EmailService} from "./services/email.service";
import {SocketService} from "./services/socket.service";

export interface PackageInfo {
    name: string;
    version: string;
    description: string;
}

const pkg: PackageInfo = require('../package.json');

export class OreeganoWsApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);
        const socketService = new SocketService();

        socketService.initSocket();
        setTimeout(()=>{
            socketService.updateLocation(1, "10", "20");
        }, 5000);

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));


        this.api({
            openapi: '3.0.0',
            info: {title: pkg.name, version: pkg.version},
            paths: {},
            components: {securitySchemes: SECURITY_SCHEME_SPEC},
        });

        // Customize @loopback/rest-explorer configuration here
        this.bind(RestExplorerBindings.CONFIG).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.bind(AuthenticationBindings.METADATA).toProvider(MyAuthMetadataProvider);
        this.bind(MyAuthBindings.STRATEGY).toProvider(MyAuthAuthenticationStrategyProvider);
        this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(MyAuthActionProvider);

        // // Bind bcrypt hash services
        this.bind(PasswordHasherBindings.ROUNDS).to(10);
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

        this.bind(EmailServiceBindings.EMAIL_SERVICE).toClass(EmailService);

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}
