import { API_BASE_URL, apiClient } from "@/services/apiClient";

export interface PhotoBatchResponse {
  batch_id: string;
  status: string;
  expected_files: number;
  created_at: string;
}

export interface PhotoUploadResponse {
  file_id: string;
  batch_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  path: string;
}

export interface PhotoBatchStatusResponse {
  batch_id: string;
  status: string;
  expected_files: number | null;
  total_files: number;
  uploaded_files: number;
  uploading_files: number;
  progress_percent: number | null;
  created_at: string;
  completed_at: string | null;
}

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

  createPhotoBatch: async (expectedFiles: number) => {
    const { data } = await apiClient.post<PhotoBatchResponse>(
      "/api/v1/photos/batches",
      { expected_files: expectedFiles },
    );
    return data;
  },

  uploadPhoto: async (
    batchId: string,
    uri: string,
    filename: string,
    mimeType: string,
  ) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    return new Promise<PhotoUploadResponse>((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(
        "POST",
        `${API_BASE_URL}/api/v1/photos/batches/${encodeURIComponent(batchId)}/files`,
      );
      request.setRequestHeader("Accept", "application/json");
      request.timeout = 120_000;
      request.onload = () => {
        const responseBody = request.responseText;
        if (request.status < 200 || request.status >= 300) {
          let message = `Photo upload failed (${request.status})`;
          try {
            const body = JSON.parse(responseBody) as { detail?: string };
            message = body.detail || message;
          } catch {
            if (responseBody) message = responseBody;
          }
          reject(new Error(message));
          return;
        }

        try {
          resolve(JSON.parse(responseBody) as PhotoUploadResponse);
        } catch {
          reject(new Error("Photo upload returned an invalid response."));
        }
      };
      request.onerror = () => reject(new Error("Photo upload network error."));
      request.ontimeout = () => reject(new Error("Photo upload timed out."));
      request.send(formData);
    });
  },

  getPhotoBatchStatus: async (batchId: string) => {
    const { data } = await apiClient.get<PhotoBatchStatusResponse>(
      `/api/v1/photos/batches/${encodeURIComponent(batchId)}`,
    );
    return data;
  },

  completePhotoBatch: async (batchId: string) => {
    const { data } = await apiClient.post<{ batch_id: string; status: string }>(
      `/api/v1/photos/batches/${encodeURIComponent(batchId)}/complete`,
    );
    return data;
  },

  syncDb: async (payload: unknown) => {
    const { data } = await apiClient.post("/sync-db", payload);
    return data;
  },
};
