import { Action, Reducer, ReducersMapObject } from "redux";
import { InfiniteScrollSchema } from "@/app/UI/InfiniteScroll/model/types/InfiniteScrollSchema";
import { FilterPanelSchema } from "@/app/UI/FilterPanel/model/types/FilterPanelSchema";
import {
    DetailsReduxSchema,
    MultipleDetailsReduxSchema,
} from "@/app/lib/types/MultipleDetailsReduxSchema";
import { GenderEntity } from "@/app/(private-routes)/(genders)/model/types/GenderEntity";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { ViewTypeEntity } from "@/app/(private-routes)/(view-types)";
import { AntropologicalTypeEntity } from "@/app/(private-routes)/(antropological-types)/model/types/AntropologicalTypeEntity";
import { SubgroupEntity } from "@/app/(private-routes)/(subgroups)/model/types/SubgroupEntity";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)/model/types/SubjectEntity";
import { ListReduxSchema } from "@/app/lib/types/ListReduxSchema";
import { SubjectFilterType } from "@/app/(private-routes)/(subjects)/model/types/SubjectFilterType";
import { InitiatorEntity } from "@/app/(private-routes)/(initiators)/model/types/InitiatorEntity";
import { UserEntity } from "@/app/(private-routes)/(users)";

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
    // Обязательные составляющие
    // Авторизация
    authSchema: DetailsReduxSchema<UserEntity>;
    // Позиции скроллов для бесконечных страниц
    infiniteScrollSchema: InfiniteScrollSchema;
    // Параметры панелей фильтров
    filterPanelSchema: FilterPanelSchema;

    gendersSimpleListSchema?: SimpleListReduxSchema<GenderEntity>;
    viewTypesSimpleListSchema?: SimpleListReduxSchema<ViewTypeEntity>;

    antropologicalTypeDetailsSchema?: MultipleDetailsReduxSchema<AntropologicalTypeEntity>;
    antropologicalTypesSimpleListSchema?: SimpleListReduxSchema<AntropologicalTypeEntity>;

    subgroupDetailsSchema?: MultipleDetailsReduxSchema<SubgroupEntity>;
    subgroupsSimpleListSchema?: SimpleListReduxSchema<SubgroupEntity>;

    subjectDetailsSchema?: MultipleDetailsReduxSchema<SubjectEntity>;
    subjectsSimpleListSchema?: SimpleListReduxSchema<SubjectEntity>;
    subjectsListSchema?: ListReduxSchema<SubjectEntity, SubjectFilterType>;

    initiatorDetailsSchema?: MultipleDetailsReduxSchema<InitiatorEntity>;
    initiatorsSimpleListSchema?: SimpleListReduxSchema<InitiatorEntity>;

    userDetailsSchema?: MultipleDetailsReduxSchema<UserEntity>;
    usersSimpleListSchema?: SimpleListReduxSchema<UserEntity>;
}

/**
 * Ключи глобальной схемы состояния
 */
export type GlobalStateSchemaKey = keyof GlobalStateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<GlobalStateSchema>;
    reduce: (state: GlobalStateSchema | undefined, action: Action) => any;
    add: (key: GlobalStateSchemaKey, reducer: Reducer) => void;
    remove: (key: GlobalStateSchemaKey) => void;
}
