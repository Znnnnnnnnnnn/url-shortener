import { ChangeEvent, useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { findAllUrl } from "~/lib";
import { Url } from "~/types";

interface IList {
  urls: Url[];
  error: string;
}

export default function List({ urls, error }: IList) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState<Url | undefined>();
  const renderUrls = useMemo(() => urls, []);

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
        if (res.ok) {
          toast.success("Successfully added URL");
          return router.reload();
        }

        return res.json();
      })
      .then((data) => {
        if (data?.message) toast.error(data.message);
      });
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
        if (res.ok) {
          toast.success("Successfully deleted URL");
          return router.reload();
        }

        return res.json();
      })
      .then((data) => {
        if (data?.message) toast.error(data.message);
      });
  };

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);

  const handleDeleteModalOpen = (url: Url) => setDeleteUrl(url);
  const handleDeleteModalClose = () => setDeleteUrl(undefined);

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  useEffect(() => {
    // onmount check clipboiard write perm
    if ("clipboard" in navigator) {
      const permissionName = "clipboard-write" as PermissionName;
      navigator.permissions
        .query({ name: permissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === "prompt") {
            (navigator.permissions as any).request({ name: permissionName });
          }
        });
    }
  }, []);

  return (
    <>
      <Flex p={8} direction="column" alignItems="flex-end">
        <Button colorScheme="teal" onClick={handleCreateModalOpen}>
          Create
        </Button>
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
                        navigator.clipboard.writeText(
                          `${window.location.host}/${uuid}`
                        );
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
