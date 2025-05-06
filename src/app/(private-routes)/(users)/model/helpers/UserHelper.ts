import { UserEntity } from "@/app/(private-routes)/(users)";

export class UserHelper {
    static getFullName(user?: UserEntity) {
        if (!user) {
            return "";
        }

        let fullName = "";

        if (user.surname) {
            fullName = user.surname;
        }

        if (user.name) {
            fullName += ` ${user.name}`;

            if (user.patronymic) {
                fullName += ` ${user.patronymic}`;
            }
        }

        return fullName;
    }

    static getSurnameWithInitials(employee?: UserEntity) {
        if (!employee) {
            return "";
        }

        let fullName = "";

        if (employee.surname) {
            fullName = employee.surname;
        }

        if (employee.name) {
            fullName += ` ${employee.name[0]}.`;

            if (employee.patronymic) {
                fullName += `${employee.patronymic[0]}.`;
            }
        }

        return fullName;
    }
}
