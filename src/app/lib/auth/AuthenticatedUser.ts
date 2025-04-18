import { UserEntity } from "@/app/(private-routes)/(users)";
import { getSessionUser } from "@/app/(private-routes)/(users)/api/users/[id]/actions/getSessionUser";
import { ResponseData } from "@/app/lib/responses/ResponseData";

export class AuthenticatedUser {
    readonly _user: UserEntity;

    constructor(user: UserEntity) {
        this._user = user;
    }

    get data() {
        return this._user;
    }

    get isDBAdmin() {
        return this._user.userRole.name === "ADMIN";
    }

    get isDBUser() {
        return this._user.userRole.name === "USER";
    }
}

export async function getAuthenticatedUser(
    refreshIfNeeded?: boolean,
): Promise<AuthenticatedUser> {
    const authUser = await getSessionUser(refreshIfNeeded);

    if (!authUser) {
        throw new Error("Пользователь не авторизован");
    }

    return new AuthenticatedUser(authUser);
}

export async function checkServerAuth() {
    const authUser = await getAuthenticatedUser(true);

    if (!authUser) {
        return ResponseData.Forbidden([
            "Пользователь не авторизован",
        ]).toNextResponse();
    }
}
