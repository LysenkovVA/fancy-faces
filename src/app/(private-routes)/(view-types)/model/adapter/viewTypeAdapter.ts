import { createEntityAdapter } from "@reduxjs/toolkit";
import { ViewTypeEntity } from "../types/ViewTypeEntity";

export const viewTypeAdapter = createEntityAdapter<ViewTypeEntity, string>({
    selectId: (entity) => entity.id,
});
