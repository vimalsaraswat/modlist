import { Twilio } from "twilio";

import { messageEnv } from "../env";

const env = messageEnv();

const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

export interface SendSMSParams {
  body: string;
  from?: string;
  to: string;
}

export async function sendSMS({ body, from, to }: SendSMSParams) {
  const message = await client.messages.create({
    body,
    from: from ?? env.TWILIO_FROM_PHONE_NUMBER,
    to,
  });

  console.log("createMessage", message.body);
}
