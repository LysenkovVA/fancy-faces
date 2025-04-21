import { Metadata } from "next";
import { EditUserWidget } from "../../../ui/EditUserWidget/EditUserWidget";

export const metadata: Metadata = {
    title: "FancyFaces",
};

export default async function UserDetailsPage() {
    return <EditUserWidget />;
}
