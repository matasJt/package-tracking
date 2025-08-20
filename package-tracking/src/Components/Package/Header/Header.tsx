import { Button, Flex, Paper, Text } from "@mantine/core";
import { IconHexagonPlus, IconPackages } from "@tabler/icons-react";
import "./Header.scss";

function Header() {
  return (
    <>
      <Paper
        shadow="sm"
        bg="white"
        p="3"
        mb="3"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000, // keeps it above other content
        }}
      >
      <Flex
        w="70%"
        mx="auto"
        bg="white"
        justify="space-between"
        align="center"
        p="3"
        mb="3"
      >
        <h3 className="fw-semibold">Package tracking</h3>
        <Text size="sm" m="2">
          <a
            id="groups-list"
            href="/packages"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            {" "}
            <IconPackages /> Packages
          </a>
        </Text>
        <Button
          id="create-button"
          variant="filled"
          color="violet"
          radius="20px"
          w="10rem"
        >
          <IconHexagonPlus id="icon" stroke={2} />
          Create package
        </Button>
      </Flex>
      </Paper>
    </>
  );
}
export default Header;
