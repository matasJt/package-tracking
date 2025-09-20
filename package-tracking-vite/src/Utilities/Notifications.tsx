import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export function Success(status: string) {
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
}
export function Error(
  prevStatus: string | undefined,
  status: string,
  error: string
) {
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
}
