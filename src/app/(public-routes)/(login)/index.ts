import { AuthEntity, AuthEntitySchema } from "./model/types/AuthEntity";
import { authActions, authReducer } from "./model/slice/authSlice";

export type { AuthEntity };
export { AuthEntitySchema, authActions, authReducer };
