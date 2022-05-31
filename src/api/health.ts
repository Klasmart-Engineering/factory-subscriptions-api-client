import { useSubscriptionsApiClient } from "../core";
import {
    BaseRequest,
    BaseResponse,
    RequestConfigQueryOptions,
} from "./shared";
import {
    AxiosInstance
    ,
    AxiosRequestConfig,
} from "axios";
import {
    QueryKey,
    useQuery,
} from "react-query";

export interface HealthRequest extends BaseRequest {
}

export interface HealthResponse extends BaseResponse {
    agents: {};
    now: string;
    status: string;
}

export async function getHealth (client: AxiosInstance, request: HealthRequest, config?: AxiosRequestConfig) {
    const resp = await client.get<HealthResponse>(`__health`, {
        ...config,
        params: {
            ...request,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_HEALTH_QUERY_KEY: QueryKey = `getHealth`;

export function useGetHealth (request: HealthRequest, options?: RequestConfigQueryOptions<HealthResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_HEALTH_QUERY_KEY, request ], () => getHealth(axiosClient, request, options?.config), options?.queryOptions);
}
