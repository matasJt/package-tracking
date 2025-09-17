import { useEffect, useState } from "react";
import { type Package } from "../../Models/Package";
import { useParams } from "react-router";
import { API } from "../../Services/api.requests";
import { Button, Container, Flex, Menu, Paper, Text } from "@mantine/core";
import "@mantine/notifications/styles.css";
import "./Package.scss";
import {
  IconCancel,
  IconCheck,
  IconRefresh,
  IconSend,
  IconTruckReturn,
  IconX,
} from "@tabler/icons-react";
import { type PackageHistory } from "../../Models/History";
import ContactDetail from "./ContactDetail";
import TimeLine from "./TimeLine";
import { formatDate } from "../../Services/date.service";
import { modals } from "@mantine/modals";
import { Notifications, notifications } from "@mantine/notifications";

function PackageDetail() {
  const [history, setHistory] = useState<PackageHistory[]>([]);
  const [packageDetail, setPackage] = useState<Package>();
  const { packageId } = useParams<{ packageId: string }>();
  const statuses = [
    { value: "Cancelled", icon: <IconCancel /> },
    { value: "Returned", icon: <IconTruckReturn /> },
    { value: "Accepted", icon: <IconCheck /> },
    { value: "Sent", icon: <IconSend /> },
  ];

  const statusStyle = (status: string | undefined) => {
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

  const showError = (
    prevStatus: string | undefined,
    status: string,
    error: string
  ) => {
    notifications.show({
      autoClose: 6000,
      message: `Cannot update from ${prevStatus} to ${status} (${error})`,
      withCloseButton: false,
      radius: "xl",
      icon: <IconX size={20} />,
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.red?.[5],
          zIndex: "1400",
        },
        icon: {
          backgroundColor: theme.colors.red[5],
          color: theme.white,
        },
        description: {
          color: theme.white,
          fontWeight: "bold",
          fontSize: "15px",
        },
      }),
    });
  };
  const showSuccess = (status: string) => {
    notifications.show({
      autoClose: 3000,
      message: `Package status was successfully updated to ${status}`,
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
  };

  const confirmationDialog = (status: string) => {
    modals.openConfirmModal({
      title: `Confirm status change to ${status}`,
      children: (
        <Text size="sm">
          Confirmation to change status or not, if status cannot be change error
          message will be shown
        </Text>
      ),
      labels: { confirm: "Change", cancel: "Cancel" },
      onConfirm: () => updateStatus(status),
    });
  };

  const updateStatus = async (status: string) => {
    try {
      const updatedPackage = await API.PackageService.updatePackage(
        packageId,
        status
      );
      setPackage(updatedPackage.data);

      const updatedHistory = await API.PackageService.getHistory(packageId);
      setHistory(updatedHistory);
      showSuccess(status);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showError(packageDetail?.status, status, error.response?.data?.message);
      console.error("Failed to updated", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!packageId) return;
      const [p, h] = await Promise.all([
        API.PackageService.getPackage(packageId),
        API.PackageService.getHistory(packageId),
      ]);
      setPackage(p);
      setHistory(h);
    };
    fetchData();
  }, [packageId]);

  return (
    <>
      <Notifications position="bottom-right" />
      <Paper bg="white" mt={20} radius="md">
        <Container p={20} m={0} size="lg">
          <Flex justify="space-between">
            <Text fw={500} size="xl">
              Package Details
            </Text>
            {history.length > 1 ? (
              <Text style={{ color: "gray" }} fw={500}>
                Last updated: {formatDate(history[history.length - 1].updated)}
              </Text>
            ) : (
              <Text style={{ color: "gray" }} fw={500}>
                History not available
              </Text>
            )}
          </Flex>

          <Text style={{ color: "blue" }} fw={400}>
            {packageDetail && packageDetail.trackingNumber}
          </Text>
          <Paper
            w="15%"
            mt={5}
            p={5}
            bg={statusStyle(packageDetail?.status)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fw={400} >{packageDetail?.status}</Text>
          </Paper>
          <Menu>
            <Menu.Target>
              <Button id="update-button" mt={20}>
                <IconRefresh id="icon" size={18} />
                Update Status
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {statuses.map((status, index) => (
                <Menu.Item
                  key={index}
                  onClick={() => confirmationDialog(status.value)}
                >
                  <Flex>
                    {status.icon}
                    {status.value}
                  </Flex>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Container>
      </Paper>
      {/* Details */}
      <Flex justify="center" gap={20} >
        {packageDetail?.sender && (
          <ContactDetail
            contact={packageDetail.sender}
            title="Sender Information"
          />
        )}
        {packageDetail?.receiver && (
          <ContactDetail
            contact={packageDetail.receiver}
            title="Receiver Information"
          />
        )}
      </Flex>
      <TimeLine history={history} />
    </>
  );
}
export default PackageDetail;
