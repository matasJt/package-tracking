import {
  Button,
  Flex,
  Grid,
  Menu,
  Pagination,
  Paper,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { type Package } from "../../Models/Package";
import { API } from "../../Services/api.requests";
import "@mantine/notifications/styles.css";
import {
  IconCancel,
  IconCheck,
  IconCopy,
  IconFilter,
  IconPlus,
  IconSend,
  IconTruckReturn,
  IconUser,
} from "@tabler/icons-react";
import { getHotkeyHandler, useClipboard, useDisclosure } from "@mantine/hooks";
import "./Package.scss";
import { useNavigate, useSearchParams } from "react-router";
import { formatDate } from "../../Services/date.service";
import CreateForm from "./Modal/CreateForm";
import { notifications, Notifications } from "@mantine/notifications";
import { Else, If, Then } from "react-if";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function PackageList() {
  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 500 });
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get("page") || "1", 10);
  const filter = searchParams.get("status") || "";
  const appliedTrackingNumber = searchParams.get("trackingNumber") || "";

  const {
    data: packagesResponse,
    isLoading,
  } = useQuery({
    queryKey: ["packages", activePage, filter, appliedTrackingNumber],
    queryFn: () =>
      API.PackageService.getPackages(
        activePage.toString(),
        filter,
        appliedTrackingNumber
      ),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
  const packages = packagesResponse?.packages ?? [];
  const totalPages = packagesResponse?.totalPageCount ?? 1;
  const statuses = [
    { value: "Cancelled", icon: <IconCancel /> },
    { value: "Returned", icon: <IconTruckReturn /> },
    { value: "Accepted", icon: <IconCheck /> },
    { value: "Created", icon: <IconPlus /> },
    { value: "Sent", icon: <IconSend /> },
  ];

  const filterByTrackingNumber = () => {
    setSearchParams({
      page: "1",
      status: filter,
      trackingNumber: searchValue,
    });
  };

  const resetFilter = () => {
  setSearchParams({ page: "1", status: "", trackingNumber: "" });
  };

  const filterByStatus = (status: string) => {
    setSearchParams({
      page: "1",
      status,
      trackingNumber: appliedTrackingNumber,
    });
  };

  const openDetails = (packageId: string) => {
    navigate(`/packages/${packageId}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    API.PackageService.createPackage(requestBody).then(() => {
      notifications.show({
        autoClose: 2000,
        message: "Package created",
        withCloseButton: false,
        radius: "xl",
        icon: <IconCheck size={20} />,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.green?.[5],
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
    // resetFilter();
  };

  // useEffect(() => {
  //   const page = activePage.toString();
  //   const status = filter || "";
  //   const trackingNumber = appliedTrackingNumber || "";

  //   setSearchParams({ page, status, trackingNumber });
  //   const fetchData = async () => {
  //     try {
  //       const packages = await API.PackageService.getPackages(
  //         page,
  //         status,
  //         trackingNumber
  //       );
  //       setFilteredPackages(packages.packages);
  //       setTotalPages(packages.totalPageCount);
  //     } catch (error) {
  //       console.error("Failed to fetch packages", error);
  //     }
  //   };
  //   fetchData();
  // }, [
  //   activePage,
  //   setSearchParams,
  //   filter,
  //   appliedTrackingNumber,
  //   searchParams,
  // ]);

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
      case "Returned":
        return "gray";
      default:
        return {};
    }
  };
  const onPageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      status: filter,
      trackingNumber: appliedTrackingNumber,
    });
  };

  return (
    <>
      <Notifications position="bottom-right" />
      <Paper bg="white" radius="md" mt={20} mb={40} p={20}>
        <Flex w="100%" gap={10} align="center">
          <Button size="sm" radius="sm" color="green" onClick={open}>
            <IconPlus />
            Create Package
          </Button>
          <Menu>
            <Menu.Target>
              <Button size='sm' radius="sm">
                <IconFilter />
                Filter by status
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {statuses.map((status, index) => (
                <Menu.Item
                  key={index}
                  onClick={() => filterByStatus(status.value)}
                >
                  <Flex>
                    {status.icon}
                    {status.value}
                  </Flex>
                </Menu.Item>
              ))}
              <Menu.Item onClick={resetFilter}>Reset</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <TextInput
            size="md"
            placeholder="Filter by tracking number"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={getHotkeyHandler([["Enter", filterByTrackingNumber]])}
          />
        </Flex>
      </Paper>
      <CreateForm opened={opened} onClose={close} onSubmit={onCreate} />

      {isLoading &&  (
        <Grid mb="2rem">
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid.Col span={{xs:12,sm:6,md:4,lg:3}} key={i}>
              <Paper withBorder radius="lg" p="lg" h="350px">
                <Skeleton height={20} mb="sm" />
                <Skeleton height={15} width="80%" mb="sm" />
                <Skeleton height={200} />
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}
      <If condition={packages.length > 0}>
        <Then>
          <Grid mb="2rem">
            {packages.map((p: Package) => (
              <Grid.Col span={{xs:12,sm:6,md:4,lg:3}} key={p.id}>
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
          <Flex pb={100}>
            <Pagination
              total={totalPages}
              onChange={onPageChange}
              value={activePage}
            />
          </Flex>
        </Then>
        <Else>
          <Paper h={100}>
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
                Not packages found by selected filter
              </Text>
            </Flex>
          </Paper>
        </Else>
      </If>
    </>
  );
}
export default PackageList;
