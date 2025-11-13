import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";

const apiUrl = "/api";

// API Response Types
export interface ApiSuccessResponse<T = any> {
  message: string;
  data?: T;
  paginations?: any;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

// Response handler
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    let errorBody: ApiErrorResponse;

    if (isJson) {
      errorBody = await response.json().catch(() => ({
        message: response.statusText,
      }));
    } else {
      errorBody = { message: response.statusText };
    }

    // Əgər validation errors varsa, onları da göstər
    const errorMessage = errorBody.errors
      ? `${errorBody.message}\n${errorBody.errors
          .map((e) => `- ${e.field}: ${e.message}`)
          .join("\n")}`
      : errorBody.message;

    throw new Error(errorMessage);
  }

  if (!isJson) {
    throw new Error("Response is not JSON");
  }

  const jsonData = await response.json();

  // API response-dan data-nı çıxar
  if (jsonData && typeof jsonData === "object" && "data" in jsonData) {
    return jsonData as T;
  }

  return jsonData as T;
};

// GET request
const fetchData = <TData>(url: string): Promise<TData> => {
  return fetch(url, { cache: "no-store" }).then((res) =>
    handleResponse<TData>(res)
  );
};

// POST, PUT, PATCH requests
const mutateData = <TData, TVariables>({
  endpoint,
  payload,
  method,
}: {
  endpoint: string;
  payload: TVariables;
  method: "POST" | "PUT" | "PATCH";
}): Promise<TData> => {
  const isFormData = payload instanceof FormData;

  const headers: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  let url = `${apiUrl}/${endpoint}`;
  let locale: string | undefined;
  let finalPayload: TVariables | Omit<TVariables, "locale"> = payload;

  if (!isFormData && payload && typeof payload === "object") {
    const payloadObject = payload as { locale?: string };

    if (payloadObject.locale) {
      locale = payloadObject.locale;
      const { locale: _, ...rest } = payloadObject;
      finalPayload = rest as TVariables;
    }
  }
  if (locale) {
    url += url.includes("?") ? `&locale=${locale}` : `?locale=${locale}`;
  }
  return fetch(url, {
    method,
    headers,
    body: isFormData ? (payload as BodyInit) : JSON.stringify(finalPayload),
    cache: "no-store",
  }).then((res) => handleResponse<TData>(res));
};
// DELETE request
const deleteData = ({ endpoint }: { endpoint: string }): Promise<any> => {
  return fetch(`${apiUrl}/${endpoint}`, {
    method: "DELETE",
    cache: "no-store",
  }).then((res) => handleResponse<any>(res));
};

// Base key extraction
const getBaseKey = (endpoint: string) =>
  endpoint.split("?")[0].split("/")[0].replace(/^\//, "");

type QueryParams = Record<string, string | number | boolean | undefined | null>;

// Query key builder
export const createQueryKey = (
  endpoint: string,
  params?: QueryParams,
  id?: string | number
): QueryKey => {
  const baseKey = getBaseKey(endpoint);
  const keys: any[] = [baseKey];

  if (id) {
    keys.push("detail", id);
  } else {
    keys.push("list");
    if (params && Object.keys(params).length > 0) {
      keys.push(params);
    }
  }

  return keys;
};

// ============ HOOKS ============

// GET - List
export const useGetData = <TData>(
  endpoint: string,
  params?: QueryParams,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) => {
  const queryKey = createQueryKey(endpoint, params);

  const queryFn = async (): Promise<TData> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value != null)
        )
      : {};
    const queryString = new URLSearchParams(
      filteredParams as Record<string, string>
    ).toString();
    const url = `${apiUrl}/${endpoint}${queryString ? `?${queryString}` : ""}`;
    return fetchData(url);
  };

  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...options,
  });
};

// GET by ID - Detail
export const useGetDataById = <TData>(
  endpoint: string,
  id: string | number | undefined | null,
  locale?: string,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) => {
  const params = locale ? { locale } : undefined;
  const queryKey = createQueryKey(
    `${endpoint}/${id}`,
    params,
    id as string | number
  );

  const queryFn = async (): Promise<TData> => {
    const url = locale
      ? `${apiUrl}/${endpoint}/${id}?locale=${locale}`
      : `${apiUrl}/${endpoint}/${id}`;
    return fetchData(url);
  };

  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    enabled: !!id,
    ...options,
  });
};

