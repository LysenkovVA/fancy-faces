import { Metadata } from "next";
import { EditUserWidget } from "../../../ui/EditUserWidget/EditUserWidget";

export const metadata: Metadata = {
    title: "Фотопортрет | Новый пользователь",
};

export default async function UserDetailsPage() {
    return <EditUserWidget />;
}
