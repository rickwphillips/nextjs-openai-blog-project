import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenRuler } from '@fortawesome/free-solid-svg-icons/faPenRuler';

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/generatePost', {
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({topic, keywords})
      }).catch(err => console.log('ERROR: ', err));

      const json = await response.json();

      if (json && json.postId) {
        router.push(`/post/${json.postId}`).then();
      }
    } catch (e) {
      setGenerating(false);
    }
  }

  return (
    <div className="h-full overflow-hidden">
      {generating &&
      <div className="text-green-600 flex h-full w-full flex-col justify-center items-center animate-pulse">
        <FontAwesomeIcon icon={faPenRuler} className="text-5xl" />
        <h5 className="m-0">Creating...</h5>
      </div>
      }
      {!generating &&
        <div className="w-full h-full flex flex-col overflow-auto">
          <form onSubmit={handleSubmit} className="p-4 m-auto w-full max-w-screen-sm bg-slate-100 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
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
              <small className="block mb-2">Separate keywords with a comma</small>
            </div>
            <button className="btn" type="submit">
              Create
            </button>
          </form>
        </div>
      }
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
