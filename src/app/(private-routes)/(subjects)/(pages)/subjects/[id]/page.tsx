import { Metadata } from "next";
import { EditSubjectWidget } from "../../../ui/EditSubjectWidget/EditSubjectWidget";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function SubjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EditSubjectWidget subjectId={id} />;
}
