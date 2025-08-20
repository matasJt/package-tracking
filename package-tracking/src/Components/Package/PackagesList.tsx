import { Flex, Grid, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Package } from "../../Models/Package";
import { API } from "../../Services/api.requests";
import { IconCopy, IconUser } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";
import "./Package.scss";
import { useNavigate } from "react-router";
import { formatDate } from "../../Services/date.service";

function PackageList() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const clipboard = useClipboard({ timeout: 500 });

  const openDetails = (packageId: string) => {
    navigate(`/packages/${packageId}`);
  };

  useEffect(() => {
    API.PackageService.getPackages().then((packages) => {
      setPackages(packages);
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
    <Grid m="2rem">
      {Array.isArray(packages) &&
        packages.map((p) => (
          <Grid.Col span={3} key={p.trackingNumber}>
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
                  {p.trackingNumber.toUpperCase()}
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
                  <Text size="sm" fs='italic' >{p.sender.name}</Text>
                  <Text size="sm" fs='italic'>{p.sender.address}</Text>
                  <Text size="sm" fs='italic'>{p.sender.phone}</Text>
                </div>
                <div>
                  <Text fw={600} size="md">
                    <IconUser size={20} style={{ marginRight: "5px" }} />
                    Receiver:
                  </Text>
                  <Text size="sm" fs='italic'>{p.receiver.name}</Text>
                  <Text size="sm" fs='italic'>{p.receiver.address}</Text>
                  <Text size="sm" fs='italic'>{p.sender.phone}</Text>
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
  );
}
export default PackageList;
