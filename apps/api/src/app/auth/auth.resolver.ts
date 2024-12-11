import { Resolver, Query, Mutation, Args, Int, Subscription, Parent, ResolveField } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginReturn } from './types/loginReturn.type';
import { SignUpDto } from './dto/signup.input';
import { Inject, Res, UseGuards } from '@nestjs/common';
import { RecaptchaGuard } from '../_core/guards/recaptcha.guard';
import { LoginDto } from './dto/login.input';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { updateProfileDto } from './dto/updateProfile.input';
import { CurrentUser } from './jwt/current-user.decorators';


@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RecaptchaGuard)
  @Mutation((returns) => LoginReturn)
  signup(@Args('signupInput') signupInput: SignUpDto) {
    return this.authService.signup(signupInput);
  }

  @Mutation((returns) => LoginReturn)
  cofirmEmailToken(@Args('cofirmEmailToken') token: string) {
    return this.authService.cofirmEmailToken(token);
  }

  @UseGuards(RecaptchaGuard)
  @Mutation((returns) => LoginReturn)
  sendPasswordResetEmail(@Args('email') email: string) {
    return this.authService.sendPasswordResetEmail(email);
  }

  @UseGuards(RecaptchaGuard)
  @Mutation((returns) => LoginReturn)
  resetPassword(@Args('password') password: string, @Args('passwordResetToken') token: string) {
    return this.authService.resetPassword(password, token);
  }

  @UseGuards(RecaptchaGuard)
  @Mutation((returns) => LoginReturn)
  login(@Args('loginInput') loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => LoginReturn)
  signInUsingToken(@Args('accessToken') accessToken: string) {
    return this.authService.signInUsingToken(accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => LoginReturn)
  updateProfile(@Args('updateProfileInput') updateProfileInput: updateProfileDto, @Args('changeAvatar') changeAvatar: boolean, @Args('changeHeaderPic') changeHeaderPic: boolean,  @CurrentUser() _user: Auth) {
    return this.authService.updateProfile(updateProfileInput, changeAvatar, changeHeaderPic, _user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => LoginReturn)
  updatePassword(@Args('password') password: string, @Args('newPassword') newPassword: string, @CurrentUser() _user: Auth) {
    return this.authService.updatePassword(password, newPassword, _user);
  }

  @ResolveField(() => String)
  async fullname(@Parent() user: Auth) {
    return `${user.firstname} ${user.lastname}`;
  }
}
