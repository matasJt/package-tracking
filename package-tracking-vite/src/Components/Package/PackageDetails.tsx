import { useEffect, useState } from "react";
import { type Package } from "../../Models/Package";
import { useParams } from "react-router";
import { API } from "../../Services/api.requests";
import { Flex, Paper, Text } from "@mantine/core";
import "@mantine/notifications/styles.css";
import "./Package.scss";
import {
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { type PackageHistory } from "../../Models/History";
import ContactDetail from "./ContactDetail";
import TimeLine from "./TimeLine";
import { modals } from "@mantine/modals";
import { Notifications, notifications } from "@mantine/notifications";
import PackageDetail from "./PackageDetail";

function PackageDetails() {
  const [history, setHistory] = useState<PackageHistory[]>([]);
  const [packageDetail, setPackage] = useState<Package>();
  const { packageId } = useParams<{ packageId: string }>();

  

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
        <PackageDetail packageDetail={packageDetail} history={history} confirmationDialog={confirmationDialog} />
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
export default PackageDetails;
