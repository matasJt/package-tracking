import type { PackageHistory } from "../Models/History";
import type { Package } from "../Models/Package";
import { API } from "../Services/api.requests";

interface UpdateResult {
  updatedPackage: Package;
  updatedHistory: PackageHistory[];
}

export const updatePackage = async (
  packageId: string,
  status: string
): Promise<UpdateResult> => {
  const packageResult = await API.PackageService.updatePackage(
    packageId,
    status
  );
  const updatedPackage: Package = JSON.parse(
    JSON.stringify(packageResult.data)
  );
  const updatedHistory = await API.PackageService.getHistory(packageId);

  return { updatedPackage, updatedHistory };
};
