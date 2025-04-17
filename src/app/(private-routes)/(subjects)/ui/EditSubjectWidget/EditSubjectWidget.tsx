"use client";

import { memo } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { EditablePageWrapper } from "@/app/UI/EditablePageWrapper";
import { DynamicModuleLoader } from "@/app/lib/store";
import { SubjectForm } from "../SubjectForm/SubjectForm";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { subjectMultipleDetailsReducer } from "@/app/(private-routes)/(subjects)/model/slices/subjectMultipleDetailsSlice";

export interface EditSubjectWidgetProps {
    subjectId?: string;
}

export const EditSubjectWidget = memo((props: EditSubjectWidgetProps) => {
    const { subjectId } = props;

    const [form] = Form.useForm();
    const router = useRouter();

    return (
        <DynamicModuleLoader
            reducers={{
                subjectDetailsSchema: subjectMultipleDetailsReducer,
            }}
        >
            <EditablePageWrapper
                title={subjectId ? "Изменение" : "Новый субъект"}
                // additionalTitle={
                //     SubjectHelper.getSurnameWithInitials(formData) ?? undefined
                // }
                height={CONTENT_HEIGHT}
                onSave={() => form.submit()}
                onCancel={() => router.back()}
            >
                <SubjectForm
                    form={form}
                    onSubmitted={() => router.back()}
                    entityId={subjectId}
                />
            </EditablePageWrapper>
        </DynamicModuleLoader>
    );
});
