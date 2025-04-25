"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
    Badge,
    Col,
    Divider,
    Flex,
    Form,
    FormInstance,
    Row,
    Spin,
    Tabs,
    TabsProps,
} from "antd";

import {
    DynamicModuleLoader,
    GlobalStateSchema,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { getSubjectByIdThunk } from "../../model/thunks/getSubjectByIdThunk";
import { upsertSubjectThunk } from "../../model/thunks/upsertSubjectThunk";
import {
    getSubjectDetailsError,
    getSubjectDetailsFormData,
    getSubjectDetailsIsFetching,
    getSubjectDetailsIsInitialized,
    getSubjectDetailsIsSaving,
} from "../../model/selectors/subjectDetailsSelectors";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    subjectMultipleDetailsActions,
    subjectMultipleDetailsReducer,
} from "../../model/slices/subjectMultipleDetailsSlice";
import { v4 as uuidv4 } from "uuid";
import { FormItemDatePicker } from "@/app/UI/FormItemDatePicker";
import { FormItemAntropologicalTypeDropDown } from "@/app/(private-routes)/(antropological-types)/ui/FormItemAntropologicalTypeDropDown/FormItemAntropologicalTypeDropDown";
import { FormItemSubgroupDropDown } from "@/app/(private-routes)/(subgroups)/ui/FormItemSubgroupDropDown/FormItemSubgroupDropDown";
import { FormItemGenderDropDown } from "@/app/(private-routes)/(genders)/ui/FormItemGenderDropDown/FormItemGenderDropDown";
import { FormItemViewTypeDropDown } from "@/app/(private-routes)/(view-types)/ui/FormItemViewTypeDropDown/FormItemViewTypeDropDown";
import { FormItemTextArea } from "@/app/UI/FormItemTextArea";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import infoPng from "../../../../lib/assets/png/information.png";
import observePng from "../../../../lib/assets/png/observe.png";
import characteristicsPng from "../../../../lib/assets/png/characteristics.png";
import facePng from "../../../../lib/assets/png/face.png";
import foreheadPng from "../../../../lib/assets/png/forehead.png";
import nosePng from "../../../../lib/assets/png/nose.png";
import mouthPng from "../../../../lib/assets/png/mouth.png";
import earsPng from "../../../../lib/assets/png/ears.png";
import hearPng from "../../../../lib/assets/png/hear.png";
import eyebrowPng from "../../../../lib/assets/png/eyebrow.png";
import chinPng from "../../../../lib/assets/png/chin.png";
import eyesPng from "../../../../lib/assets/png/eyes.png";
import scarsPng from "../../../../lib/assets/png/scars.png";
import agePng from "../../../../lib/assets/png/age.png";
import locationPng from "../../../../lib/assets/png/location.png";
import durationPng from "../../../../lib/assets/png/duration.png";
import lastObservationPng from "../../../../lib/assets/png/lastObservation.png";
import numberPng from "../../../../lib/assets/png/number.png";
import imagesPng from "../../../../lib/assets/png/images.png";
import percentPng from "../../../../lib/assets/png/percent.png";
import { FormItemInitiatorDropDown } from "@/app/(private-routes)/(initiators)/ui/FormItemInitiatorDropDown/FormItemInitiatorDropDown";
import { formRequiredMark } from "@/app/UI/formRequiredMark";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormImageList } from "@/app/UI/FormImageList";
import { FormItemUserDropDown } from "@/app/(private-routes)/(users)/ui/FormItemUserDropDown/FormItemUserDropDown";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";
import { AntropologicalType } from "@prisma/client";
import { subgroupsSimpleListActions } from "@/app/(private-routes)/(subgroups)/model/slices/subgroupsSimpleListSlice";
import { getSubgroupsSimpleListThunk } from "@/app/(private-routes)/(subgroups)/model/thunks/getSubgroupsSimpleListThunk";

