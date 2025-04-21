import { Metadata } from "next";
import { ViewSubjectWidget } from "@/app/(private-routes)/(subjects)/ui/ViewSubjectWidget/ViewSubjectWidget";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function SubjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <ViewSubjectWidget subjectId={id} />;
}
