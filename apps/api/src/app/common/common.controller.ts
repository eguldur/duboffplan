import { Controller, Get, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CommonService } from './common.service';
const pubSub = new PubSub();

@Controller('common')
export class CommonController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(@Inject('PUB_SUB') private  _pubSub: PubSub, private readonly commonService: CommonService, ) {}
    @Get('test')
    async test() {
        await this._pubSub.publish('newNotify', { newNotify: {content: 'adasd'} });
        return 'ok';

    }
}
