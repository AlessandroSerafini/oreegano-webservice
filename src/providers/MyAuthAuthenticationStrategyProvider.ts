import {inject, Provider, ValueOrPromise,} from '@loopback/core';
import {AuthenticationBindings, AuthenticationStrategy,} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {repository} from '@loopback/repository';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import {HttpErrors} from '@loopback/rest';
import {environment} from "../env/environment";
import {JWT_STRATEGY_NAME, SecuredType} from "../utils/enums";
import {JwtStructure, MyAuthenticationMetadata} from "../utils/interfaces";
import {UserRole} from "../models/user-role.model";
import {User} from "../models/user.model";
import {UserRepository, UserRoleRepository} from "../repositories";

export class MyAuthAuthenticationStrategyProvider implements Provider<AuthenticationStrategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA) private metadata: MyAuthenticationMetadata,
        @repository(UserRepository) private userRepository: UserRepository,
        @repository(UserRoleRepository) private userRoleRepository: UserRoleRepository,
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
                (payload:any, done:any) => this.verifyToken(payload, done),
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
                throw new HttpErrors.Unauthorized("Invalid authorization");
            }


        } catch (err) {
            if (err.name === 'UnauthorizedError') done(null, false);
            done(err, false);
        }
    }

    // verify user's role based on the SecuredType
    async verifyRoles(idUser: number) {
        const {type, roles} = this.metadata;

        if ([SecuredType.IS_AUTHENTICATED, SecuredType.PERMIT_ALL].includes(type)) return;

        if (type === SecuredType.HAS_ANY_ROLE) {
            if (!roles.length) return;
            const {count} = await this.userRoleRepository.count({
                idUser: idUser,
                idRole: {inq: roles},
            });

            if (count) return;
        } else if (type === SecuredType.HAS_ROLES && roles.length) {
            const userRoles = await this.userRoleRepository.find({where: {idUser: idUser}});

            const roleIds = userRoles.map((ur: UserRole) => ur.idRole);

            let valid = true;
            for (const role of roles) {
                if (!roleIds.includes(role)) {
                    valid = false;
                    break;
                }
            }
            if (valid) return;
        }
        throw new HttpErrors.Unauthorized('Invalid authorization');
    }
}
