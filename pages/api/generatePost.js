import { Configuration, OpenAIApi } from 'openai';// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const config = new Configuration({
    organization: 'org-yzczLc4QmK1qduPFX7nt72Wd',
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const topic = "Top 10 tips for web developers";
  const keywords = "new-graduates, common-issues, best-places-to-start";

  const response = await openai.createCompletion({
      model: "text-davinci-003",
      temperature: 0.6,
      max_tokens: 3600,
      //prompt: "Say hello"
      prompt: `Write a short and SEO-friendly blog post about ${topic}, that targets the following comma-separated: ${keywords}.
      The content should be formatted in SEO-friendly HTML.
      The response must also include appropriate HTML title and meta description content.
      The return format must be stringified JSON in the following format:
      {
        "postContent": post content here,
        "title": title goes here,
        "metaDescription": meta description goes here
      }`,
    }
  ).catch( err => console.error(err));


  if (response.status === 200) {
    res.status(200).json({ post: JSON.parse(response.data.choices[0].text) });
  }
}
