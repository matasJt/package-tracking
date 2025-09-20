import { Flex, Paper, Text } from "@mantine/core";
import axios from "axios";

interface ErrorBlockProps {
  error?: Error;
}

export default function errorBlock({ error }: ErrorBlockProps) {
  let message = error?.message;
  if (axios.isAxiosError(error) && error?.response?.status === 404) {
    message = "Packages not found by selected filters";
  }
  return (
    <Paper h={100} mt="lg">
      <Flex
        w="100%"
        h="100%"
        justify="center"
        align="center"
        direction="column"
      >
        <Text size="xl" fw={700}>
          No packages found.
        </Text>
        <Text color="dimmed" size="sm">
          {message}
        </Text>
      </Flex>
    </Paper>
  );
}
