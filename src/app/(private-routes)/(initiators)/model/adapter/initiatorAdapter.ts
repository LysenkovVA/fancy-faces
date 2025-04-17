import { createEntityAdapter } from "@reduxjs/toolkit";
import { InitiatorEntity } from "../types/InitiatorEntity";

export const initiatorAdapter = createEntityAdapter<InitiatorEntity, string>({
    selectId: (entity) => entity.id,
});
