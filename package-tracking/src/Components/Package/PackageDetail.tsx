import { useEffect, useState } from "react";
import { Package } from "../../Models/Package";
import { useParams } from "react-router";
import { API } from "../../Services/api.requests";
import { Button, Container, Flex, Menu, Paper, Text } from "@mantine/core";
import "./Package.scss";
import { IconRefresh} from "@tabler/icons-react";
import { PackageHistory } from "../../Models/History";
import ContactDetail from "./ContactDetail";
import TimeLine from "./TimeLine";
import { formatDate } from "../../Services/date.service";

function PackageDetail() {
  const [history, setHistory] = useState<PackageHistory[]>([]);
  const [packageDetail, setPackage] = useState<Package>();
  const { packageId } = useParams<{ packageId: string }>();

  const updateStatus = (status: string) => {};

  useEffect(() => {
    API.PackageService.getPackage(packageId).then((p) => {
      setPackage(p);
    });
    API.PackageService.getHistory(packageId).then((h) => {
      setHistory(h);
    });
  }, [packageId]);

  return (
    <>
      <Paper bg="white" mt={20} radius="md">
        <Container p={20} m={0} size="lg">
          <Flex justify="space-between">
            <Text fw={500} size="xl">
              Package Details
            </Text>
            {history.length > 1 ? (
              <Text style={{ color: "gray" }} fw={500}>
                Last updated: {formatDate((history[history.length - 1].updated))}
              </Text>
            ) : (
              <Text style={{ color: "gray" }} fw={500}>
                History not available
              </Text>
            )}
          </Flex>

          <Text style={{ color: "blue" }} fw={400}>
            {packageDetail?.trackingNumber}
          </Text>
          <Menu>
            <Menu.Target>
              <Button id="update-button" mt={20}>
                <IconRefresh id="icon" size={18} />
                Update Status
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => updateStatus("Sent")}>Sent</Menu.Item>
              <Menu.Item onClick={() => updateStatus("Cancelled")}>
                Cancelled
              </Menu.Item>
              <Menu.Item onClick={() => updateStatus("Accpeted")}>
                Accepted
              </Menu.Item>
              <Menu.Item onClick={() => updateStatus("Returned")}>
                Return
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Container>
      </Paper>
      {/* Details */}
      <Flex justify="center" gap={20}>
        {packageDetail && <ContactDetail contact={packageDetail?.sender} title={"Sender Information"} />}
         {packageDetail && <ContactDetail contact={packageDetail?.receiver} title={"Receiver Information"} />}  
      </Flex>
      <TimeLine history={history}/>
    </>
  );
}
export default PackageDetail;
