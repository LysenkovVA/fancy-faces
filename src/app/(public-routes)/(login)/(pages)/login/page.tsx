import { LoginForm } from "./dynamic/LoginForm/LoginForm";
import { Metadata } from "next";
import { getSession } from "@/app/lib/auth/cookies";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Фотопортрет | Авторизация",
};

export default async function Login() {
    const sessionData = await getSession();

    if (sessionData?.user.id) {
        redirect("/subjects");
    }

    return <LoginForm style={{ width: "20%" }} />;
}
