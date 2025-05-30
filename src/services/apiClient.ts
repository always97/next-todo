import axios, { AxiosError } from "axios";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!TENANT_ID) {
  throw new Error("환경변수 NEXT_PUBLIC_TENANT_ID가 설정되지 않았습니다.");
}

if (!API_BASE) {
  throw new Error("환경변수 NEXT_PUBLIC_API_BASE가 설정되지 않았습니다.");
}

const API_BASE_URL = `${API_BASE}${TENANT_ID}`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected API error occurred.";
    console.error("API Error:", errorMessage, error.response);
    return Promise.reject(error);
  }
);

export default apiClient;
