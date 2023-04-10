import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generatePost', {
      method: "POST",
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({topic, keywords})
    }).catch(err => console.log('ERROR: ', err));

    const json = await response.json();

    if (json && json.postId) {
      router.push(`/post/${json.postId}`).then();
    }
  }

  return (
    <div className={'px-2'}>
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
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps} >{page}</AppLayout>
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props
    }
  }
})
