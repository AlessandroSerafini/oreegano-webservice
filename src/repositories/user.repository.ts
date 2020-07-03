import {Count, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {User, UserRelations} from "../models/user.model";
import {environment} from "../env/environment";
import {HttpErrors} from "@loopback/rest";
import {PasswordHasherBindings} from "../utils/namespaces";
import {PasswordHasher} from "../services/hash.password.bcryptjs";
import {promisify} from "util";
import {sign} from "jsonwebtoken";
import {Credentials, JwtResponse} from "../utils/interfaces";
import {Address, Store} from '../models';
import {AddressRepository} from './address.repository';
import {StoreRepository} from './store.repository';

const signAsync = promisify(sign);

export class UserRepository extends DefaultCrudRepository<User,
    typeof User.prototype.id,
    UserRelations> {

  public readonly addresses: HasManyRepositoryFactory<Address, typeof User.prototype.id>;

  public readonly stores: HasManyRepositoryFactory<Store, typeof User.prototype.id>;

    constructor(
        @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
        @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher, @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>, @repository.getter('StoreRepository') protected storeRepositoryGetter: Getter<StoreRepository>,
    ) {
        super(User, dataSource);
      this.stores = this.createHasManyRepositoryFactoryFor('stores', storeRepositoryGetter,);
      this.registerInclusionResolver('stores', this.stores.inclusionResolver);
      this.addresses = this.createHasManyRepositoryFactoryFor('addresses', addressRepositoryGetter,);
      this.registerInclusionResolver('addresses', this.addresses.inclusionResolver);
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

    public async getJwtToken(user: User): Promise<JwtResponse> {
        const token = await this.generateToken(user);
        const res:User = JSON.parse(JSON.stringify(user));
        delete res.password;
        return {
            id: token,
            user: res
        }
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
