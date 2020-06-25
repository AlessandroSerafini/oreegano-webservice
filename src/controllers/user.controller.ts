import {repository,} from '@loopback/repository';
import {getModelSchemaRef, HttpErrors, param, post, requestBody,} from '@loopback/rest';
import {User} from "../models/user.model";
import {inject} from "@loopback/context";
import {PasswordHasherBindings} from "../utils/namespaces";
import {PasswordHasher} from "../services/hash.password.bcryptjs";
import {UserRepository} from "../repositories";
import {Credentials, JwtResponse} from "../utils/interfaces";
import {EmailService} from "../services/email.service";
import moment = require("moment");

const PSW_REC_INTERVAL_HOURS = 24;
const PSW_REC_TOKEN_INTERVAL_HOURS = 168;

export class UserController {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject('services.EmailService') private emailService: EmailService,
        @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher
    ) {
    }

    @post('/users/signup', {
        operationId: 'Signup',
        responses: {
            '200': {
                description: 'User model instance',
                content: {'application/json': {schema: getModelSchemaRef(User)}},
            },
        },
    })
    async create(
      @param.header.string('apiKey') apiKey = '',
      @requestBody({
          content: {
              'application/json': {
                  schema: getModelSchemaRef(User, {
                      title: 'NewUser',
                      exclude: ['id', 'pswRecToken', 'pswRecTokenExpireDate', 'pswRecExpireDate'],
                  }),
              },
          },
      })
        user: Omit<User, 'id'>,
    ): Promise<JwtResponse> {
        this.userRepository.handleApiKeyAuth(apiKey);
        if (!this.userRepository.validateEmail(user.email))
            throw new HttpErrors.BadRequest('E-mail address isn\'t valid');

        const mappedUser: User = await this.userRepository.validateUser(user);
        console.log(mappedUser);
        const newUser: User = await this.userRepository.create(mappedUser);

        return new Promise(resolve => resolve(this.userRepository.getJwtToken(newUser)));
    }

    @post('/users/signin', {
        operationId: 'Signin',
        responses: {
            '200': {
                description: 'JWT model instance'
            },
        },
    })
    async login(@param.header.string('apiKey') apiKey = '',
                @requestBody({
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {type: 'string'},
                                    password: {type: 'string'},
                                },
                            },
                        },
                    },
                })
                    credentials: Credentials) {
        this.userRepository.handleApiKeyAuth(apiKey);

        if (!this.userRepository.validateEmail(credentials.email))
            throw new HttpErrors.BadRequest('E-mail address isn\'t valid');

        if (!(credentials.email && credentials.password))
            throw new HttpErrors.BadRequest('Missing E-mail or Password');

        const user: User | null = await this.userRepository.findOne({where: {email: credentials.email}});

        return this.userRepository.handleLogin(user, credentials);
    }

    @post('/users/password-recovery', {
        operationId: 'Password recovery',
        description: 'Recover user password: the procedure will be sent by email',
        responses: {
            responses: {
                '200': {
                    description: 'Mail sent successfully',
                },
            },
        },
    })
    async passwordRecovery(
        @param.header.string('apiKey') apiKey = '',
        @requestBody({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {type: 'string'}
                        },
                    },
                },
            },
        })
            data: {
            email: string
        },
    ): Promise<undefined> {
        this.userRepository.handleApiKeyAuth(apiKey);

        if (typeof data.email === "undefined" || !data.email) throw new HttpErrors.BadRequest('E-mail is missing');

        if (!this.userRepository.validateEmail(data.email))
            throw new HttpErrors.BadRequest('E-mail address isn\'t valid');

        const user: User | null = await this.userRepository.findOne({where: {email: data.email}});

        if (!user) throw new HttpErrors.BadRequest('This user doesn\'t exists');

        if (user.pswRecExpireDate && moment(user.pswRecExpireDate).isSameOrAfter(moment()))
            throw new HttpErrors.BadRequest('You have already requested the password, check your email');

        const pswRecToken = await this.userRepository.generateToken(user);
        const pswRecExpireDate = moment(moment.utc(moment().add(PSW_REC_INTERVAL_HOURS, 'hours'))).local().toDate();
        const pswRecTokenExpireDate = moment(moment.utc(moment().add(PSW_REC_TOKEN_INTERVAL_HOURS, 'hours'))).local().toDate();

        await this.userRepository.updateById(user.id, {
            pswRecExpireDate,
            pswRecToken,
            pswRecTokenExpireDate
        });

        user.pswRecExpireDate = pswRecExpireDate;
        user.pswRecToken = pswRecToken;
        user.pswRecTokenExpireDate = pswRecTokenExpireDate;

        await this.emailService.sendPassword(user);

        return new Promise(resolve => resolve());
    }

    @post('/users/password-reset/{token}', {
        operationId: 'Reset password',
        responses: {
            '200': {
                description: 'Password RESET success',
            },
        },
    })
    async resetPasswordByToken(
      @param.header.string('apiKey') apiKey = '',
      @param.path.string('token') token: string,
      @requestBody({
          required: true,
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          password: {type: 'string'}
                      },
                  },
              },
          },
      })
        data: any,
    ): Promise<JwtResponse> {
        this.userRepository.handleApiKeyAuth(apiKey);
        const user: User | null = await this.userRepository.findOne({where: {pswRecToken: token}});

        if (!user)
            throw new HttpErrors.BadRequest('Token not valid');

        if (!data.password)
            throw new HttpErrors.BadRequest('Missing new password');

        if (user.pswRecTokenExpireDate && moment(moment()).isSameOrAfter(user.pswRecTokenExpireDate))
            throw new HttpErrors.BadRequest('This token is expired. You have to require password reset again.');

        await this.userRepository.updateById(user.id, {
            password: await this.passwordHasher.hashPassword(data.password),
            pswRecToken: undefined,
            pswRecTokenExpireDate: undefined,
            pswRecExpireDate: undefined
        })

        const newUserData: User = await this.userRepository.findById(user.id);
        return new Promise(resolve => resolve(this.userRepository.getJwtToken(newUserData)));
    }

    /*@get('/users/count', {
        responses: {
            '200': {
                description: 'User model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async count(
        @param.header.string('apiKey') apiKey = '',
        @param.where(User) where?: Where<User>,
    ): Promise<Count> {
        this.userRepository.handleApiKeyAuth(apiKey);
        return this.userRepository.count(where);
    }*/

    /*@get('/users', {
        responses: {
            '200': {
                description: 'Array of User model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(User, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    async find(
        @param.header.string('apiKey') apiKey = '',
        @param.filter(User) filter?: Filter<User>,
    ): Promise<User[]> {
        this.userRepository.handleApiKeyAuth(apiKey);
        return this.userRepository.find(filter);
    }*/

    /*@patch('/users/{id}', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '204': {
                description: 'User PATCH success',
            },
        },
    })
    @secured(SecuredType.IS_AUTHENTICATED)
    async updateById(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(User, {partial: true}),
                },
            },
        })
            user: User,
    ): Promise<void> {
        await this.userRepository.updateById(id, user);
    }*/

    /*@del('/users/{id}', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '204': {
                description: 'User DELETE success',
            },
        },
    })
    @secured(SecuredType.IS_AUTHENTICATED)
    async deleteById(
        @param.path.number('id') id: number): Promise<void> {
        await this.userRepository.deleteById(id);
    }*/
}
