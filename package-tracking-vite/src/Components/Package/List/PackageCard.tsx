import { Flex, Paper, Text } from "@mantine/core";
import { IconCopy, IconUser } from "@tabler/icons-react";
import { formatDate } from "../../../Services/date.service";
import { useClipboard } from "@mantine/hooks";
import type { Package } from "../../../Models/Package";

interface PackageCardProps {
  onOpenDetails: (packageId: string) => void;
  packageObject: Package;
}

function PackageCard({ onOpenDetails, packageObject }: PackageCardProps) {
  const clipboard = useClipboard({ timeout: 500 });
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
  return (
    <Paper
      withBorder
      radius="lg"
      p="lg"
      bg="white"
      h="350px"
      id="package-card"
      style={{ cursor: "pointer" }}
      onClick={() => {
        onOpenDetails(packageObject.id);
      }}
    >
      <Flex align="center">
        <Text size="sm" mr="2" fw={700}>
          {packageObject.trackingNumber}
        </Text>
        <IconCopy
          onClick={(e) => {
            e.stopPropagation();
            clipboard.copy(packageObject.trackingNumber);
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
        Created: {formatDate(packageObject.created)}
      </Text>
      <Flex direction="column" gap="lg" mt="md">
        <div>
          <Text fw={600} size="md">
            <IconUser size={20} style={{ marginRight: "5px" }} />
            Sender:
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.sender.name}
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.sender.address}
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.sender.phone}
          </Text>
        </div>
        <div>
          <Text fw={600} size="md">
            <IconUser size={20} style={{ marginRight: "5px" }} />
            Receiver:
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.receiver.name}
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.receiver.address}
          </Text>
          <Text size="sm" fs="italic">
            {packageObject.sender.phone}
          </Text>
        </div>
      </Flex>
      <Paper
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        bg={statusStyle(packageObject.status)}
        radius="sm"
        mt={10}
        h="2rem"
      >
        <Text fw={400}>{packageObject.status}</Text>
      </Paper>
    </Paper>
  );
}

export default PackageCard;
