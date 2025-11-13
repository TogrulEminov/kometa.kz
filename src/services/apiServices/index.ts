// apiServices/index.ts
interface ApiProp {
  endpoint: string;
  revalidate?: number; // ISR üçün saniyə (optional)
  cache?: RequestCache; // "default", "no-store", "force-cache"
}
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface APIResponse<T> {
  data?: T;
  error?: string;
}
const getApi = async ({
  endpoint,
  revalidate,
  cache = "no-store",
}: ApiProp) => {
  if (!endpoint) {
    console.error("Endpoint is not defined");
    return null;
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${normalizedEndpoint}`;

    const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache,
    };

    if (revalidate !== undefined) {
      fetchOptions.next = { revalidate };
    }

    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
};

const postAPI = async <T>(
  URL: string,
  body: Record<string, unknown> | FormData,
  method: RequestMethod = "POST",
  headers: Record<string, string> = {}
): Promise<APIResponse<T>> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
      throw new Error("URL not found!");
    }

    const isMultipart = body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // Use API_TOKEN
    };
    if (!isMultipart) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${URL}`, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: "include",
      body: isMultipart ? body : JSON.stringify({ data: body }), // Wrap in data object for Strapi
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error?.message || "An error occurred" };
    }

    return { data: result.data || result };
  } catch (err) {
    return { error: `API request failed: ${String(err)}` };
  }
};

export { getApi, postAPI };
