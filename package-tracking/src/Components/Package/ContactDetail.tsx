import { Flex, Paper, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Contact } from "../../Models/Contact";

interface DetailsProps {
  contact: Contact;
  title: string;
}

function ContactDetail({ contact, title }: DetailsProps) {
  return (
    <Paper bg="white" mt={10} radius="md" w="50%">
      <Flex p={20}>
        <IconUser color="green" />
        <span>{title}</span>
      </Flex>
      <Flex direction="column" px={20} mb={10}>
        <Text size="sm" fs="italic">
          <Text fs="italic" style={{ color: "gray" }}>
            Name
          </Text>
          {contact.name}
        </Text>
        <Text size="sm" fs="italic">
          <Text fs="italic" style={{ color: "gray" }}>
            Address
          </Text>
          {contact.address}
        </Text>
        <Text size="sm" fs="italic">
          <Text fs="italic" style={{ color: "gray" }}>
            Phone
          </Text>
          {contact.phone}
        </Text>
      </Flex>
    </Paper>
  );
}
export default ContactDetail;
