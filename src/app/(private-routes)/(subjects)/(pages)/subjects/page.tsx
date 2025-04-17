import { Metadata } from "next";
import { SubjectsCardList } from "../../ui/SubjectsCardList/SubjectsCardList";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function SubjectsPage() {
    return <SubjectsCardList columnsCount={3} />;
}
