import { Metadata } from "next";
import { EditSubjectWidget } from "../../../ui/EditSubjectWidget/EditSubjectWidget";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function SubjectDetailsPage() {
    return <EditSubjectWidget />;
}
