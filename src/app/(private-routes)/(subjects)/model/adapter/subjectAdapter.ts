import { createEntityAdapter } from "@reduxjs/toolkit";
import { SubjectEntity } from "../types/SubjectEntity";

export const subjectAdapter = createEntityAdapter<SubjectEntity, string>({
    selectId: (entity) => entity.id,
    // sortComparer: (a, b) =>
    //     dayjs(a.createdAt) < dayjs(b.createdAt) ? 1 : 0,
});
