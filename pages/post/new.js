import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function NewPost(props) {
  console.log('props:', props);
  return (
    <div>
      <h1>This is the New Post page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {
        customProps: 'Testing custom prop with user data'
      }
    }
  }
});
