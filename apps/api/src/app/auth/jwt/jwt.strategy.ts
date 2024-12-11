import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth, AuthDocument } from "../entities/auth.entity";

@Injectable()

export class JwtStrategy extends PassportStrategy (Strategy) {
 constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>, private configService: ConfigService) {
   super({
    secretOrKey: configService.get('JWT_SECRET_KEY'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
   });
 }

async validate(payload: any): Promise<Auth> {

  const userId = payload.userId;
  const user = await this.authModel.findOne({_id: userId, isActive: true}).populate('role').exec();
 // const user = await this.authModel.findOne({_id: userId, isActive: true}).exec();

    if(!user) {
    throw new UnauthorizedException();
  }
  return user;
}

}
