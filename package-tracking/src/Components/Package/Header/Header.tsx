import { Flex, Paper, Text } from "@mantine/core";
import {  IconPackages } from "@tabler/icons-react";
import "./Header.scss";

function Header({ handleCreateForm }: any) {
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
          zIndex: 1000
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
          <h2 className="fw-semibold">Package tracking</h2>
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
        </Flex>
      </Paper>
    </>
  );
}
export default Header;
