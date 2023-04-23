import { AppLayout } from '../components';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getAppProps } from '../utils/getAppProps';

export default function TokenTopup() {
  const handleClick = async () => {
    const results = await fetch('/api/addTokens', {
      method: 'POST'
    }).catch(err => console.error(err));

    const json = await results.json();
    console.log('Results: ', json);
    window.location.href = json.session.url;
  }



  return (
    <div className={'px-2'}>
      <h1>This is the Token Topup page</h1>
      <button className="btn" onClick={handleClick}>Add tokens</button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props
    }
  }
})