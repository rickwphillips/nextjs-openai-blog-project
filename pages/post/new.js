import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components';

export default function NewPost(props) {
  return (
    <div>
      <h1>This is the New Post page</h1>
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
