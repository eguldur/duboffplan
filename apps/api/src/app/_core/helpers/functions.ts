
import { ArgsType, Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { IsEmail, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator"
import { type } from "os";

export function convertTurkishToEnglish(trStr: string){
  return (trStr)
     .replace('i', 'İ')
     .replace('ı', 'I')
}

export function regexpSearch(fields: string[], value: string) {
  const returnQuery: any[] = []
  fields.forEach((element: string) => {
      returnQuery.push({ [element] : {$regex: value, $options: 'i'}})
      returnQuery.push({ [element] : {$regex: convertTurkishToEnglish(value), $options: 'i'}})
  });
  return returnQuery;
}


export function regexpSearch2(fields: string[], value: string) {
  const returnQuery: any[] = []
  fields.forEach((element: string)  => {
      returnQuery.push({ [element] : {$regex: value, $options: 'mi'}})
  });
  return returnQuery;
}

@ArgsType()
export class FetchPaginationData {
  @Field(() => Int, {nullable: true})
  @Min(0)
  page = 0

  @Field(() => Int, {nullable: true})
  @Min(1)
  @Max(1000)
  size = 50

  @Field({nullable: true})
  sort: string

  @Field({nullable: true})
  order?: string

  @Field({ nullable: true })
  search?: string

  @Field({ nullable: true })
  baseFilter?: string

  @Field({ nullable: true })
  filter?: string
  
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  status?: string

  @Field(type => [String], { nullable: true })
  selectedIds?: string[]
}
@ObjectType()
export class From {
  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  contact: string;
}

@ObjectType()
export class ReturnCauntData {
  @Field({ nullable: true })
  count1: number;

  @Field({ nullable: true })
  count2: number;
}

@ObjectType()
export class ReturnIsOkData {
  @Field({ nullable: true })
  isOk: string;

}
@ObjectType()
export class Attachment {
  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  size: number;

  @Field({ nullable: true })
  preview: string;

  @Field({ nullable: true })
  downloadUrl: string;
}


@ObjectType()
export class ReturnPaginationData {

  @Field({ nullable: true })
  length: number;

  @Field({ nullable: true })
  size: number;

  @Field({ nullable: true })
  page: number;

  @Field({ nullable: true })
  lastPage: number;

  @Field({ nullable: true })
  startIndex: number;

  @Field({ nullable: true })
  endIndex: number;
}

@ObjectType()
export class ReturnPaginationDataMail {

  @Field({ nullable: true })
  totalResults: number;

  @Field({ nullable: true })
  resultsPerPage: number;

  @Field({ nullable: true })
  currentPage: number;

  @Field({ nullable: true })
  lastPage: number;

  @Field({ nullable: true })
  startIndex: number;

  @Field({ nullable: true })
  endIndex: number;
}
@InputType()
export class CreateBaseModulesInput {

  @Field()
  @MinLength(1)
  id: string;

  @MinLength(1)
  @Field()
  title: string;

  @MinLength(1)
  @Field()
  subtitle: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field({ nullable: true })
  isActive: boolean;
}

@InputType()
export class CreateBaseSettingsInput {

  @Field()
  @MinLength(1)
  id: string;

  @MinLength(1)
  @Field()
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  naceKodu: string;

  @Field({ nullable: true })
  sirano: number;

  @Field({ nullable: true })
  deflatorKatsayisi: number;
  
  @Field({ nullable: true })
  imzaTarihi: Date;

  @Field({ nullable: true })
  gecerlilikBaslangic: Date;

  @Field({ nullable: true })
  gecerlilikBitis: Date;

  @Field({ nullable: true })
  birBesIzinSuresi: number;

  @Field({ nullable: true })
  altiOnBesIzinSuresi: number;

  @Field({ nullable: true })
  onBesIzinSuresi: number;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  tehlikeDurumu: string;

  @Field({ nullable: true })
  basekat: string;
}
@InputType()
export class CreateSubModulesInput {

  @Field()
  @MinLength(1)
  id: string;

  @MinLength(1)
  @Field()
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  link: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  basemodule: string;
}


@InputType()
export class CreateUsersInput {

  @Field()
  @MinLength(1)
  @IsString()
  id: string;

  @MinLength(1)
  @Field()
  @IsString()
  firstname: string;

  @Field({nullable: true})
  lastname: string;

  @MinLength(1)
  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'Şifre sekiz karakterden kısa olamaz' })
  @MaxLength(32)
  // eslint-disable-next-line no-useless-escape
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*]).*$/, {
    message: 'Şifreniz en az 1 Büyük Harf 1 Küçük Harf 1 Rakam ve 1 Özel Karakter (!.@#$%^&*) İçermelidir',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== null && value !== '')
  password: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  isEmailActive: boolean;

  @Field()
  @MinLength(1)
  @IsString()
  role: string;

  @Field({ nullable: true })
  @MinLength(1)
  @IsString()
  personel?: string;

}

@InputType()
export class CreatePermissionsInput {

  @Field()
  @MinLength(1)
  id: string;

  @MinLength(1)
  @Field()
  title: string;

  @Field({ nullable: true })
  basemodule: string;

  @Field({ nullable: true })
  submodule: string;
}


@InputType()
export class CreateRolesInput {

  @Field()
  @MinLength(1)
  id: string;

  @MinLength(1)
  @Field()
  title: string;

  @Field(type => [Number], { nullable: true })
  permissions?: number[];
}

@InputType()
export class SendMailInput {

  @Field(type => [String], { nullable: true })
  to: string[];

  @MinLength(1)
  @Field(type => String, { nullable: true })
  subject: string;

  @MinLength(1)
  @Field(type => String, { nullable: true })
  content: string;

}

