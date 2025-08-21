import axios, { AxiosResponse } from "axios";
import { Package } from "../Models/Package";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

const handleError = (error: Error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error(error.message);
    }
  } else {
    console.error("Unexpected error: ", error);
  }
  throw error;
};

const requests = {
  post: (url: string, body:any) =>
    axios.post(url, body).then(responseBody).catch(handleError),
  get: (url: string) => axios.get(url).then(responseBody).catch(handleError),
};

const PackageService = {
  createPackage: (data:any) => requests.post("Package", data),
  getPackages: () => requests.get("Package"),
  getPackage: (packageId?:string) => requests.get(`Package/${packageId}`),
  getHistory: (packageId?:string) => requests.get(`Package/${packageId}/History`)
};
export const API = { PackageService };
