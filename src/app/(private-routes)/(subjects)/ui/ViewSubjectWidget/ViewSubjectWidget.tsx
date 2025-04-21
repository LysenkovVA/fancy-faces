"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/app/lib/store";
import { getSubjectByIdThunk } from "@/app/(private-routes)/(subjects)/model/thunks/getSubjectByIdThunk";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { Button, Col, Flex, Row, Typography } from "antd";
import { Picture } from "@/app/UI/Picture";
import dayjs from "dayjs";
import { lorem } from "next/dist/client/components/react-dev-overlay/ui/utils/lorem";
import { useReactToPrint } from "react-to-print";
import printStyles from "./ViewSubjectWidget.module.css";

export interface ViewSubjectWidgetProps {
    subjectId: string;
}

export const ViewSubjectWidget = memo((props: ViewSubjectWidgetProps) => {
    const { subjectId } = props;

    // Идентификатор формы (используется в стейте, поскольку может возникнуть
    // ситуация, что где-то будет открываться эта форма еще раз и у нее
    // должен быть свой стейт)
    // const [formId] = useState(uuidv4());

    const dispatch = useAppDispatch();
    const [subject, setSubject] = useState<SubjectEntity | undefined>(
        undefined,
    );

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        bodyClass: printStyles.page,
        contentRef,
    });

    useEffect(() => {
        if (subjectId) {
            const res = dispatch(
                getSubjectByIdThunk({ formId: "", id: subjectId }),
            ).then((result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    const data = result.payload as ResponseData<SubjectEntity>;

                    if (data) {
                        setSubject(data.data);
                    }
                }
            });
        }
    }, [dispatch, subjectId]);

    if (!subject?.id) {
        return (
            <div
                style={{
                    background: "lightgray",
                    borderRadius: 12,
                    width: 200,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    padding: 8,
                }}
            >
                {"Загрузка..."}
            </div>
        );
    }

    return (
        <>
            <Button onClick={() => reactToPrintFn()}>{"Print"}</Button>
            <div
                key={"wrapper"}
                style={{
                    height: CONTENT_HEIGHT,
                    overflowY: "auto",
                }}
            >
                <div
                    ref={contentRef}
                    // key={"page"}
                    style={{
                        width: "21cm",
                        height: "29.7cm",
                        padding: "1.5cm",
                        margin: "1cm auto",
                        // border: "1px #d3d3d3 solid",
                        borderRadius: "5px",
                        background: "gray",
                        // boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Flex
                        id={"myPage"}
                        style={{ width: "100%" }}
                        align={"center"}
                        justify={"center"}
                        gap={8}
                        vertical
                    >
                        <Row
                            gutter={[8, 16]}
                            align={"middle"}
                            justify={"center"}
                        >
                            {subject?.photos?.map((photo) => (
                                <Col key={photo.id} span={8}>
                                    <Picture
                                        key={photo.id!}
                                        shape={"picture"}
                                        pictureHeight={150}
                                        pictureWidth={"auto"}
                                        value={photo}
                                        borderWidth={2}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Typography.Text>
                            {dayjs(subject.date).format("DD.MM.YYYY") ?? "-"}
                        </Typography.Text>
                        <Typography.Text>{lorem}</Typography.Text>
                        <Typography.Text
                        // style={{
                        //     pageBreakBefore: "always",
                        //     pageBreakAfter: "always",
                        //     pageBreakInside: "auto",
                        // }}
                        >
                            {lorem}
                        </Typography.Text>
                    </Flex>
                </div>
            </div>
        </>
    );
});
