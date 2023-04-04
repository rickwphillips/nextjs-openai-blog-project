import { Configuration, OpenAIApi } from 'openai';// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const config = new Configuration({
    organization: 'org-yzczLc4QmK1qduPFX7nt72Wd',
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  // const response = await openai.createCompletion({
  //     model: "text-davinci-003",
  //     temperature: 0.6,
  //     max_tokens: 3600,
  //     prompt: `Write a short and SEO-friendly blog post about ${topic},
  //     that targets the following comma-separated: ${keywords}.
  //     The content should be formatted in SEO-friendly HTML.
  //     The response must also include appropriate HTML title and meta description content.
  //     The return format must be stringified JSON in the following format:
  //     {
  //       "postContent": post content here,
  //       "title": title goes here,
  //       "metaDescription": meta description goes here
  //     }`,
  //   }
  // ).catch( err => console.error(err));

  const postContentResponse = await openai.createChatCompletion({
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
    }]
  }).catch( err => console.log('postContentResponse ERROR: ', err));

  const postContent = postContentResponse.data.choices[0]?.message?.content?.split('\n').join('') || "";

  console.log(postContentResponse.data.choices);

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
    console.log('POST CONTENT: ', postContent);
    console.log('TITLE: ', title);
    console.log('META DESC: ', metaDescription);
    res.status(200).json({ post: {
        title,
        metaDescription,
        postContent
      }
    });
  }
}
