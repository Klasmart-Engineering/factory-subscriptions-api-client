import {
    getHealth,
    HealthRequest,
    HealthResponse,
} from "../api/health";
import { RequestConfigOptions } from "../api/shared";
import {
    deleteSubscription,
    DeleteSubscriptionRequest,
    DeleteSubscriptionResponse,
    getSubscription,
    GetSubscriptionRequest,
    GetSubscriptionResponse,
    patchSubscription,
    PatchSubscriptionRequest,
    PatchSubscriptionResponse,
} from "../api/subscription";
import {
    getSubscriptionUsageReportById,
    GetSubscriptionUsageReportByIdRequest,
    GetSubscriptionUsageReportByIdResponse,
    getSubscriptionUsageReports,
    GetSubscriptionUsageReportsRequest,
    GetSubscriptionUsageReportsResponse,
    patchSubscriptionUsageReportById,
    PatchSubscriptionUsageReportByIdRequest,
    PatchSubscriptionUsageReportByIdResponse,
} from "../api/usage";
import axios,
{
    AxiosDefaults,
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import React,
{
    createContext,
    useCallback,
    useContext,
    useMemo,
} from "react";
import {
    DefaultOptions,
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
    QueryClientProviderProps,
} from "react-query";

interface SubscriptionsApiActions {
    getHealth: (request: HealthRequest, options?: RequestConfigOptions) => Promise<HealthResponse>;
    getSubscription: (request: GetSubscriptionRequest, options?: RequestConfigOptions) => Promise<GetSubscriptionResponse>;
    patchSubscription: (request: PatchSubscriptionRequest, options?: RequestConfigOptions) => Promise<PatchSubscriptionResponse>;
    deleteSubscription: (request: DeleteSubscriptionRequest, options?: RequestConfigOptions) => Promise<DeleteSubscriptionResponse>;
    getSubscriptionUsageReports: (request: GetSubscriptionUsageReportsRequest, options?: RequestConfigOptions) => Promise<GetSubscriptionUsageReportsResponse>;
    getSubscriptionUsageReportById: (request: GetSubscriptionUsageReportByIdRequest, options?: RequestConfigOptions) => Promise<GetSubscriptionUsageReportByIdResponse>;
    patchSubscriptionUsageReportById: (request: PatchSubscriptionUsageReportByIdRequest, options?: RequestConfigOptions) => Promise<PatchSubscriptionUsageReportByIdResponse>;
}

interface SubscriptionsApiClient {
    queryClient: QueryClient;
    axiosClient: AxiosInstance;
    updateHttpConfig: (config: Partial<AxiosDefaults>) => void;
    actions: SubscriptionsApiActions;
}
interface ProviderProps extends Partial<QueryClientProviderProps> {
    children: React.ReactNode;
    config: AxiosRequestConfig;
    responseInterceptors?: {
        onFulfilled?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | undefined;
        onRejected?: ((error: AxiosError) => any) | undefined;
    }[];
    requestInterceptors?: {
        onFulfilled?: ((value: AxiosRequestConfig<any>) => AxiosRequestConfig<any> | Promise<AxiosRequestConfig<any>>) | undefined;
        onRejected?: ((error: AxiosError) => any) | undefined;
    }[];
    queryOptions?: {
        queryCache?: QueryCache;
        mutationCache?: MutationCache;
        defaultOptions?: DefaultOptions;
    };
}
class SubscriptionsApiClientNoProviderError extends Error {
    constructor () {
        super (`useSubscriptionsApiClient must be used within a SubscriptionsApiClientContext.Provider`);
        this.name = `NO_PROVIDER`;
    }
}

const SubscriptionsApiClientContext = createContext<SubscriptionsApiClient>({
    queryClient: (null as unknown) as QueryClient,
    axiosClient: (null as unknown) as AxiosInstance,
    updateHttpConfig: () => { throw new SubscriptionsApiClientNoProviderError(); },
    actions: {
        getHealth: () => { throw new SubscriptionsApiClientNoProviderError(); },
        getSubscription: () => { throw new SubscriptionsApiClientNoProviderError(); },
        patchSubscription: () => { throw new SubscriptionsApiClientNoProviderError(); },
        deleteSubscription: () => { throw new SubscriptionsApiClientNoProviderError(); },
        getSubscriptionUsageReports: () => { throw new SubscriptionsApiClientNoProviderError(); },
        getSubscriptionUsageReportById: () => { throw new SubscriptionsApiClientNoProviderError(); },
        patchSubscriptionUsageReportById: () => { throw new SubscriptionsApiClientNoProviderError(); },
    },
});

export function SubscriptionsApiClientProvider (props: ProviderProps) {
    const {
        children,
        config,
        queryOptions,
        responseInterceptors,
        requestInterceptors,
        ...rest
    } = props;

    const queryClient = useMemo(() => new QueryClient(queryOptions), [ queryOptions ]);
    const axiosClient = useMemo(() => {
        const client = axios.create(config);

        for (const interceptor of requestInterceptors ?? []) {
            client.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
        }

        for (const interceptor of responseInterceptors ?? []) {
            client.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
        }

        return client;
    }, [
        config,
        responseInterceptors,
        requestInterceptors,
    ]);

    const updateHttpConfig = useCallback((config: Partial<AxiosDefaults>) => {
        queryClient.cancelMutations();
        queryClient.cancelQueries();
        axiosClient.defaults = {
            ...axiosClient.defaults,
            ...config,
        };
        queryClient.clear();
    }, [ axiosClient, queryClient ]);

    const updatedProps = {
        client: queryClient,
        ...rest,
    };

    const getHealthAction = useCallback((request: HealthRequest, options?: RequestConfigOptions) => {
        return getHealth(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const getSubscriptionAction = useCallback((request: GetSubscriptionRequest, options?: RequestConfigOptions) => {
        return getSubscription(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const patchSubscriptionAction = useCallback((request: PatchSubscriptionRequest, options?: RequestConfigOptions) => {
        return patchSubscription(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const deleteSubscriptionAction = useCallback((request: DeleteSubscriptionRequest, options?: RequestConfigOptions) => {
        return deleteSubscription(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const getSubscriptionUsageReportsAction = useCallback((request: GetSubscriptionUsageReportsRequest, options?: RequestConfigOptions) => {
        return getSubscriptionUsageReports(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const getSubscriptionUsageReportByIdAction = useCallback((request: GetSubscriptionUsageReportByIdRequest, options?: RequestConfigOptions) => {
        return getSubscriptionUsageReportById(axiosClient, request, options?.config);
    }, [ axiosClient ]);
    const patchSubscriptionUsageReportByIdAction = useCallback((request: PatchSubscriptionUsageReportByIdRequest, options?: RequestConfigOptions) => {
        return patchSubscriptionUsageReportById(axiosClient, request, options?.config);
    }, [ axiosClient ]);

    const actions = useMemo(() => {
        return {
            getHealth: getHealthAction,
            getSubscription: getSubscriptionAction,
            patchSubscription: patchSubscriptionAction,
            deleteSubscription: deleteSubscriptionAction,
            getSubscriptionUsageReports: getSubscriptionUsageReportsAction,
            getSubscriptionUsageReportById: getSubscriptionUsageReportByIdAction,
            patchSubscriptionUsageReportById: patchSubscriptionUsageReportByIdAction,
        };
    }, [
        getHealthAction,
        getSubscriptionAction,
        patchSubscriptionAction,
        deleteSubscriptionAction,
        getSubscriptionUsageReportsAction,
        getSubscriptionUsageReportByIdAction,
        patchSubscriptionUsageReportByIdAction,
    ]);

    return (
        <SubscriptionsApiClientContext.Provider
            value={{
                queryClient,
                axiosClient,
                updateHttpConfig,
                actions,
            }}
        >
            <QueryClientProvider {...updatedProps}>
                {children}
            </QueryClientProvider>
        </SubscriptionsApiClientContext.Provider>
    );
}

export const useSubscriptionsApiClient = () => {
    const context = useContext(SubscriptionsApiClientContext);
    if (!context) {
        throw new SubscriptionsApiClientNoProviderError();
    }
    return context;
};
