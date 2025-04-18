import type { Metadata } from "next";
import { React19AntdProvider } from "@/app/lib/providers/React19AntdProvider";
import { ClientErrorBoundary } from "@/app/lib/providers/ClientErrorBoundary";
import "./global.css";
import { StoreProvider } from "@/app/lib/store";
import { AuthProvider } from "@/app/lib/providers/AuthProvider";

export const metadata: Metadata = {
    title: "FancyFaces",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ClientErrorBoundary>
                    <StoreProvider>
                        <AuthProvider>
                            <React19AntdProvider>
                                {children}
                            </React19AntdProvider>
                        </AuthProvider>
                    </StoreProvider>
                </ClientErrorBoundary>
            </body>
        </html>
    );
}
