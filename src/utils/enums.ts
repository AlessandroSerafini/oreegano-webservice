import {ReferenceObject, SecuritySchemeObject} from '@loopback/openapi-v3';

export const JWT_STRATEGY_NAME = 'jwt';

// enum for available secured type,
export enum SecuredType {
  IS_AUTHENTICATED, // any authenticated user
  PERMIT_ALL,       // bypass security check, permit everyone
  HAS_ANY_ROLE,     // user must have one or more roles specified in the `roles` attribute
  HAS_ROLES,        // user mast have all roles specified in the `roles` attribute
  DENY_ALL,         // you shall not pass!
}

export enum UserRoles {
  CUSTOMER = 1,
  STORE = 2
}

export const OPERATION_SECURITY_SPEC = [{bearerAuth: []}];

export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};

export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  }
};
