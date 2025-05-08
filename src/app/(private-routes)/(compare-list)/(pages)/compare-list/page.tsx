import { Metadata } from "next";
import { CompareList } from "@/app/(private-routes)/(compare-list)/ui/CompareList/CompareList";

export const metadata: Metadata = {
    title: "Фотопортрет | Список сравнения",
};

export default async function CompareListPage() {
    return <CompareList columnWidth={300} carouselHeight={250} />;
}
