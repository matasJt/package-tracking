import { Button, Container, Flex, Menu, Paper, Text } from "@mantine/core";
import { type Package } from "../../../Models/Package";
import { formatDate } from  "../../../Services/date.service";
import {
  IconCancel,
  IconCheck,
  IconRefresh,
  IconSend,
  IconTruckReturn,
} from "@tabler/icons-react";
interface PackageDetailsProps {
  packageDetail: Package | undefined;
  history: { updated: string }[];
  confirmationDialog: (status: string) => void;
}
function PackageDetail({
  packageDetail,
  history,
  confirmationDialog,
}: PackageDetailsProps) {
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
  const statuses = [
    { value: "Cancelled", icon: <IconCancel /> },
    { value: "Returned", icon: <IconTruckReturn /> },
    { value: "Accepted", icon: <IconCheck /> },
    { value: "Sent", icon: <IconSend /> },
  ];

  return (
    <Container p={20} m={0} size="lg">
      <Flex justify="space-between">
        <Text fw={500} fz={{ base: "sm", sm: "lg" }}>
          Package Details
        </Text>
        {history.length > 1 ? (
          <Text
            style={{ color: "gray" }}
            fw={500}
            fz={{ base: "xs", xs: "sm" }}
            ms={{ base: "xs" }}
          >
            Last updated: {formatDate(history[history.length - 1].updated)}
          </Text>
        ) : (
          <Text
            style={{ color: "gray" }}
            fw={500}
            fz={{ base: "xs", xs: "sm" }}
          >
            History not available
          </Text>
        )}
      </Flex>

      <Text style={{ color: "blue" }} fw={400} fz={{ base: "xs", xs: "sm" }}>
        {packageDetail && packageDetail.trackingNumber}
      </Text>
      <Paper
        w={{ base: "25%", xs: "13%" }}
        mt={5}
        p={5}
        bg={statusStyle(packageDetail?.status)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text fw={400} fz={{ base: "xs", xs: "sm" }}>
          {packageDetail?.status}
        </Text>
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
  );
}
export default PackageDetail;
