import { GetServerSideProps } from "next";

import { findSingleUrl } from "~/lib";

export default function UrlRedirect() {
  // not necessary, but need to return something
  return <div>redirecting...</div>;
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res
}) => {
  const { id } = query;

  try {
    const { url } = await findSingleUrl(String(id));
    // FIXME: when url has no http protocol, its an internal redirect
    res.writeHead(307, { Location: url });
    res.end();

    return { props: {} };
  } catch {
    return {
      props: {},
      redirect: {
        destination: "/list"
      }
    };
  }
};
