import axios, { AxiosResponse } from "axios";

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

const requests = {};

const PackageService = {};
export const API = { PackageService };
