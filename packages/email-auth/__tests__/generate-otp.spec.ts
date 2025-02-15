import { setup, teardown } from './fixture';
import { EmailAuthServer } from '../src/email-auth-server';
import { MongooseStorageAdapter } from '../src/adapters';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';

describe('POST /otp/generate', () => {
  test.concurrent('generate otp', async function() {
    const ctx = await setup();

    const emailAddress = faker.internet.email();

    const userModel = ctx.mongoose.model(
      'User',
      new Schema({
        emailAddress: {
          type: String,
          index: 1,
          required: true,
        }
      }),
    );

    await userModel.create({
      emailAddress
    });

    const emailAdapter = {
      sendEmailOtp: jest.fn(async () => {})
    };
    
    const server = new EmailAuthServer(
      ctx.server,
      new MongooseStorageAdapter(ctx.mongoose, {
        userModel: 'User'
      }),
      emailAdapter
    );

    await server.init();

    await ctx.request
      .post('/otp/generate')
      .send({
        emailAddress
      })
      .expect(200);

    await teardown(ctx);
  });

  test.concurrent('user does not exist', async () => {
    const ctx = await setup();

    const emailAddress = faker.internet.email();

    ctx.mongoose.model(
      'User',
      new Schema({
        emailAddress: {
          type: String,
          index: 1,
          required: true,
        }
      }),
    );

    const emailAdapter = {
      sendEmailOtp: jest.fn(async () => {})
    };
    
    const server = new EmailAuthServer(
      ctx.server,
      new MongooseStorageAdapter(ctx.mongoose, {
        userModel: 'User'
      }),
      emailAdapter
    );

    await server.init();

    await ctx.request
      .post('/otp/generate')
      .send({
        emailAddress
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error.code).toBe('USER_NOT_FOUND');
      });

    await teardown(ctx);
  });
});
