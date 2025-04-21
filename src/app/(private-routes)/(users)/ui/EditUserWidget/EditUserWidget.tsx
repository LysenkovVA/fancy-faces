"use client";

import { memo } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { EditablePageWrapper } from "@/app/UI/EditablePageWrapper";
import { DynamicModuleLoader } from "@/app/lib/store";
import { UserForm } from "../UserForm/UserForm";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { userMultipleDetailsReducer } from "@/app/(private-routes)/(users)/model/slices/userMultipleDetailsSlice";

export interface EditUserWidgetProps {
    userId?: string;
}

export const EditUserWidget = memo((props: EditUserWidgetProps) => {
    const { userId } = props;

    const [form] = Form.useForm();
    const router = useRouter();

    return (
        <DynamicModuleLoader
            reducers={{
                userDetailsSchema: userMultipleDetailsReducer,
            }}
        >
            <EditablePageWrapper
                title={userId ? "Изменение" : "Новый пользователь"}
                // additionalTitle={
                //     UserHelper.getSurnameWithInitials(formData) ?? undefined
                // }
                height={CONTENT_HEIGHT}
                onSave={() => form.submit()}
                onCancel={() => router.back()}
            >
                <UserForm
                    form={form}
                    onSubmitted={() => router.back()}
                    entityId={userId}
                />
            </EditablePageWrapper>
        </DynamicModuleLoader>
    );
});
