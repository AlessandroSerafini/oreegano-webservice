import {MethodDecoratorFactory,} from '@loopback/core';
import {AUTHENTICATION_METADATA_KEY,} from '@loopback/authentication';
import {SecuredType} from "../utils/enums";
import {MyAuthenticationMetadata} from "../utils/interfaces";

// the decorator function, every required param has its own default
// so we can supply empty param when calling this decorartor.
// we will use 'secured' to match Spring Security annotation.
export function secured(
  type: SecuredType = SecuredType.IS_AUTHENTICATED, // more on this below
  roles: number[] = [],
  strategy: string = 'jwt',
  options?: object,
) {
  // we will use a custom interface. more on this below
  return MethodDecoratorFactory.createDecorator<MyAuthenticationMetadata>(AUTHENTICATION_METADATA_KEY, {
    type,
    roles,
    strategy,
    options,
  });
}
