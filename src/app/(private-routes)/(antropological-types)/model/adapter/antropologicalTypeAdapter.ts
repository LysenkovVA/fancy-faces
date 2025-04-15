import { createEntityAdapter } from "@reduxjs/toolkit";
import { AntropologicalTypeEntity } from "../types/AntropologicalTypeEntity";

export const antropologicalTypeAdapter = createEntityAdapter<
    AntropologicalTypeEntity,
    string
>({
    selectId: (entity) => entity.id,
});
