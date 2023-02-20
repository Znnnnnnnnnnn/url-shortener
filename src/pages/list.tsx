import { ChangeEvent, useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { DeleteIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Heading,
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
import { findAllUrl } from "~/lib";
import { Url } from "~/types";

interface IList {
  urls: Url[];
  error: string;
}

export default function List({ urls, error }: IList) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState<Url | undefined>();
  const renderUrls = useMemo(() => urls, []);

  const handleCreateSubmit = async () => {
    setLoading(true);

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
        if (res.ok) {
          toast.success("Successfully added URL");
          return router.reload();
        }

        return res.json();
      })
      .then((data) => {
        if (data?.message) toast.error(data.message);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteSubmit = async () => {
    if (!deleteUrl) return;
    setLoading(true);

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
        if (res.ok) {
          toast.success("Successfully deleted URL");
          return router.reload();
        }

        return res.json();
      })
      .then((data) => {
        if (data?.message) toast.error(data.message);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);

  const handleDeleteModalOpen = (url: Url) => setDeleteUrl(url);
  const handleDeleteModalClose = () => setDeleteUrl(undefined);

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  const handleCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  return (
    <>
      <Flex p={6} direction="column" alignItems="flex-end">
        <Flex justifyContent="space-between" width="100%">
          <Heading as="h3" size="md">
            URL Shortener
          </Heading>
          <Button colorScheme="teal" onClick={handleCreateModalOpen}>
            Create
          </Button>
        </Flex>

        <TableContainer width={"100%"} mt={4} border="1px" borderRadius={16}>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>UUID</Th>
                <Th>URL</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderUrls.map(({ uuid, url }) => (
                <Tr key={uuid}>
                  <Td>
                    <CopyIcon
                      onClick={() => {
                        toast.success("Copied the shortened URL");
                        handleCopy(`${window.location.host}/${uuid}`);
                      }}
                      w={4}
                      h={4}
                      mr={1}
                      mb={1}
                      _hover={{ color: "gray.500", cursor: "pointer" }}
                    />
                    {uuid}
                  </Td>
                  <Td>{url}</Td>
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
            <Button
              colorScheme="teal"
              onClick={handleCreateSubmit}
              isLoading={loading}
              disabled={loading}
            >
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
            <Button
              colorScheme="teal"
              onClick={handleDeleteSubmit}
              isLoading={loading}
              disabled={loading}
            >
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
