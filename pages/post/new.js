import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components';
import { useState } from 'react';

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("")
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generatePost', {
      method: "POST",
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({topic, keywords})
    });

    const json = await response.json();
    console.log("Results: ", json);
    setPostContent(json.post.postContent);
  }

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="topic">
            <strong>Generate a blog post about the following topic:</strong>
          </label>
          <textarea
            name="topic" id="topic" value={topic} className="txt-area"
            onChange={({target})=> setTopic(target.value)}>
          </textarea>
        </div>
        <div>
          <label htmlFor="">
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            name="keywords" id="keywords" value={keywords} className="txt-area"
            onChange={({target})=> setKeywords(target.value)}>
          </textarea>
        </div>
        <button className="btn" type="submit">
          Generate
        </button>
      </form>

      <div className="max-w-screen-sm p-10"
           dangerouslySetInnerHTML={{__html: postContent}}>
      </div>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps} >{page}</AppLayout>
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {
        customProps: 'Testing custom prop with user data'
      }
    }
  }
});
