import { Metadata } from "next";
import { UsersCardList } from "@/app/(private-routes)/(users)/ui/UsersCardList/UsersCardList";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function SubjectsPage() {
    return <UsersCardList columnsCount={3} />;
}
