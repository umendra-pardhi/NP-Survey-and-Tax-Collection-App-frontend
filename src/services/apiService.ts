import { apiClient } from "@/services/apiClient";

export interface InitialConnectPayload {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
}

export interface InitialConnectResponse {
  success: boolean;
  message: string;
  client_count: number;
  clients: unknown[];
  error_code?: string;
}

export interface LoginPayload {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
  LoginID: string;
  Password: string;
}

export interface RegisterPayload {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
  UserName: string;
  Mobile: string;
  EMail: string;
  LoginID: string;
  Password: string;
  UserRole: string;
  UserLocation: boolean;
  ClientID: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  user: {
    UserID: number;
    UserName: string;
    UserRole: string;
    ClientID: number;
    EMail: string;
    Mobile: string;
    LoginID: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id: number;
}

export interface SyncDownloadPayload {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
  table_name: string;
  last_sync_time: string;
  last_id: number;
  limit: number;
}

export interface SyncLocalToRemoteStreamPayload {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
  table_name: string;
  ndjson: string;
}

interface SyncDownloadOptions {
  onRow: (row: Record<string, unknown>) => Promise<void>;
}

const parseNdjsonLine = async (
  line: string,
  onRow: SyncDownloadOptions["onRow"],
) => {
  if (!line.trim()) return;
  await onRow(JSON.parse(line));
};

export const apiService = {
  initialConnect: async (payload: InitialConnectPayload) => {
    const { data } = await apiClient.post<InitialConnectResponse>(
      "/initial-connect",
      payload,
    );
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<LoginResponse>("/login/", payload);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<RegisterResponse>(
      "/register",
      payload,
    );
    return data;
  },

  // syncDownload: async () => {
  //   const { data } = await apiClient.get('/sync/download');
  //   return data;
  // },

  syncDownload: async (
    payload: SyncDownloadPayload,
    options: SyncDownloadOptions,
  ) => {
    const { data } = await apiClient.post<string>(
      "/sync/remote-to-local",
      payload,
      {
        responseType: "text",
        transformResponse: [(value) => value],
      },
    );

    const lines = data.split("\n");
    for (const line of lines) {
      await parseNdjsonLine(line, options.onRow);
    }
  },

  syncUpload: async (payload: unknown) => {
    const { data } = await apiClient.post("/sync/upload", payload);
    return data;
  },

  syncLocalToRemoteStream: async (payload: SyncLocalToRemoteStreamPayload) => {
    const { ndjson, db_username, db_password, ...params } = payload;
    const { data } = await apiClient.post(
      "/sync/local-to-remote/stream",
      ndjson,
      {
        params,
        headers: {
          "X-DB-Username": db_username,
          "X-DB-Password": db_password,
          "Content-Type": "application/x-ndjson",
        },
        transformRequest: [(value) => value],
      },
    );
    return data;
  },

  syncDb: async (payload: unknown) => {
    const { data } = await apiClient.post("/sync-db", payload);
    return data;
  },
};
