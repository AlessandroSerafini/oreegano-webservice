import { AuthenticationMetadata, } from '@loopback/authentication';
import { SecuredType } from "./enums";
import { User } from "../models/user.model";

// extended interface of the default AuthenticationMetadata which only has `strategy` and `options`
export interface MyAuthenticationMetadata extends AuthenticationMetadata {
  type: SecuredType;
  role: number;
}

// the required interface to filter login payload
export interface JwtStructure {
  idUser: number;
}
export interface JwtResponse {
  id: string;
  user: Omit<User, 'password'>
}

export interface RichedActivactionCode {
  id: string
  active: boolean
  deviceId?: string
  username?: string
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RecoveryPasswordCredentials {
  username: string;
}
