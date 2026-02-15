const API_BASE_URL = "http://localhost:5000";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  ideas?: T;
  idea?: T;
  experiments?: T;
  reflections?: T;
}

export async function apiFetch<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);

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
  data.reflections;


    if (!result) {
      throw new Error("No data returned");
    }

    return result;

  } catch (error: any) {

    // network error
    if (error instanceof TypeError) {
      throw new Error("Cannot connect to server");
    }

    throw error;
  }
}
