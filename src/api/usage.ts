import { useSubscriptionsApiClient } from "../core";
import { RequestConfigQueryOptions } from "./shared";
import {
    AxiosInstance
    ,
    AxiosRequestConfig,
} from "axios";
import {
    QueryKey,
    useQuery,
} from "react-query";

export enum UsageReportState {
    PROCESSING = `processing`,
    READY = `ready`,
    NOT_REQUESTED = `not_requested`
}

// #region /GET /subscriptions/{subscriptionId}/usage-reports

export interface GetSubscriptionUsageReportsRequest {
    subscriptionId: string;
}

interface SubscriptionUsageReport {
    id: string;
    from: number;
    to: number;
}

export interface GetSubscriptionUsageReportsResponse extends Array<SubscriptionUsageReport>{}

export async function getSubscriptionUsageReports (client: AxiosInstance, request: GetSubscriptionUsageReportsRequest, config?: AxiosRequestConfig) {
    const { subscriptionId, ...rest } = request;
    const resp = await client.get<GetSubscriptionUsageReportsResponse>(`/subscriptions/${subscriptionId}/usage-reports`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_SUBSCRIPRTION_USAGE_REPORTS_QUERY_KEY: QueryKey = `getSubscriptionUsageReports`;

export function useGetSubscriptionUsageReports (request: GetSubscriptionUsageReportsRequest, options?: RequestConfigQueryOptions<GetSubscriptionUsageReportsResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_SUBSCRIPRTION_USAGE_REPORTS_QUERY_KEY, request ], () => getSubscriptionUsageReports(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /GET /subscriptions/{subscriptionId}/usage-reports

// #region /GET /subscriptions/{subscriptionId}/usage-reports/{usageReportId}

export interface GetSubscriptionUsageReportByIdRequest {
    subscriptionId: string;
    usageReportId: string;
}

export interface GetSubscriptionUsageReportByIdResponse {
    id: string;
    from: number;
    to: number;
    report_completed_at: number;
    state: string;
    products: {
        [key: string]: number;
    };
}

export async function getSubscriptionUsageReportById (client: AxiosInstance, request: GetSubscriptionUsageReportByIdRequest, config?: AxiosRequestConfig) {
    const {
        subscriptionId,
        usageReportId,
        ...rest
    } = request;
    const resp = await client.get<GetSubscriptionUsageReportByIdResponse>(`/subscriptions/${subscriptionId}/usage-reports/${usageReportId}`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const GET_SUBSCRIPRTION_USAGE_REPORT_BY_ID_QUERY_KEY: QueryKey = `getSubscriptionUsageReportById`;

export function useGetSubscriptionUsageReportById (request: GetSubscriptionUsageReportByIdRequest, options?: RequestConfigQueryOptions<GetSubscriptionUsageReportByIdResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ GET_SUBSCRIPRTION_USAGE_REPORT_BY_ID_QUERY_KEY, request ], () => getSubscriptionUsageReportById(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /GET /subscriptions/{subscriptionId}/usage-reports/{usageReportId}

// #region /PATCH /subscriptions/{subscriptionId}/usage-reports/{usageReportId}

export interface PatchSubscriptionUsageReportByIdRequest extends BaseRequest {
    subscriptionId: string;
    usageReportId: string;
    state: UsageReportState;
}

export interface PatchSubscriptionUsageReportByIdResponse extends BaseResponse {
    state: UsageReportState;
}

export async function patchSubscriptionUsageReportById (client: AxiosInstance, request: PatchSubscriptionUsageReportByIdRequest, config?: AxiosRequestConfig) {
    const {
        subscriptionId,
        usageReportId,
        ...rest
    } = request;
    const resp = await client.patch<PatchSubscriptionUsageReportByIdResponse>(`/subscriptions/${subscriptionId}/usage-reports/${usageReportId}`, {
        ...config,
        params: {
            ...rest,
            ...config?.params,
        },
    });
    return resp.data;
}

export const PATCH_SUBSCRIPRTION_USAGE_REPORT_BY_ID_QUERY_KEY: QueryKey = `patchSubscriptionUsageReportById`;

export function usePatchSubscriptionUsageReportById (request: PatchSubscriptionUsageReportByIdRequest, options?: RequestConfigQueryOptions<PatchSubscriptionUsageReportByIdResponse>) {
    const { axiosClient } = useSubscriptionsApiClient();
    return useQuery([ PATCH_SUBSCRIPRTION_USAGE_REPORT_BY_ID_QUERY_KEY, request ], () => patchSubscriptionUsageReportById(axiosClient, request, options?.config), options?.queryOptions);
}

// #endregion /PATCH /subscriptions/{subscriptionId}/usage-reports/{usageReportId}
