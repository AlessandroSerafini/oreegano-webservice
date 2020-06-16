import { BindingKey, } from '@loopback/core';
import { AuthenticationStrategy, } from '@loopback/authentication';
import { PasswordHasher } from "../services/hash.password.bcryptjs";
import { EmailService } from "../services/email.service";

// implement custom namespace bindings
export namespace MyAuthBindings {
  export const STRATEGY = BindingKey.create<AuthenticationStrategy | undefined>('authentication.strategy');
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace EmailServiceBindings {
  export const EMAIL_SERVICE = BindingKey.create<EmailService>(
    'services.EmailService',
  );
}
