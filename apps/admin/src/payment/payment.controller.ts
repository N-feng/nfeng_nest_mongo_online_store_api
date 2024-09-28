import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SKRT_KET_TST);

@Controller('payment')
export class PaymentController {
  @Post('stripe')
  @ApiOperation({ summary: 'stripe支付' })
  async update(@Body() body, @Res() res: Response) {
    const { email, name, address, amount, currency, description } = body;

    const customer = await stripe.customers.create({
      email: email,
      name: name,
      address: address,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' },
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      description: description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PBLK_KET_TST,
    });
  }
}
