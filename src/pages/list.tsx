import { ChangeEvent, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { DeleteIcon, CopyIcon } from "@chakra-ui/icons";
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
import { findAllUrl, deleteUrl } from "~/lib";
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
  const [deleteUrl, setDeleteUrl] = useState<Url | undefined>();

  const handleCreateSubmit = async () => {
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

  const handleDeleteSubmit = async () => {
    if (!deleteUrl) return;

    fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uuid: deleteUrl.uuid
      })
    })
      .then((res) => {
        if (res.ok) return router.reload();

        return res.json();
      })
      .then((data) => setError(data.message))
      .catch(() => setError("Failed to delete url"));
  };

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);

  const handleDeleteModalOpen = (url: Url) => setDeleteUrl(url);
  const handleDeleteModalClose = () => setDeleteUrl(undefined);

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <>
      <Flex p={8} direction="column" alignItems="flex-end">
        <Button colorScheme="teal" onClick={handleCreateModalOpen}>
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
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {urls.reverse().map(({ uuid, url }) => (
                <Tr key={uuid}>
                  <Td>{uuid}</Td>
                  <Td>
                    <CopyIcon
                      onClick={() => navigator.clipboard.writeText(url)}
                      w={4}
                      h={4}
                      mr={1}
                      mb={1}
                      _hover={{ color: "gray.500", cursor: "pointer" }}
                    />
                    {url}
                  </Td>
                  <Td>
                    <DeleteIcon
                      onClick={() => handleDeleteModalOpen({ uuid, url })}
                      w={5}
                      h={5}
                      ml={3}
                      _hover={{ color: "gray.500", cursor: "pointer" }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <Modal isOpen={isCreateModalOpen} onClose={handleCreateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UrlForm url={url} onUrlChange={onUrlChange} />
          </ModalBody>

          <ModalFooter>
            <Button variant={"outline"} mr={3} onClick={handleCreateModalClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleCreateSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!deleteUrl} onClose={handleDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Are you sure you want to delete <strong>{deleteUrl?.url}</strong>
            </p>
          </ModalBody>

          <ModalFooter>
            <Button variant={"outline"} mr={3} onClick={handleDeleteModalClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleDeleteSubmit}>
              Confirm
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
