import { Metadata } from "next";
import { EditSubjectWidget } from "../../../ui/EditSubjectWidget/EditSubjectWidget";

export const metadata: Metadata = {
    title: "Фотопортрет | Новый объект",
};

export default async function SubjectDetailsPage() {
    return <EditSubjectWidget />;
}
