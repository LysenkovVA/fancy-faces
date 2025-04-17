import { createEntityAdapter } from "@reduxjs/toolkit";
import { SubjectEntity } from "../types/SubjectEntity";

export const subjectAdapter = createEntityAdapter<SubjectEntity, string>({
    selectId: (entity) => entity.id,
});
