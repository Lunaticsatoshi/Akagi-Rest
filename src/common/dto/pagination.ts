import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class PaginationDto {
  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => Int)
  limit: number;

  @Field({ nullable: true })
  after?: string;
}
