import { AppLayout } from '../components';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getAppProps } from '../utils/getAppProps';

export default function TokenTopup() {
  const handleClick = async () => {
    fetch('/api/addTokens', {
      method: 'POST'
    }).catch(err => console.error(err));
  }

  return (
    <div>
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