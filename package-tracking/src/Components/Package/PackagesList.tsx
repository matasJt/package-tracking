import { Button, Flex, Grid, Input, Menu, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Package } from "../../Models/Package";
import { API } from "../../Services/api.requests";
import "@mantine/notifications/styles.css";
import {
  IconCheck,
  IconCopy,
  IconFilter,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import "./Package.scss";
import { useNavigate } from "react-router";
import { formatDate } from "../../Services/date.service";
import CreateForm from "./Modal/CreateForm";
import { notifications, Notifications } from "@mantine/notifications";

function PackageList() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const clipboard = useClipboard({ timeout: 500 });
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);

  const filterByTrackingNumber = (inputValue: string) => {
    setSearchValue(inputValue);
    const filtered = packages.filter((p) =>
      p.trackingNumber.includes(inputValue)
    );
    setFilteredPackages(filtered);
  };

  const openDetails = (packageId: string) => {
    navigate(`/packages/${packageId}`);
  };

  const onCreate = (values: any) => {
    const requestBody = {
      sender: {
        name: values.senderName,
        address: values.senderAddress,
        phone: values.senderPhone,
      },
      recipient: {
        name: values.receiverName,
        address: values.receiverAddress,
        phone: values.receiverPhone,
      },
    };
    API.PackageService.createPackage(requestBody).then((p: Package) => {
      setPackages((old) => [...old, p]);
      setFilteredPackages((old) => [...old, p]);
      notifications.show({
        autoClose: 2000,
        message: "Package created",
        withCloseButton: false,
        radius: "xl",
        icon: <IconCheck size={20} />,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.green?.[5],
            zIndex:'1400'
          },
          icon: {
            backgroundColor: theme.colors.green[5],
            color: theme.white,
          },
          description: {
            color: theme.white,
            fontWeight: "bold",
            fontSize: "15px",
          },
        }),
      });
    });
  };

  useEffect(() => {
    API.PackageService.getPackages().then((packages) => {
      setPackages(packages);
      setFilteredPackages(packages);
    });
  }, []);

  const statusStyle = (status: string) => {
    switch (status) {
      case "Created":
        return "lime";
      case "Sent":
        return "orange";
      case "Cancelled":
        return "red";
      case "Accepted":
        return "green";
      case "Return":
        return "gray";
      default:
        return {};
    }
  };
  return (
    <>
     <Notifications position='bottom-right' />
      <Paper bg="white" radius="md" mt={20} mb={40} p={20}>
        <Flex w="100%" gap={10} align="center">
          <Button size="md" radius="sm" color="green" onClick={open}>
            <IconPlus />
            Create Package
          </Button>
          <Menu>
            <Menu.Target>
              <Button size="md" radius="sm">
                <IconFilter />
                Filter by status
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item></Menu.Item>
              <Menu.Item>Cancelled</Menu.Item>
              <Menu.Item>Accepted</Menu.Item>
              <Menu.Item>Return</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Input
            size="md"
            placeholder="Filter by tracking number"
            value={searchValue}
            onChange={(e) => filterByTrackingNumber(e.target.value)}
          />
        </Flex>
      </Paper>
      <CreateForm opened={opened} onClose={close} onSubmit={onCreate} />

      <Grid mb="2rem">
        {Array.isArray(filteredPackages) &&
          filteredPackages.map((p) => (
            <Grid.Col span={3} key={p.id}>
              <Paper
                withBorder
                radius="lg"
                p="lg"
                bg="white"
                h="350px"
                id="package-card"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  openDetails(p.id);
                }}
              >
                <Flex align="center">
                  <Text size="sm" mr="2" fw={700}>
                    {p.trackingNumber}
                  </Text>
                  <IconCopy
                    onClick={(e) => {
                      e.stopPropagation();
                      clipboard.copy(p.trackingNumber);
                    }}
                    size={17}
                  />
                </Flex>
                <Text
                  size="sm"
                  style={{
                    color: "gray",
                  }}
                >
                  Created: {formatDate(p.created)}
                </Text>
                <Flex direction="column" gap="lg" mt="md">
                  <div>
                    <Text fw={600} size="md">
                      <IconUser size={20} style={{ marginRight: "5px" }} />
                      Sender:
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.sender.name}
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.sender.address}
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.sender.phone}
                    </Text>
                  </div>
                  <div>
                    <Text fw={600} size="md">
                      <IconUser size={20} style={{ marginRight: "5px" }} />
                      Receiver:
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.receiver.name}
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.receiver.address}
                    </Text>
                    <Text size="sm" fs="italic">
                      {p.sender.phone}
                    </Text>
                  </div>
                </Flex>
                <Paper
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bg={statusStyle(p.status)}
                  radius="sm"
                  mt={10}
                  h="2rem"
                >
                  <Text fw={400}>{p.status}</Text>
                </Paper>
              </Paper>
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}
export default PackageList;
