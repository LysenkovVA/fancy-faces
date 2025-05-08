import { SubjectEntity } from "./SubjectEntity";

export interface CompareSubjectsListSchema {
    entities?: SubjectEntity[];
    isLoading: boolean;
    error: string;
    _isInitialized?: boolean;
}
