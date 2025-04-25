import { EntityState } from "@reduxjs/toolkit";

export interface SimpleListReduxSchema<EntityType, FilterType extends string>
    extends EntityState<EntityType, string> {
    isLoading?: boolean;
    error?: string;
    search?: string;
    filters?: OptionalRecord<FilterType, string[] | undefined>;
    _isInitialized: boolean;
}