export interface SubjectFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: SubjectEntity;
    onSubmitted: (data: SubjectEntity) => void;
}

export const SubjectForm = memo((props: SubjectFormProps) => {
    const { form, entityId, onSubmitted, initialData } = props;

    // Идентификатор формы (используется в стейте, поскольку может возникнуть
    // ситуация, что где-то будет открываться эта форма еще раз и у нее
    // должен быть свой стейт)
    const [formId] = useState(uuidv4());

    const [notificationApi, notificationContext] = useNotification();

    const dispatch = useAppDispatch();

    const formData = useAppSelector((state: GlobalStateSchema) =>
        getSubjectDetailsFormData(state, formId),
    );
    const error = useAppSelector((state: GlobalStateSchema) =>
        getSubjectDetailsError(state, formId),
    );
    const isFetching = useAppSelector((state: GlobalStateSchema) =>
        getSubjectDetailsIsFetching(state, formId),
    );
    const isSaving = useAppSelector((state: GlobalStateSchema) =>
        getSubjectDetailsIsSaving(state, formId),
    );
    const isInitialized = useAppSelector((state: GlobalStateSchema) =>
        getSubjectDetailsIsInitialized(state, formId),
    );

    useInitialEffect(
        () => {
            dispatch(
                subjectMultipleDetailsActions.init({
                    formId,
                }),
            );

            if (initialData) {
                dispatch(
                    subjectMultipleDetailsActions.setFormData({
                        formId,
                        data: initialData,
                    }),
                );
            } else {
                if (entityId) {
                    dispatch(
                        getSubjectByIdThunk({
                            formId,
                            id: entityId,
                        }),
                    );
                }
            }

            dispatch(
                subjectMultipleDetailsActions.setInitialized({
                    formId,
                    isInitialized: true,
                }),
            );
        },
        () => subjectMultipleDetailsActions.unmount({ formId }),
    );

    // Загрузка данных формы
    useEffect(() => {
        if (isInitialized && !isFetching && !isSaving) {
            form?.setFieldsValue(formData);
        }
    }, [dispatch, form, formData, isInitialized, isFetching, isSaving]);

    // Ошибка
    useEffect(() => {
        if (!!error) {
            notificationApi.error({ message: error });
        }
    }, [error, notificationApi]);

    const onFinish = useCallback(async () => {
        dispatch(
            upsertSubjectThunk({
                formId,
                entityId,
                entityData: formData!,
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    SubjectEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, entityId, formData, formId, onSubmitted]);

    const infoContent = useMemo(
        () => (
            <>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemDatePicker
                            labelText={"Дата"}
                            namePath={["date"]}
                            required
                            requiredMessage={"Укажите дату"}
                            placeholder={"Укажите дату"}
                            isLoading={isFetching}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemInput
                            labelText={"№ объекта"}
                            imageSrc={numberPng.src}
                            namePath={["objectNumber"]}
                            placeholder={"Укажите № объекта"}
                            isLoading={isFetching}
                            required
                            requiredMessage={"Укажите № объекта"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemInitiatorDropDown
                            namePath={["initiator"]}
                            isLoading={isFetching}
                            mode={"single"}
                            required
                            requiredMessage={"Укажите инициатора"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemInput
                            labelText={"Наименование"}
                            namePath={["name"]}
                            required={true}
                            requiredMessage={"Укажите наименование"}
                            placeholder={"Укажите наименование"}
                            isLoading={isFetching}
                        />
                    </Col>
                </Row>
                <FormItemInput
                    labelText={"Место"}
                    imageSrc={locationPng.src}
                    namePath={["location"]}
                    placeholder={"Укажите место"}
                    required
                    requiredMessage={"Укажите место"}
                    isLoading={isFetching}
                />
                <Divider />
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemAntropologicalTypeDropDown
                            namePath={["antropologicalType"]}
                            isLoading={isFetching}
                            mode={"single"}
                            required
                            requiredMessage={"Укажите антропологический тип"}
                            onChange={(value) => {
                                if (value) {
                                    if (value instanceof Array) {
                                        // TODO обработка массива
                                    } else {
                                        const selectedValue =
                                            value as AntropologicalType;

                                        if (selectedValue) {
                                            dispatch(
                                                subgroupsSimpleListActions.setFilters(
                                                    {
                                                        "antropological-type": [
                                                            selectedValue.id,
                                                        ],
                                                    },
                                                ),
                                            );
                                            dispatch(
                                                getSubgroupsSimpleListThunk({
                                                    replaceData: true,
                                                }),
                                            );
                                        }
                                    }
                                } else {
                                    // Обнуляем фильтр
                                    dispatch(
                                        subgroupsSimpleListActions.setFilters(
                                            undefined,
                                        ),
                                    );
                                    dispatch(
                                        getSubgroupsSimpleListThunk({
                                            replaceData: true,
                                        }),
                                    );
                                }
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemInput
                            labelText={"Длит. наблюдения"}
                            imageSrc={durationPng.src}
                            namePath={["durationOfObservation"]}
                            placeholder={"Укажите длительность наблюдения"}
                            isLoading={isFetching}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemSubgroupDropDown
                            namePath={["subgroup"]}
                            isLoading={isFetching}
                            mode={"single"}
                            required
                            requiredMessage={"Укажите подгруппу"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemInput
                            labelText={"Посл. наблюдение"}
                            imageSrc={lastObservationPng.src}
                            namePath={["lastObservation"]}
                            placeholder={"Укажите последнее наблюдение"}
                            isLoading={isFetching}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemGenderDropDown
                            namePath={["gender"]}
                            isLoading={isFetching}
                            mode={"single"}
                            required
                            requiredMessage={"Укажите пол"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemInput
                            labelText={"Возраст"}
                            imageSrc={agePng.src}
                            namePath={["age"]}
                            placeholder={"Укажите возраст"}
                            isLoading={isFetching}
                            required
                            requiredMessage={"Укажите возраст"}
                        />
                    </Col>
                </Row>
                <FormItemInput
                    labelText={"Степень схожести"}
                    isLoading={isFetching}
                    imageSrc={percentPng.src}
                    namePath={["portraitMatch"]}
                    placeholder={"Степень схожести"}
                />
                <Divider />
                <FormItemUserDropDown
                    namePath={["user"]}
                    isLoading={isFetching}
                    mode={"single"}
                    placeholder={"Эксперт"}
                    required
                    requiredMessage={"Укажите эксперта"}
                />
                <Divider />
                <FormItemTextArea
                    noStyle
                    labelText={" "}
                    namePath={["notes"]}
                    placeholder={"Примечания..."}
                />
            </>
        ),
        [isFetching],
    );

    const observationContent = useMemo(
        () => (
            <>
                <FormItemViewTypeDropDown
                    namePath={["viewType"]}
                    isLoading={isFetching}
                    mode={"single"}
                />
                <FormItemTextArea
                    labelText={"Особенности очевидца"}
                    namePath={["eyewitnessCharacteristics"]}
                    placeholder={"Укажите особенности очевидца"}
                />
                <FormItemTextArea
                    labelText={"Анатомические признаки"}
                    namePath={["anatomicCharacteristics"]}
                    placeholder={"Укажите анатомические признаки"}
                />
                <FormItemTextArea
                    labelText={"Функциональные признаки"}
                    namePath={["functionalCharacteristics"]}
                    placeholder={"Укажите функциональные признаки"}
                />
            </>
        ),
        [isFetching],
    );

    const faceContent = useMemo(
        () => (
            <>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Лицо"}
                            imageSrc={facePng.src}
                            namePath={["face"]}
                            placeholder={"Лицо"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Волосяной покров"}
                            imageSrc={hearPng.src}
                            namePath={["hear"]}
                            placeholder={"Волосяной покров"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Лоб"}
                            imageSrc={foreheadPng.src}
                            namePath={["forehead"]}
                            placeholder={"Лоб"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Брови"}
                            imageSrc={eyebrowPng.src}
                            namePath={["eyebrow"]}
                            placeholder={"Брови"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Глаза"}
                            imageSrc={eyesPng.src}
                            namePath={["eyes"]}
                            placeholder={"Глаза"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Нос"}
                            imageSrc={nosePng.src}
                            namePath={["nose"]}
                            placeholder={"Нос"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Рот"}
                            imageSrc={mouthPng.src}
                            namePath={["mouth"]}
                            placeholder={"Рот"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Подбородок"}
                            imageSrc={chinPng.src}
                            namePath={["chin"]}
                            placeholder={"Подбородок"}
                        />
                    </Col>
                </Row>
                <Row gutter={[32, 4]}>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Морщины, шрамы, родинки"}
                            imageSrc={scarsPng.src}
                            namePath={["scars"]}
                            placeholder={"Морщины, шрамы, родинки"}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItemTextArea
                            labelText={"Уши"}
                            imageSrc={earsPng.src}
                            namePath={["ears"]}
                            placeholder={"Уши"}
                        />
                    </Col>
                </Row>
            </>
        ),
        [],
    );

    const imagesContent = useMemo(
        () => (
            <FormImageList
                form={form}
                formId={formId}
                formListName={["photos"]}
                previewImages={true}
                imageHeight={300}
                onDelete={(id) => {}}
            />
        ),
        [form, formId],
    );

    const tabsContent: TabsProps["items"] = [
        {
            key: "1",
            label: (
                <LabelWithIcon
                    imageSrc={infoPng.src}
                    labelText={"Информация"}
                    iconSize={FORM_ICON_SIZE}
                />
            ),
            children: infoContent,
        },
        {
            key: "2",
            label: (
                <LabelWithIcon
                    imageSrc={observePng.src}
                    labelText={"Наблюдение"}
                    iconSize={FORM_ICON_SIZE}
                />
            ),
            children: observationContent,
        },
        {
            key: "3",
            label: (
                <LabelWithIcon
                    imageSrc={characteristicsPng.src}
                    labelText={"Признаки внешности объекта"}
                    iconSize={FORM_ICON_SIZE}
                />
            ),
            children: faceContent,
        },
        {
            key: "4",
            label: (
                <Flex align={"center"} justify={"start"} gap={8}>
                    <LabelWithIcon
                        imageSrc={imagesPng.src}
                        labelText={"Изображения"}
                        iconSize={FORM_ICON_SIZE}
                    />
                    {formData?.photos?.length !== undefined && (
                        <Badge
                            showZero={false}
                            count={formData?.photos?.length ?? 0}
                            color={PRIMARY_COLOR}
                        />
                    )}
                </Flex>
            ),
            children: imagesContent,
        },
    ];

    return (
        <DynamicModuleLoader
            reducers={{
                subjectDetailsSchema: subjectMultipleDetailsReducer,
            }}
        >
            {notificationContext}
            <Spin spinning={isSaving} tip={"Сохранение..."} size={"large"}>
                <Form
                    id={"specialityForm"}
                    form={form}
                    layout={"horizontal"}
                    {...formItemLayout}
                    requiredMark={formRequiredMark}
                    disabled={isFetching || isSaving}
                    onFinish={onFinish}
                    clearOnDestroy // Чтобы очищались данные формы
                    onValuesChange={(_, values) => {
                        dispatch(
                            subjectMultipleDetailsActions.setFormData({
                                formId,
                                data: {
                                    ...formData,
                                    ...values,
                                },
                            }),
                        );
                    }}
                >
                    <Tabs
                        defaultActiveKey="1"
                        type={"card"}
                        items={tabsContent}
                    />
                </Form>
            </Spin>
        </DynamicModuleLoader>
    );
});
