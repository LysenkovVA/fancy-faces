import { createEntityAdapter } from "@reduxjs/toolkit";
import { SubgroupEntity } from "../types/SubgroupEntity";

export const subgroupAdapter = createEntityAdapter<SubgroupEntity, string>({
    selectId: (entity) => entity.id,
});
