import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('RicksBlogStandard');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub
  });

  if (!userProfile || !userProfile.availableTokens) {
    return res.status(403);
  }

  console.log('User Profile: ', userProfile);

  const config = new Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  const postContentResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [{
      role: 'system',
      content: 'You are a blog post generator'
    }, {
      role: 'user',
      content: `Write a detailed and SEO-friendly blog post about ${topic},
      that targets the following comma-separated: ${keywords} and is formatted in SEO-friendly HTML
      using only the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
    }]
  }).catch( err => console.log('postContentResponse ERROR: ', err));

  const postContent = postContentResponse.data.choices[0]?.message?.content?.split('\n').join('') || "";

  const titleResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [{
      role: 'system',
      content: 'You are a blog post generator'
    }, {
      role: 'user',
      content: `Write a short and SEO-friendly blog post about ${topic},
      that targets the following comma-separated: ${keywords} and is formatted in SEO-friendly HTML
      using only the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
    }, {
      role: 'assistant',
      content: postContent,
    }, {
      role: 'user',
      content: 'Generate appropriate title for the above blog post without enclosing quotations'
    }]
  }).catch( err => console.log('titleResponse ERROR: ', err));

  const metaResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [{
      role: 'system',
      content: 'You are a blog post generator'
    }, {
      role: 'user',
      content: `Write a short and SEO-friendly blog post about ${topic},
      that targets the following comma-separated: ${keywords} and is formatted in SEO-friendly HTML
      using only the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
    }, {
      role: 'assistant',
      content: postContent,
    }, {
      role: 'user',
      content: 'Generate SEO friendly meta description content for the above blog post'
    }]
  }).catch( err => console.log('metaResponse ERROR: ', err));

  const title = titleResponse.data.choices[0]?.message?.content || "";
  const metaDescription = metaResponse.data.choices[0]?.message?.content || "";


  if (metaResponse.status === 200) {
    await db.collection('users').updateOne({
      auth0Id: user.sub
    }, {
      $inc: {
        availableTokens: -1
      }
    });

    const post = await db.collection('posts').insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      created: new Date()
    });

    res.status(200).json({ postId: post.insertedId });
  }
}
