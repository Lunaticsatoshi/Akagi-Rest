import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RazorpayPaymentSuccessResponseInput {
  @Field()
  razorpay_payment_id: string;

  @Field()
  razorpay_order_id: string;

  @Field()
  razorpay_signature: string;
}

@InputType()
export class RazorpayPaymentFailureResponseInput {
  @Field()
  code: string;

  @Field()
  description: string;

  @Field()
  source: string;

  @Field()
  step: string;

  @Field()
  reason: string;
}

@InputType()
export class VerifyPaymentSuccessInput {
  @Field()
  orderId: string;

  @Field()
  razorpaySuccessResponse: RazorpayPaymentSuccessResponseInput;
}

@InputType()
export class VerifyPaymentFailureInput {
  @Field()
  orderId: string;

  @Field()
  razorpayFailureResponse: RazorpayPaymentFailureResponseInput;
}
