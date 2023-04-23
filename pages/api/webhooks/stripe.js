import Cors from 'micro-cors';
import stripeInit from 'stripe';
import verifyStripe from '@webdeveducation/next-verify-stripe';
import clientPromise from '../../../lib/mongodb';

const cors = Cors({
  allowedMethods: ['POST', 'HEAD']
});

export const config = {
  api: {
    bodyParser: false
  }
}

const stripe = new stripeInit(process.env.STRIPE_SECRET_KEY, process.env.STRIPE_PRODUCT_ID)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const handler = async (req, res) => {
  if (req.method === 'POST') {
    let event;
    try{
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret
      })
    }catch (e) {
      console.log('ERROR: ', e);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        debugger;
        const client = await clientPromise;
        const db = client.db('RicksBlogStandard');

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        const userProfile = await db.collection("users")
          .updateOne({ auth0Id }, {
            $inc: { availableTokens: 10 },
            $setOnInsert: { auth0Id }
          }, { upsert: true })
      }
      default:
        console.log('UNHANDLED EVENT', event.type);
    }
    res.status(200).json({ received: true })
  }
}

export default cors(handler);