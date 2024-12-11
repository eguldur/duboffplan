import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Auth, AuthDocument } from './entities/auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './dto/signup.input';
import * as bcrypt from 'bcrypt';
import { generate } from 'rand-token';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import { updateProfileDto } from './dto/updateProfile.input';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private imageBase64Service: UploadFromBase64Service,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<any> {
    try {
      const { email, password, firstname, lastname} = signUpDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const emailActivateToken = generate(32);
      const user = await this.authModel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        isEmailActive: false,
        emailActivateToken,
        emailActivateTokenDate: new Date(),
      });
      const token = emailActivateToken;
      const url = await `${this.configService.get('WEB_SITE')}/confirm-email/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'E-mail Adresi Doğrulama',
        template: './confirmation',
        context: {
          firstname: firstname,
          url,
        },
      });
      const returnUser = {
        user: user,
        tokenType: 'bearer',
      };
      return returnUser;
    } catch (error) {
      console.log(error);

      if (error.code === 11000) {
        throw new ConflictException('Email Adresi Kayıtlı');
      } else {
        
        throw new ConflictException('Kullanıcı Bilgileri Hatalı');
      }
    }
  }

  async cofirmEmailToken(token: string): Promise<any> {

    try {
      const user = await this.authModel.findOne({ emailActivateToken: token }).exec();
      if (user) {
        const userID = user._id;
        const updated = await this.authModel
          .findByIdAndUpdate(
            { _id: userID },
            {
              isEmailActive: true,
              emailActivateToken: null,
              emailActivateTokenDate: null,
            }
          )
          .exec();
        return {user: user};
      } else {
        throw new ConflictException('Kullanıcı Bulunamadı');
      }
    } catch (error) {
      throw new ConflictException('E-mail adresi doğrulanamadı');
    }
  }
  async sendPasswordResetEmail(email: string): Promise<any> {

    try {
      const user = await this.authModel.findOne({ email });
      if (user) {
        try {
          const userID = user._id;
          const resetPassToken = generate(32);
          await this.authModel
            .findByIdAndUpdate(
              { _id: userID },
              {
                resetPassToken: resetPassToken,
                resetPassTokenDate: new Date(),
              }
            )
            .exec();
  
          const url = await `${this.configService.get('WEB_SITE')}/reset-password/${resetPassToken}`;
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Şifre Sıfırlama Talebi',
            template: './resetpass',
            context: {
              firstname: user.firstname,
              url,
            },
          });
          return {message: 'Şifre sıfırlama linki email adresinize gönderildi'};
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException('Bir Hata Oluştu');
          } else {
            throw new ConflictException('Bir Hata Oluştu');
          }
        }
      } else {
        throw new ConflictException('Kullanıcı Bulunamadı');
      }
    } catch (error) {      
      throw new ConflictException('Bir Hata Oluştu');
    }
  }

  async resetPassword(password: string, resetPassToken: string): Promise<any> {
    const user = await this.authModel.findOne({ resetPassToken });
    if (user) {
      try {
        const userID = user._id;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await this.authModel
          .findByIdAndUpdate(
            { _id: userID },
            {
              password: hashedPassword,
              resetPassTokenDate: null,
              resetPassToken: null
            }
          )
          .exec();

        return {user: user};
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException('Bir Hata Oluştu');
        } else {
          throw new ConflictException('Bir Hata Oluştu');
        }
      }
    } else {
      throw new ConflictException('Şifreniz güncellenemedi');
    }
  }
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    
    const user = await this.authModel.findOne({ email, isActive: true }).exec();
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userId: user._id };
      const accessToken: string = this.jwtService.sign(payload, {
        subject: user.email,
      });
      const userData = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isEmailActive: user.isEmailActive,
        avatar: user.avatar ? user.avatar : null,
        headerPic: user.headerPic ? user.headerPic : null,
        title: user.title ?? null,
        about: user.about ?? null,
        phone: user.phone ?? null,
        address: user.address ?? null,
        name: user.firstname + ' ' + user.lastname,
      };
      const returnUser = {
        user: userData,
        accessToken: accessToken,
        tokenType: 'bearer',
      };
      return returnUser;
    } else {
      throw new ConflictException('Kullanıcı Bilgileri Hatalı');
    }
  }
  async signInUsingToken(token: string): Promise<any> {
    const result = await this.jwtService.verify(token);
    if(result){
    const user = await this.authModel.findById(result.userId).exec();
      if (user) {
        const payload = { userId: user._id };
        const accessToken: string = await this.jwtService.sign(payload, {
          subject: user.email,
        });
  
        const userData = {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          isEmailActive: user.isEmailActive,
          avatar: user.avatar ? user.avatar : null,
          headerPic: user.headerPic ? user.headerPic : null,
          title: user.title ?? null,
          about: user.about ?? null,
          phone: user.phone ?? null,
          address: user.address ?? null,
          name: user.firstname + ' ' + user.lastname,
        };
  
        const returnUser = {
          user: userData,
          accessToken: accessToken,
          tokenType: 'bearer',
        };
        return returnUser;
      } else {
        throw new ConflictException('Kullanıcı Bilgileri Hatalı');
      }
    }
    
  }

  async updateProfile(updateProfileDto: updateProfileDto, changeAvatar:boolean, changeHeaderPic: boolean, _user: Auth): Promise<any> {

    try {
      
      if (changeAvatar) {
        updateProfileDto.avatar = await this.imageBase64Service.uploadBase64Sharp(
          updateProfileDto.avatar
        );
      }

      if (changeHeaderPic) {
        updateProfileDto.headerPic = await this.imageBase64Service.uploadBase64Sharp(
          updateProfileDto.headerPic
        );
      }
        
      
      const { firstname, lastname, title, about, phone, address, avatar, headerPic } = updateProfileDto;
      const userID = _user.id;
      const updated = await this.authModel
        .findByIdAndUpdate(
          { _id: userID },
          {
            firstname,
            lastname,
            title,
            about,
            phone,
            address,
            avatar,
            headerPic
          },
          { new: true }
        )
        .exec();
        
      return {user: updated};
    } catch (error) {
      console.log(error);
      
      throw new ConflictException('Bir Hata Oluştu');
    }
  }

  async updatePassword(password: string, newPassword: string, _user: Auth): Promise<any> {
    if (_user) {
      try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        if (_user && (await bcrypt.compare(password, _user.password))) {
          const userID = _user.id;
          const updated: any = await this.authModel
            .findByIdAndUpdate(
              { _id: userID },
              { $set: { password: hashedPassword } },
              { new: true }
            )
            .exec();
       
          return {user: updated};
        } else {
          throw new ConflictException('Hatalı İşlem');
        }
      } catch (error) {
        throw new ConflictException('Hatalı İşlem');
      }
    } else {
      throw new ConflictException('Hatalı İşlem');
    }

  }
}
