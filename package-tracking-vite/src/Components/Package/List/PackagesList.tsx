import { Flex, Grid, Pagination, Paper, Skeleton } from "@mantine/core";
import { useState } from "react";
import { type Package } from "../../../Models/Package";
import "@mantine/notifications/styles.css";
import { useDisclosure } from "@mantine/hooks";
import "../Package.scss";
import { useNavigate, useSearchParams } from "react-router";
import CreateForm from "../Modal/CreateForm";
import { Notifications } from "@mantine/notifications";
import { If, Then } from "react-if";
import ActionBar from "../ActionBar";
import PackageCard from "./PackageCard";
import ErrorBlock from "../ErrorBlock";
import {  useCreatePackage, usePackages } from "../../../Utilities/PackageListUtility";

function PackageList() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get("page") || "1", 10);
  const filter = searchParams.get("status") || "";
  const appliedTrackingNumber = searchParams.get("trackingNumber") || "";
  const { data: packagesResponse, isFetching, error,isLoading } = usePackages(
    activePage,
    filter,
    appliedTrackingNumber
  );
  const createPackageMutation = useCreatePackage();
  
  const packages : Package[] = packagesResponse?.packages ?? [];
  const totalPages : number = packagesResponse?.totalPageCount ?? 1;

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
      <CreateForm opened={opened} onClose={close} onSubmit={createPackageMutation.mutate} />

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
      <If condition={packagesResponse}>
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
      </If>
      {error && !isFetching && <ErrorBlock error={error} />}
    </>
  );
}
export default PackageList;
