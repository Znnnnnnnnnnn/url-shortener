import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface IUrlForm {
  url: string;
  onUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UrlForm = ({ url, onUrlChange }: IUrlForm) => {
  return (
    <>
      <FormControl isRequired>
        <FormLabel>Url</FormLabel>
        <Input
          value={url}
          placeholder="Enter URL"
          onChange={onUrlChange}
          required
        />
      </FormControl>
    </>
  );
};
