import { ReactNode } from "react";
import { AppLayout } from "@/app/UI/AppLayout/ui/AppLayout/AppLayout";

export default function ProtectedRoutesLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <AppLayout>{children}</AppLayout>;
}
