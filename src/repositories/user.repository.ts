import {Count, DefaultCrudRepository, repository} from '@loopback/repository';
import {TesiAlessandroSerafiniWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {User, UserRelations} from "../models/user.model";
import {environment} from "../env/environment";
import {HttpErrors} from "@loopback/rest";
import {PasswordHasherBindings} from "../utils/namespaces";
import {PasswordHasher} from "../services/hash.password.bcryptjs";
import {UserRoleRepository} from "./user-role.repository";
import {UserRoles} from "../utils/enums";
import {promisify} from "util";
import {sign} from "jsonwebtoken";
import {UserRole} from "../models/user-role.model";
import {Credentials} from "../utils/interfaces";

const signAsync = promisify(sign);

export class UserRepository extends DefaultCrudRepository<User,
    typeof User.prototype.id,
    UserRelations> {
    constructor(
        @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
        @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
        @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
    ) {
        super(User, dataSource);
    }

    public handleApiKeyAuth(apiKey: string): void {
        if (apiKey !== environment.API_KEY) {
            throw new HttpErrors.Unauthorized('Authentication with apiKey param failed');
        }
    }

    public async validateUser(user: User): Promise<User> {
        const resUser = JSON.parse(JSON.stringify(user));
        const existingUserCount: Count = await this.count({email: user.email});
        if (existingUserCount.count > 0)
            throw new HttpErrors.Conflict(user.email + ' is already existing');

        resUser.password = await this.passwordHasher.hashPassword(user.password);
        return new Promise(resolve => resolve(resUser));
    }

    public async generateToken(user: User): Promise<any> {
        const tokenObject = {idUser: user.id};
        return signAsync(tokenObject, environment.JWT_SECRET);
    }

    public async getJwtToken(user: User): Promise<any> {
        const token = await this.generateToken(user);
        const roles = await this.userRoleRepository.find({where: {idUser: user.id}});

        return {
            id: token,
            user: {
                id: user.id,
                email: user.email,
                roles: roles.map((role: UserRole) => role.idRole)
            }
        }
    }

    public async updateUserPermissions(user: User, permissions: UserRoles): Promise<null> {
        await this.userRoleRepository.create({
            idUser: user.id,
            idRole: permissions
        });
        return new Promise(resolve => resolve());
    }

    public async isPasswordMatched(credentials: Credentials, user: User): Promise<boolean> {
        const isSamePassword: boolean = await this.passwordHasher.comparePassword(credentials.password, user.password);
        return new Promise(resolve => resolve(isSamePassword));
    }

    public async handleLogin(user: User | null, credentials: Credentials): Promise<any> {
        if (!user) throw new HttpErrors.Unauthorized('Invalid credentials');

        if (!await this.isPasswordMatched(credentials, user)) throw new HttpErrors.Unauthorized('Invalid credentials');

        return new Promise(resolve => resolve(this.getJwtToken(user)));

    }

    public validateEmail(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}