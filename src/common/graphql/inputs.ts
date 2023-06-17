import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StringQuery {
  @Field({ nullable: true })
  equalTo?: string;

  @Field({ nullable: true })
  notEqualTo?: string;

  @Field({ nullable: true })
  exists: boolean;
}
