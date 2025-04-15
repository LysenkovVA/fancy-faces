import { createEntityAdapter } from "@reduxjs/toolkit";
import { GenderEntity } from "../types/GenderEntity";

export const genderAdapter = createEntityAdapter<GenderEntity, string>({
    selectId: (entity) => entity.id,
});
