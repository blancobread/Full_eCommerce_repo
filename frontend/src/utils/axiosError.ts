import { AxiosError } from 'axios';

type APIErrorResponse = {
  message: string;
};

export function getAxiosErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<APIErrorResponse>;

  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }

  return 'An unknown error occurred';
}
