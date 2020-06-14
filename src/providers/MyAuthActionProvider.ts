import {Getter, inject, Provider, Setter,} from '@loopback/core';
import {AuthenticateFn, AuthenticationBindings, AuthenticationStrategy,} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {Request} from '@loopback/rest';
import {SecuredType} from "../utils/enums";
import {MyAuthenticationMetadata} from "../utils/interfaces";
import {MyAuthBindings} from "../utils/namespaces";

export class MyAuthActionProvider implements Provider<AuthenticateFn> {
  constructor(
    @inject.getter(MyAuthBindings.STRATEGY) readonly getStrategy: Getter<AuthenticationStrategy>,
    @inject.setter(AuthenticationBindings.CURRENT_USER) readonly setCurrentUser: Setter<UserProfile>,
    @inject.getter(AuthenticationBindings.METADATA) readonly getMetadata: Getter<MyAuthenticationMetadata>,
  ) {
  }

  value(): AuthenticateFn {
    return request => this.action(request);
  }

  async action(request: Request): Promise<UserProfile | undefined> {
    const metadata = await this.getMetadata();
    if (metadata && metadata.type === SecuredType.PERMIT_ALL) return;
    const strategy = await this.getStrategy();
    if (!strategy) return;

    const user = await strategy.authenticate(request);
    if (!user) return;

    this.setCurrentUser(<UserProfile>user);
    return <UserProfile>user;
  }
}
