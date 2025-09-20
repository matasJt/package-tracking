import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../Services/api.requests";
import type { CreationProfile } from "../Models/CreationProfile";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export function usePackages(
  activePage: number,
  filter: string,
  trackingNumber: string
) {
  return useQuery({
    queryKey: ["packages", activePage, filter, trackingNumber],
    queryFn: async () => {
      return await API.PackageService.getPackages(
        activePage.toString(),
        filter,
        trackingNumber
      );
    },
    retry: 1,
    placeholderData: keepPreviousData,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreationProfile) => {
      return await API.PackageService.createPackage(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
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
    },
  });
}
