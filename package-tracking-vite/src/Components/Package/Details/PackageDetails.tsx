import { useParams } from "react-router";
import { Flex, Paper, Text } from "@mantine/core";
import "@mantine/notifications/styles.css";
import "../Package.scss";
import ContactDetail from "./ContactDetail";
import TimeLine from "./TimeLine";
import { modals } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import PackageDetail from "./PackageDetail";
import { PackageDetailsUtility } from "../../../Utilities/PackageDetailsUtitlity";

function PackageDetails() {
  const { packageId } = useParams<{ packageId: string }>();
  const { history, packageDetail, updateStatus } = PackageDetailsUtility(packageId);

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

  return (
    <>
      <Notifications position="bottom-right" />
      <Paper bg="white" mt={20} radius="md">
        <PackageDetail
          packageDetail={packageDetail}
          history={history}
          confirmationDialog={confirmationDialog}
        />
      </Paper>
      {/* Details */}
      <Flex justify="center" gap={20}>
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
