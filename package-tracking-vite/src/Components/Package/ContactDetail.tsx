import { Flex, Paper, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { type Contact } from "../../Models/Contact";

interface DetailsProps {
  contact?: Contact;
  title?: string;
}

function ContactDetail({ contact, title }: DetailsProps) {
  return (
    <Paper bg="white" mt={10} radius="md" w="50%">
      <Flex p={20}>
        <IconUser color="green" />
        <span>{title}</span>
      </Flex>
      <Flex direction="column" px={20} mb={10}>
         <Text fs="italic" style={{ color: "gray" }}>
            Name
          </Text>
        <Text size="sm" fs="italic">
          {contact?.name}
        </Text>
        <Text fs="italic" style={{ color: "gray" }}>
            Address
          </Text>
        <Text size="sm" fs="italic">
          {contact?.address}
        </Text>
         <Text fs="italic" style={{ color: "gray" }}>
            Phone
          </Text>
        <Text size="sm" fs="italic">
          {contact?.phone}
        </Text>
      </Flex>
    </Paper>
  );
}
export default ContactDetail;
