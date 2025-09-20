// hooks/usePackageDetails.ts
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API } from "../Services/api.requests";
import { updatePackage } from "./Update";
import { Error, Success } from "./Notifications";
import { type Package } from "../Models/Package";
import { type PackageHistory } from "../Models/History";

export function PackageDetailsUtility(packageId?: string) {
  const [history, setHistory] = useState<PackageHistory[]>([]);
  const [packageDetail, setPackage] = useState<Package>();

  const fetchData = useCallback(async () => {
    if (!packageId) return;
    const [p, h] = await Promise.all([
      API.PackageService.getPackage(packageId),
      API.PackageService.getHistory(packageId),
    ]);
    setPackage(p);
    setHistory(h);
  }, [packageId]);

  const updateStatus = useCallback(
    async (status: string) => {
      try {
        const { updatedPackage, updatedHistory } = await updatePackage(
          packageId!,
          status
        );
        setPackage(updatedPackage);
        setHistory(updatedHistory);
        Success(status);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          Error(packageDetail?.status, status, error.response.data.message);
        } else {
          console.error("An unexpected error occurred", error);
        }
      }
    },
    [packageId, packageDetail?.status]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { history, packageDetail, updateStatus };
}
