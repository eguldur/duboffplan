/* eslint-disable no-empty */
import { Injectable } from '@nestjs/common';

import { createHash, randomBytes } from 'crypto';
import { existsSync, mkdirSync, promises } from 'fs';
import { Buffer } from 'buffer';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');


@Injectable()
export class UploadFromBase64Service {
  async decodeBase64Image(dataString: string): Promise<any> {
    // eslint-disable-next-line no-useless-escape
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response: any = {};

    if (matches && matches.length !== 3) {
      return new Error('Invalid input string');
    } else {

      response.type = matches?matches[1]:null;
      response.data =  matches?Buffer.from(matches[2],  'base64'):null;
  
      return response;
    }

   
  }

  async uploadBase64(imagebas64: string): Promise<any> {
    const imageTypeRegularExpression = /\/(.*?)$/;
    const seed = randomBytes(20);
    const uniqueSHA1String = createHash('sha1').update(seed).digest('hex');
    const base64Data = imagebas64.toString();
    const imageBuffer = await this.decodeBase64Image(base64Data);
    const userUploadedFeedMessagesLocation =  join(__dirname, 'img', 'uploads');
    const uniqueRandomImageName = '/image-' + uniqueSHA1String;
    const imageTypeDetected = imageBuffer.type.match(
      imageTypeRegularExpression
    );

    if (imageTypeDetected[1] != 'png' && imageTypeDetected[1] != 'jpeg') {
    }
    const userUploadedImagePath =
      userUploadedFeedMessagesLocation +
      uniqueRandomImageName +
      '.' +
      imageTypeDetected[1];
    try {
      await promises.writeFile(userUploadedImagePath, imageBuffer.data);
    } catch (error) {
    }
    return (uniqueRandomImageName +
    '.' +
    imageTypeDetected[1]).substring(1);
  }

  async uploadBase64Sharp(imagebas64: string): Promise<any> {

    const seed = randomBytes(20);
    const uniqueSHA1String = createHash('sha1').update(seed).digest('hex');
    const uniqueRandomImageName = '/image-' + uniqueSHA1String;
    const base64Data = imagebas64.toString();
    const imageBuffer = await this.decodeBase64Image(base64Data);

    const folder =  (new Date()).getFullYear() + '/' + (new Date()).getMonth() + '/' + (new Date()).getDate();

    const userUploadedFeedMessagesLocation =  join(__dirname, 'img', 'uploads', folder);

    await this.createDirIfNotExists(userUploadedFeedMessagesLocation);


    await sharp(imageBuffer.data)
      .webp({ lossless: true })
      .toFile( userUploadedFeedMessagesLocation + uniqueRandomImageName +'.webp');

    return (folder + uniqueRandomImageName +
        '.webp');
  }

  async createDirIfNotExists(dir)  {
    !existsSync(dir) ? mkdirSync(dir, {recursive: true}) : undefined;
  }   
}
