const API_BASE_URL = "http://localhost:5000";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  ideas?: T;
  idea?: T;
  experiments?: T;
  reflections?: T;
  outcomes?: T;
  comments?: T;
  comment?: T;
  progression?: T;
}

export async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, init);

    let data: ApiResponse<T>;

    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    // HTTP error
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    // API error
    if (!data.success) {
      throw new Error(data.message || "Request failed");
    }

    // return the first data field found
    const result =
      data.data ??
      data.ideas ??
      data.idea ??
      data.experiments ??
      data.reflections ??
      data.outcomes ??
      data.comments ??
      data.comment ??
      data.progression;


    // allow empty response for DELETE
    if (result === undefined) {
      if (init?.method === "DELETE") {
        return undefined as T;
      }
      throw new Error("No data returned");
    }

    return result as T;

  } catch (error: any) {

    // network error
    if (error instanceof TypeError) {
      throw new Error("Cannot connect to server");
    }

    throw error;
  }
}
