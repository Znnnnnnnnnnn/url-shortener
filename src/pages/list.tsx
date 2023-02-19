import { ChangeEvent, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";

import { UrlForm } from "~/components";
import { findAllUrl, addUrl } from "~/lib";
import { Url } from "~/types";

interface IList {
  urls: Url[];
  error: string;
}

export default function List({ urls }: IList) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSubmit = async () => {
    fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url
      })
    })
      .then((res) => {
        if (res.ok) return router.reload();

        return res.json();
      })
      .then((data) => setError(data.message))
      .catch(() => setError("Failed to add url"));
  };

  const handleModalOpen = () => setIsCreateModalOpen(true);
  const handleModalClose = () => setIsCreateModalOpen(false);
  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <>
      <Flex p={8} direction="column" alignItems="flex-end">
        <Button colorScheme="teal" onClick={handleModalOpen}>
          Create
        </Button>
        <TableContainer
          width={"100%"}
          p={4}
          mt={4}
          border="1px"
          borderRadius={16}
        >
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
      </Flex>
      <Modal isOpen={isCreateModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UrlForm url={url} onUrlChange={onUrlChange} />
          </ModalBody>

          <ModalFooter>
            <Button variant={"outline"} mr={3} onClick={handleModalClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
