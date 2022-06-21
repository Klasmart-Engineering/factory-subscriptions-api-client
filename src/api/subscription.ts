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

export enum SubscriptionState {
    ACTIVE = `active`,
    DISABLED = `disabled`
}

// #region /GET /subscriptions/{subscriptionId}

export interface GetSubscriptionRequest extends BaseRequest {
    subscriptionId: string;
}

export interface GetSubscriptionResponse extends BaseResponse {
    subscription_id: string;
    account_id: string;
    state: SubscriptionState;
    created_on: number;
}

export async function getSubscription (client: AxiosInstance, request: GetSubscriptionRequest, config?: AxiosRequestConfig) {
    const { subscriptionId, ...rest } = request;
    const resp = await client.get<GetSubscriptionResponse>(`/subscriptions/${subscriptionId}`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_SUBSCRIPTION_QUERY_KEY: QueryKey = `getSubscription`;

export function useGetSubscription (request: GetSubscriptionRequest, options?: RequestConfigQueryOptions<GetSubscriptionResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_SUBSCRIPTION_QUERY_KEY, request ], () => getSubscription(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /GET /subscriptions/{subscriptionId}

// #region /PATCH /subscriptions/{subscriptionId}

export interface PatchSubscriptionRequest extends BaseRequest {
    subscriptionId: string;
    state: SubscriptionState;
}

export interface PatchSubscriptionResponse extends BaseResponse {
}

export async function patchSubscription (client: AxiosInstance, request: PatchSubscriptionRequest, config?: AxiosRequestConfig) {
    const { subscriptionId, ...rest } = request;
    const resp = await client.patch<PatchSubscriptionResponse>(`/subscriptions/${subscriptionId}`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const PATCH_SUBSCRIPTION_QUERY_KEY: QueryKey = `patchSubscription`;

export function usePatchSubscription (request: PatchSubscriptionRequest, options?: RequestConfigQueryOptions<PatchSubscriptionResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ PATCH_SUBSCRIPTION_QUERY_KEY, request ], () => patchSubscription(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /PATCH /subscriptions/{subscriptionId}

// #region /DELETE /subscriptions/{subscriptionId}

export interface DeleteSubscriptionRequest extends BaseRequest {
    subscriptionId: string;
}

export interface DeleteSubscriptionResponse extends BaseResponse {
}

export async function deleteSubscription (client: AxiosInstance, request: DeleteSubscriptionRequest, config?: AxiosRequestConfig) {
    const { subscriptionId, ...rest } = request;
    const resp = await client.delete<DeleteSubscriptionResponse>(`/subscriptions/${subscriptionId}`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const DELETE_SUBSCRIPTION_QUERY_KEY: QueryKey = `deleteSubscription`;

export function useDeleteSubscription (request: DeleteSubscriptionRequest, options?: RequestConfigQueryOptions<DeleteSubscriptionResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ DELETE_SUBSCRIPTION_QUERY_KEY, request ], () => deleteSubscription(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /DELETE /subscriptions/{subscriptionId}
