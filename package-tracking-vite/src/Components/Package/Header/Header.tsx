import { Flex, Paper, Text, Title } from "@mantine/core";
import { IconPackages } from "@tabler/icons-react";
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
          zIndex: 1000,
        }}
      >
        <Flex
          w={{base:'65%',xs:'70%'}}
          h='60px'
          mx="auto"
          bg="white"
          justify="space-between"
          align="center"
          p="3"
          mb="3"
        >
          <Title fz={{ base: 'md',md:'xl'}}>Package Tracker</Title>
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
