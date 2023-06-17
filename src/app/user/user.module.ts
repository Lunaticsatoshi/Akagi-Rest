import { Module } from '@nestjs/common';

import { HelloResolver } from './user.resolver';
import { HelloService } from './user.service';

@Module({
  providers: [HelloResolver, HelloService],
  exports: [HelloService],
})
export class HelloModule {}
