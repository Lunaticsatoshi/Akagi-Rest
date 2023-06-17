import { Query, Resolver } from '@nestjs/graphql';

import { HelloService } from './user.service';

@Resolver()
export class HelloResolver {
  constructor(private readonly helloService: HelloService) {}
  @Query(() => String)
  hello() {
    return this.helloService.getHello();
  }
}
