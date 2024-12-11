import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly httpService: HttpService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const {body} =  ctx.getContext().req;
    const formData = new FormData();
    const secret = this.configService.get('RECAP_SECRET_KEY');
    formData.append('secret', secret);
    formData.append('response', body.variables.recaptcha);
    const { data } = <any> await this.httpService
      .post(
        `https://challenges.cloudflare.com/turnstile/v0/siteverify`, formData
      )
      .toPromise();
    if (!data.success) {
      throw new ConflictException('Çok ama çok şüphelisiniz. Hack mi oluyoruz ne? Hacklemiyorsanız lütfen tekrar deneyin.');
    }
    return true;
  }
}
