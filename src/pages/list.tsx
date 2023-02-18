import { GetServerSideProps } from "next";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from "@chakra-ui/react";

import { findAllUrl, Url } from "~/lib";

interface IList {
  urls: Url[];
  error: string;
}

export default function List({ urls }: IList) {
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>UUID</Th>
              <Th>URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {urls.map(({ uuid, url }) => (
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
    error = "Failed to fetch list of url";
  }

  return {
    props: {
      error,
      urls
    }
  };
};