type MutationVariables<TVariables> = {
  endpoint: string;
  payload: TVariables;
};

type MutationConfig<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, MutationVariables<TVariables>>,
  "mutationFn"
> & {
  invalidateKeys?: string[];
};

// Invalidation helper - DÜZƏLDİLMİŞ VERSİYA
const invalidateQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  baseKey: string,
  additionalKeys?: string[]
) => {
  // 1. Base key-ə aid BÜTÜN query-ləri invalidate et (list və detail)
  await queryClient.invalidateQueries({
    queryKey: [baseKey],
    exact: false, // Bütün nested key-ləri də əhatə edir
  });

  // 2. Əlavə key-lər varsa onları da invalidate et
  if (additionalKeys && additionalKeys.length > 0) {
    for (const key of additionalKeys) {
      await queryClient.invalidateQueries({
        queryKey: [key],
        exact: false,
      });
    }
  }

  // 3. Dərhal refetch et (aktiv query-lər üçün)
  await queryClient.refetchQueries({
    queryKey: [baseKey],
    exact: false,
    type: "active",
  });

  if (additionalKeys && additionalKeys.length > 0) {
    for (const key of additionalKeys) {
      await queryClient.refetchQueries({
        queryKey: [key],
        exact: false,
        type: "active",
      });
    }
  }
};

// POST
export const usePostData = <TData = unknown, TVariables = unknown>(
  config?: MutationConfig<TData, TVariables>
) => {
  const queryClient = useQueryClient();
  const { invalidateKeys, ...options } = config || {};

  return useMutation<TData, Error, MutationVariables<TVariables>>({
    mutationFn: (vars) => mutateData({ ...vars, method: "POST" }),
    onSuccess: async (data, variables, context, mutationInstance) => {
      const baseKey = getBaseKey(variables.endpoint);

      // Invalidate queries
      await invalidateQueries(queryClient, baseKey, invalidateKeys);

      // User callback
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutationInstance);
      }
    },
    ...options,
  });
};

// PUT
export const usePutData = <TData = unknown, TVariables = unknown>(
  config?: MutationConfig<TData, TVariables>
) => {
  const queryClient = useQueryClient();
  const { invalidateKeys, ...options } = config || {};

  return useMutation<TData, Error, MutationVariables<TVariables>>({
    mutationFn: (vars) => mutateData({ ...vars, method: "PUT" }),
    onSuccess: async (data, variables, context, mutationInstance) => {
      const baseKey = getBaseKey(variables.endpoint);

      // Invalidate queries
      await invalidateQueries(queryClient, baseKey, invalidateKeys);

      // User callback
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutationInstance);
      }
    },
    ...options,
  });
};

// PATCH
export const usePatchData = <TData = unknown, TVariables = unknown>(
  config?: MutationConfig<TData, TVariables>
) => {
  const queryClient = useQueryClient();
  const { invalidateKeys, ...options } = config || {};

  return useMutation<TData, Error, MutationVariables<TVariables>>({
    mutationFn: (vars) => mutateData({ ...vars, method: "PATCH" }),
    onSuccess: async (data, variables, context, mutationInstance) => {
      const baseKey = getBaseKey(variables.endpoint);

      // Invalidate queries
      await invalidateQueries(queryClient, baseKey, invalidateKeys);

      // User callback
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutationInstance);
      }
    },
    ...options,
  });
};

// DELETE
type DeleteConfig<TData> = Omit<
  UseMutationOptions<TData, Error, { endpoint: string }>,
  "mutationFn"
> & {
  invalidateKeys?: string[];
};

export const useDeleteData = <TData = { message: string }>(
  config?: DeleteConfig<TData>
) => {
  const queryClient = useQueryClient();
  const { invalidateKeys, ...options } = config || {};

  return useMutation<TData, Error, { endpoint: string }>({
    mutationFn: deleteData,
    onSuccess: async (data, variables, context, mutationInstance) => {
      const baseKey = getBaseKey(variables.endpoint);

      // Invalidate queries
      await invalidateQueries(queryClient, baseKey, invalidateKeys);

      // User callback
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutationInstance);
      }
    },
    ...options,
  });
};

// Manual invalidation helper
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: (keys: string | string[]) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      keyArray.forEach((key) => {
        queryClient.invalidateQueries({
          predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === key,
        });
      });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
};
