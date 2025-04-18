import { createEntityAdapter } from "@reduxjs/toolkit";
import { UserEntity } from "../types/UserEntity";

export const userAdapter = createEntityAdapter<UserEntity, string>({
    selectId: (entity) => entity.id,
});
