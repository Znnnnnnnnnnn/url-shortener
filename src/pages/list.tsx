import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button
} from "@chakra-ui/react";

import { findAllUrl, addUrl } from "~/lib";
import { Url } from "~/types";

interface IList {
  urls: Url[];
  error: string;
}

export default function List({ urls }: IList) {
  const router = useRouter();

  const handleUrlSubmit = async () => {
    fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: "baidus.com"
      })
    })
      .then(router.reload)
      .catch((error) => console.error(error));
  };
  return (
    <>
      <Button colorScheme="teal" size="lg" onClick={handleUrlSubmit}>
        Button
      </Button>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>UUID</Th>
              <Th>URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {urls.reverse().map(({ uuid, url }) => (
              <Tr key={uuid}>
                <Td>{uuid}</Td>
                <Td>{url}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let urls: Url[] = [];
  let error = "";
  try {
    urls = await findAllUrl();
  } catch (error) {
    if (error instanceof Error) {
      error = error?.message;
    } else {
      error = "Failed to fetch list of url";
    }
  }

  return {
    props: {
      error,
      urls
    }
  };
};
