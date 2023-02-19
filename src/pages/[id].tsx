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

    const location =
      url.startsWith("https://") || url.startsWith("http://")
        ? url
        : `http://${url}`;
    res.writeHead(307, { Location: location });
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
