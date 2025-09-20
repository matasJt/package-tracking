import axios, { type AxiosResponse } from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (url: string, body: any) => axios.post(url, body).then(responseBody),
  get: (url: string) => axios.get(url).then(responseBody),
  put: (url: string) => axios.put(url).then(responseBody),
};

const PackageService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPackage: (data: any) => requests.post("Package", data),
  getPackages: (page: string, statusFilter: string, trackingNumber: string) =>
    requests.get(
      `Package?page=${page}&status=${statusFilter}&trackingNumber=${trackingNumber}`
    ),
  getPackage: (packageId?: string) => requests.get(`Package/${packageId}`),
  getHistory: (packageId?: string) =>
    requests.get(`Package/${packageId}/History`),
  updatePackage: (packageId?: string, status?: string) =>
    requests.put(`Package/${packageId}?status=${status}`),
};
export const API = { PackageService };
