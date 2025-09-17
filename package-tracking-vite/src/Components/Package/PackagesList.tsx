import { Flex, Grid, Pagination, Paper, Skeleton, Text } from "@mantine/core";
import { useState } from "react";
import { type Package } from "../../Models/Package";
import { API } from "../../Services/api.requests";
import "@mantine/notifications/styles.css";
import { IconCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import "./Package.scss";
import { useNavigate, useSearchParams } from "react-router";
import CreateForm from "./Modal/CreateForm";
import { notifications, Notifications } from "@mantine/notifications";
import { Else, If, Then } from "react-if";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ActionBar from "./ActionBar";
import PackageCard from "./PackageCard";

function PackageList() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get("page") || "1", 10);
  const filter = searchParams.get("status") || "";
  const appliedTrackingNumber = searchParams.get("trackingNumber") || "";

  const { data: packagesResponse, isLoading } = useQuery({
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
      <ActionBar
        open={open}
        onChangeFilter={filterByStatus}
        onResetFilter={resetFilter}
        onSetSearchValue={setSearchValue}
        onPressEnter={filterByTrackingNumber}
      />
      <CreateForm opened={opened} onClose={close} onSubmit={onCreate} />

      {isLoading && (
        <Grid mb="2rem">
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
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
              <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.id}>
                <PackageCard packageObject={p} onOpenDetails={openDetails} />
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
          <If condition={!isLoading}>
            <Then>
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
            </Then>
          </If>
        </Else>
      </If>
    </>
  );
}
export default PackageList;
