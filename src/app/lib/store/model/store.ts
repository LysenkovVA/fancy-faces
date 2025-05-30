import { GlobalStateSchema, ReducerManager } from "./types/GlobalStateSchema";
import {
    configureStore,
    EnhancedStore,
    StoreEnhancer,
    ThunkDispatch,
    Tuple,
    UnknownAction,
} from "@reduxjs/toolkit";
import { createReducerManager } from "./reducerManager";
import { InfiniteScrollReducer } from "@/app/UI/InfiniteScroll/model/slices/InfiniteScrollSlice";
import { FilterPanelReducer } from "@/app/UI/FilterPanel/model/slices/FilterPanelSlice";
import { authReducer } from "@/app/(public-routes)/(login)";
import { compareSubjectsListReducer } from "@/app/(private-routes)/(compare-list)/model/slices/compareSubjectsListSlice";

/**
 * Центральное хранилище стейта.
 *
 * Внимание! Не использовать пустые интерфейсы, появляется ошибка при dispatch экшенов
 * @param initialState
 */
export const createReduxStore = (initialState?: GlobalStateSchema) => {
    const reducerManger = createReducerManager({
        // В корневой редюсер добавляются только те редюсеры,
        // которые являются обязательными
        // НЕ ЗАБЫТЬ ДОБАВЛЯТЬ НОВЫЕ В В МЕТОД clearOnLogout в редюсер менеджер, т.к. они пересоздаются при logout
        authSchema: authReducer,
        infiniteScrollSchema: InfiniteScrollReducer,
        filterPanelSchema: FilterPanelReducer,
        compareSubjectsListSchema: compareSubjectsListReducer,
    });

    const store = configureStore<GlobalStateSchema>({
        // Корневой редюсер
        // Для прокидывания состояния из менеджера необходимо вызвать функцию reducerManger.reduce
        reducer: reducerManger.reduce,
        // Отладка только для разработки
        devTools: process.env.NODE_ENV !== "production",
        // Начальное состояние стейта
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false, // Чтобы даты на форме не выдавали ошибок в консоль
            }),
    }) as ReduxStoreWithManager;

    store.reducerManager = reducerManger;

    return store;
};

export interface ReduxStoreWithManager
    extends EnhancedStore<
        GlobalStateSchema,
        UnknownAction,
        Tuple<
            [
                StoreEnhancer<{
                    dispatch: ThunkDispatch<
                        GlobalStateSchema,
                        undefined,
                        UnknownAction
                    >;
                }>,
                StoreEnhancer,
            ]
        >
    > {
    reducerManager: ReducerManager;
}

// Infer the return type of `createReduxStore`
export type AppStore = ReturnType<typeof createReduxStore>;
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];

export interface ThunkConfig<T> {
    rejectValue: T;
    state: GlobalStateSchema;
}

// export type AppThunk<ThunkReturnType = void> = ThunkAction<
//     ThunkReturnType,
//     RootState,
//     unknown,
//     Action
// >;
