import { findAllUrl, Url } from "~/lib";

export default function Home({ urls }: { urls: Url[] }) {
  return (
    <>
      <ul>
        {urls.map((u) => (
          <li key={u.uuid}>
            {u.uuid} - {u.url}
          </li>
        ))}
      </ul>
    </>
  );
}

export const getServerSideProps = async () => {
  let urls: Url[] = [];
  try {
    urls = await findAllUrl();
  } catch (error) {
    console.log(error);
  }

  return {
    props: { urls }
  };
};
