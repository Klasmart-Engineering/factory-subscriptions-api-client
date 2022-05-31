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

export interface UsageRequest extends BaseRequest {
    accountID: string;
}

export interface UsageResponse extends BaseResponse {
    types: [
        {
            type: string;
            displayName: string;
            from: string;
            to: string;
            usageAmount: number;
            valid_usage: boolean;
        }
    ];
}

export async function getUsage (client: AxiosInstance, request: UsageRequest, config?: AxiosRequestConfig) {
    const { accountID, ...rest } = request;
    const resp = await client.get<UsageResponse>(`/${accountID}/usage`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_USAGE_QUERY_KEY: QueryKey = `getUsage`;

export function useGetUsage (request: UsageRequest, options?: RequestConfigQueryOptions<UsageResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_USAGE_QUERY_KEY, request ], () => getUsage(axiosClient, request, options?.config), options?.queryOptions);
}
