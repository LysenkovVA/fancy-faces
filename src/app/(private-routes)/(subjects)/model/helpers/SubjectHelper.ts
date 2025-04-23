import { SubjectEntity } from "@/app/(private-routes)/(subjects)";
import dayjs from "dayjs";

export class SubjectHelper {
    static getCardTitle(subject?: SubjectEntity): string {
        if (!subject) {
            return "";
        }

        let result = "";

        if (subject?.objectNumber) {
            result += `№ ${subject?.objectNumber}`;
        }

        if (subject?.name) {
            if (subject?.objectNumber) {
                result += ` | ${subject.name}`;
            } else {
                result += `${subject.name}`;
            }
        }

        if (subject.date) {
            result += ` от ${dayjs(subject.date).format("DD.MM.YYYY")}`;
        }

        return result;
    }
}
