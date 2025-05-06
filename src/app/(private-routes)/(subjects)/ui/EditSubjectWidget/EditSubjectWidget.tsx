"use client";

import React, { memo, useState } from "react";
import { App, Form } from "antd";
import { useRouter } from "next/navigation";
import { EditablePageWrapper } from "@/app/UI/EditablePageWrapper";
import { DynamicModuleLoader, useAppSelector } from "@/app/lib/store";
import { SubjectForm } from "../SubjectForm/SubjectForm";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { subjectMultipleDetailsReducer } from "@/app/(private-routes)/(subjects)/model/slices/subjectMultipleDetailsSlice";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)";

export interface EditSubjectWidgetProps {
    subjectId?: string;
}

export const EditSubjectWidget = memo((props: EditSubjectWidgetProps) => {
    const { subjectId } = props;

    const [form] = Form.useForm();
    const router = useRouter();
    const [isDataChanged, setIsDataChanged] = useState(false);
    const { confirm } = App.useApp().modal;
    const user = useAppSelector(getAuthUser);

    return (
        <DynamicModuleLoader
            reducers={{
                subjectDetailsSchema: subjectMultipleDetailsReducer,
            }}
        >
            <EditablePageWrapper
                // title={subjectId ? "Изменение" : "Новый субъект"}
                // additionalTitle={
                //     SubjectHelper.getSurnameWithInitials(formData) ?? undefined
                // }
                height={CONTENT_HEIGHT}
                onSave={() => form.submit()}
                onCancel={() => {
                    if (isDataChanged) {
                        confirm({
                            title: "Несохраненные изменения",
                            // icon: (
                            //     <DeleteOutlined style={{ color: "red" }} />
                            // ),
                            content: `Вы собираетесь закрыть страницу с редактированием записи, однако имеются несохраненные изменения. Выберите действие`,
                            okText: "Сохранить",
                            okType: "primary",
                            cancelText: "Не сохранять",
                            destroyOnClose: true,
                            type: "info",
                            onOk() {
                                form.submit();
                            },
                            onCancel() {
                                router.back();
                            },
                        });
                    } else {
                        router.back();
                    }
                }}
            >
                <SubjectForm
                    form={form}
                    onSubmitted={() => router.back()}
                    entityId={subjectId}
                    initialData={
                        subjectId
                            ? undefined
                            : ({ date: new Date(), user } as SubjectEntity)
                    }
                    onDataChanged={() => setIsDataChanged(true)}
                />
            </EditablePageWrapper>
        </DynamicModuleLoader>
    );
});
