import {
    getHealth,
    HealthRequest,
    HealthResponse,
} from "../api/health";
import { RequestConfigOptions } from "../api/shared";
import {
    activateSubscription,
    deactivateSubscription,
    SubscriptionActivateRequest,
    SubscriptionActivateResponse,
    SubscriptionDeactivateRequest,
    SubscriptionDeactivateResponse,
} from "../api/state";
import {
    getUsage,
    UsageRequest,
    UsageResponse,
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
    getUsage: (request: UsageRequest, options?: RequestConfigOptions) => Promise<UsageResponse>;
    getHealth: (request: HealthRequest, options?: RequestConfigOptions) => Promise<HealthResponse>;
    activateSubscription: (request: SubscriptionActivateRequest, options?: RequestConfigOptions) => Promise<SubscriptionActivateResponse>;
    deactivateSubscription: (request: SubscriptionDeactivateRequest, options?: RequestConfigOptions) => Promise<SubscriptionDeactivateResponse>;
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
        getUsage: () => { throw new SubscriptionsApiClientNoProviderError(); },
        getHealth: () => { throw new SubscriptionsApiClientNoProviderError(); },
        activateSubscription: () => { throw new SubscriptionsApiClientNoProviderError(); },
        deactivateSubscription: () => { throw new SubscriptionsApiClientNoProviderError(); },
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

    const getUsageAction = useCallback((request: UsageRequest, options?: RequestConfigOptions) => {
        return getUsage(axiosClient, request, options?.config);
    }, [ axiosClient ]);

    const getHealthAction = useCallback((request: HealthRequest, options?: RequestConfigOptions) => {
        return getHealth(axiosClient, request, options?.config);
    }, [ axiosClient ]);

    const activateSubscriptionAction = useCallback((request: SubscriptionActivateRequest, options?: RequestConfigOptions) => {
        return activateSubscription(axiosClient, request, options?.config);
    }, [ axiosClient ]);

    const deactivateSubscriptionAction = useCallback((request: SubscriptionDeactivateRequest, options?: RequestConfigOptions) => {
        return deactivateSubscription(axiosClient, request, options?.config);
    }, [ axiosClient ]);

    const actions = useMemo(() => {
        return {
            getUsage: getUsageAction,
            getHealth: getHealthAction,
            activateSubscription: activateSubscriptionAction,
            deactivateSubscription: deactivateSubscriptionAction,
        };
    }, [
        getUsageAction,
        getHealthAction,
        activateSubscriptionAction,
        deactivateSubscriptionAction,
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
