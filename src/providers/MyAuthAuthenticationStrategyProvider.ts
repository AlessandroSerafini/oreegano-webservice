import {inject, Provider, ValueOrPromise,} from '@loopback/core';
import {AuthenticationBindings, AuthenticationStrategy,} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {repository} from '@loopback/repository';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from "../repositories";
import {JwtStructure, MyAuthenticationMetadata} from "../utils/interfaces";
import {JWT_STRATEGY_NAME, SecuredType} from "../utils/enums";
import {environment} from "../env/environment";
import {User} from "../models/user.model";

export class MyAuthAuthenticationStrategyProvider implements Provider<AuthenticationStrategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA) private metadata: MyAuthenticationMetadata,
        @repository(UserRepository) private userRepository: UserRepository,
    ) {
    }

    value(): ValueOrPromise<AuthenticationStrategy | undefined> {
        if (!this.metadata) return;

        const {strategy} = this.metadata;

        if (strategy === JWT_STRATEGY_NAME) {
            const jwtStrategy = new JwtStrategy(
                {
                    secretOrKey: environment.JWT_SECRET,
                    jwtFromRequest: ExtractJwt.fromExtractors([
                        ExtractJwt.fromAuthHeaderAsBearerToken(),
                        ExtractJwt.fromUrlQueryParameter('access_token'),
                    ]),
                },
                (payload, done) => this.verifyToken(payload, done),
            );

            // we will use Loopback's  StrategyAdapter so we can leverage passport's strategy
            // and also we don't have to implement a new strategy adapter.
            return new StrategyAdapter(jwtStrategy, JWT_STRATEGY_NAME);
        }
    }

    // verify JWT token and decrypt the payload.
    // Then search user from database with id equals to payload's username.
    // if user is found, then verify its roles
    async verifyToken(
        payload: JwtStructure,
        done: (err: Error | null, user?: UserProfile | false, info?: Object) => void,
    ) {
        try {
            const idUser = payload.idUser;

            if (await this.userRepository.exists(idUser)) {
                const user: User = await this.userRepository.findById(idUser);
                if (!user) done(null, false);

                await this.verifyRoles(idUser);

                done(null, {
                        id: user.id,
                        name: user.name,
                        [securityId]: user.name
                    }
                );
            } else {
                throw new HttpErrors.Unauthorized();
            }


        } catch (err) {
            if (err.name === 'UnauthorizedError') done(null, false);
            done(err, false);
        }
    }

    // verify user's role based on the SecuredType
    async verifyRoles(idUser: number) {
        const {type, role} = this.metadata;

        if ([SecuredType.IS_AUTHENTICATED, SecuredType.PERMIT_ALL].includes(type)) return;

        if (type === SecuredType.HAS_ROLE && role) {
            const user: User = await this.userRepository.findById(idUser);

            const userRole = user.role;
            if (userRole === role)
                return
        }
        throw new HttpErrors.Unauthorized('Invalid authorization');
    }
}
