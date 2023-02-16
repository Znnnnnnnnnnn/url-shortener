import { GetServerSideProps } from "next";

export default function UrlRedirect() {
  // not necessary, but need to return something
  return <div>redirecting...</div>;
}

// TODO: retrieve real url from DB
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;

  const DUMMY_REDIRECT = "https://www.google.com";

  if (id)
    return {
      redirect: {
        permanent: false,
        destination: DUMMY_REDIRECT
      }
    };

  return {
    props: {}
  };
};
