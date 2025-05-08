import { Metadata } from "next";
import { EditUserWidget } from "../../../ui/EditUserWidget/EditUserWidget";

export const metadata: Metadata = {
    title: "Фотопортрет | Пользователь",
};

export default async function UserDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EditUserWidget userId={id} />;
}
