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

// #region ACTIVATE SUBSCRIPTION

export interface SubscriptionActivateRequest extends BaseRequest {
    accountID: string;
}

export interface SubscriptionActivateResponse extends BaseResponse {
}

export async function activateSubscription (client: AxiosInstance, request: SubscriptionActivateRequest, config?: AxiosRequestConfig) {
    const { accountID, ...rest } = request;
    const resp = await client.put<SubscriptionActivateResponse>(`/${accountID}/usage`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const PUT_SUBSCRIPTION_ACTIVATE_QUERY_KEY: QueryKey = `activateSubscription`;

export function useActivateSubscription (request: SubscriptionActivateRequest, options?: RequestConfigQueryOptions<SubscriptionActivateResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ PUT_SUBSCRIPTION_ACTIVATE_QUERY_KEY, request ], () => activateSubscription(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion ACTIVATE SUBSCRIPTION

// #region DEACTIVATE SUBSCRIPTION

export interface SubscriptionDeactivateRequest extends BaseRequest {
    accountID: string;
}

export interface SubscriptionDeactivateResponse extends BaseResponse {
}

export async function deactivateSubscription (client: AxiosInstance, request: SubscriptionDeactivateRequest, config?: AxiosRequestConfig) {
    const { accountID, ...rest } = request;
    const resp = await client.put<SubscriptionDeactivateResponse>(`/${accountID}/usage`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const PUT_SUBSCRIPTION_DEACTIVATE_QUERY_KEY: QueryKey = `deactivateSubscription`;

export function useDeactivateSubscription (request: SubscriptionDeactivateRequest, options?: RequestConfigQueryOptions<SubscriptionDeactivateResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ PUT_SUBSCRIPTION_DEACTIVATE_QUERY_KEY, request ], () => deactivateSubscription(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion DEACTIVATE SUBSCRIPTION

// #region SUBSCRIPTION SUMMARY (current state)

export interface SubscriptionSummaryRequest extends BaseRequest {
    accountID: string;
}

export interface SubscriptionSummaryResponse extends BaseResponse {
    state: string;
    subscriptionID: string;
    reportFrequency: string;
    lastProcessed: string;
}

export async function getSubscriptionSummary (client: AxiosInstance, request: SubscriptionSummaryRequest, config?: AxiosRequestConfig) {
    const { accountID, ...rest } = request;
    const resp = await client.get<SubscriptionSummaryResponse>(`/${accountID}/summary`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_SUBSCRIPTION_SUMMARY_QUERY_KEY: QueryKey = `getSubscriptionSummary`;

export function useGetSubscriptionSummary (request: SubscriptionDeactivateRequest, options?: RequestConfigQueryOptions<SubscriptionDeactivateResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_SUBSCRIPTION_SUMMARY_QUERY_KEY, request ], () => getSubscriptionSummary(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion SUBSCRIPTION SUMMARY
