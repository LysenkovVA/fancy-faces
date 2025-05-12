import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subjectAdapter } from "../adapter/subjectAdapter";
import { getSubjectsListThunk } from "../thunks/getSubjectsListThunk";
import { ListReduxSchema } from "@/app/lib/types/ListReduxSchema";
import { SubjectEntity } from "../types/SubjectEntity";
import { deleteSubjectByIdThunk } from "../thunks/deleteSubjectByIdThunk";
import { SubjectFilterType } from "../types/SubjectFilterType";
import { upsertSubjectThunk } from "@/app/(private-routes)/(subjects)/model/thunks/upsertSubjectThunk";
import { getPhotoByIdThunk } from "@/app/(private-routes)/(photos)/model/thunks/getPhotoByIdThunk";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { upsertUserThunk } from "@/app/(private-routes)/(users)/model/thunks/upsertUserThunk";
import { upsertAntropologicalTypeThunk } from "@/app/(private-routes)/(antropological-types)/model/thunks/upsertAntropologicalTypeThunk";
import { upsertInitiatorThunk } from "@/app/(private-routes)/(initiators)/model/thunks/upsertInitiatorThunk";
import { upsertSubgroupThunk } from "@/app/(private-routes)/(subgroups)/model/thunks/upsertSubgroupThunk";
import { deleteInitiatorByIdThunk } from "@/app/(private-routes)/(initiators)/model/thunks/deleteInitiatorByIdThunk";
import { deleteAntropologicalTypeByIdThunk } from "@/app/(private-routes)/(antropological-types)/model/thunks/deleteAntropologicalTypeByIdThunk";
import { deleteSubgroupByIdThunk } from "@/app/(private-routes)/(subgroups)/model/thunks/deleteSubgroupByIdThunk";

const initialState: ListReduxSchema<SubjectEntity, SubjectFilterType> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    take: 9,
    skip: 0,
    search: "",
    highlightedSearch: "",
    filters: undefined,
    totalCount: 0,
    hasMore: true,
    _isInitialized: false,
};

export const subjectsListSlice = createSlice({
    name: "subjectsListSlice",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string | undefined>) => {
            state.search = action.payload;
            state.highlightedSearch = "";
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
            state._isInitialized = false;
        },
        setFilters: (
            state,
            action: PayloadAction<
                | OptionalRecord<SubjectFilterType, string[] | undefined>
                | undefined
            >,
        ) => {
            state.filters = action.payload;
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubjectsListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;
                state.highlightedSearch = state.search;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                    state.skip = 0;
                    state.totalCount = 0;
                    state.hasMore = true;
                }

                state._isInitialized = true;
            })
            .addCase(getSubjectsListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    subjectAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    subjectAdapter.addMany(state, action.payload.data!);
                }

                state.totalCount = action.payload.pagination?.total ?? 0;
                state.hasMore = state.totalCount > state.skip + state.take;

                if (state.hasMore) {
                    state.skip = state.skip + state.take;
                } else {
                    state.skip = state.totalCount;
                }
            })
            .addCase(getSubjectsListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                    state.hasMore = false;
                    state.totalCount = 0;
                }
            })
            .addCase(deleteSubjectByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.removeOne(state, action.payload.data!.id);
                state.totalCount = state.ids.length;
            })
            .addCase(deleteSubjectByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(upsertSubjectThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.upsertOne(state, action.payload.data!);
                state.totalCount = state.ids.length;
            })
            // Обновляем стейт, когда загрузили оригинал изображения
            .addCase(getPhotoByIdThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities).filter(
                        (entity: SubjectEntity) => {
                            if (
                                entity.photos?.some(
                                    (photo: PhotoEntity) =>
                                        photo.id === action.payload.data!.id,
                                )
                            ) {
                                const updated = {
                                    ...entity,
                                    photos: [
                                        ...entity.photos?.map((photo) => {
                                            if (
                                                photo.id !==
                                                action.payload.data!.id
                                            ) {
                                                return photo;
                                            } else {
                                                return action.payload.data!;
                                            }
                                        }),
                                    ],
                                };
                                subjectAdapter.upsertOne(state, updated);
                            }
                        },
                    );
                }
            })
            // Обновление антропологического типа
            .addCase(
                upsertAntropologicalTypeThunk.fulfilled,
                (state, action) => {
                    if (state.entities) {
                        Object.values(state.entities)
                            .filter((subject: SubjectEntity) => {
                                return (
                                    subject.antropologicalType?.id ===
                                    action.payload.data!.id
                                );
                            })
                            .map((subject: SubjectEntity) => {
                                subjectAdapter.updateOne(state, {
                                    id: subject.id,
                                    changes: {
                                        ...subject,
                                        antropologicalType:
                                            action.payload.data!,
                                    },
                                });
                            });
                    }
                },
            )
            // Обновление инициатора
            .addCase(upsertInitiatorThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities)
                        .filter((subject: SubjectEntity) => {
                            return (
                                subject.initiator?.id ===
                                action.payload.data!.id
                            );
                        })
                        .map((subject: SubjectEntity) => {
                            subjectAdapter.updateOne(state, {
                                id: subject.id,
                                changes: {
                                    ...subject,
                                    initiator: action.payload.data!,
                                },
                            });
                        });
                }
            })
            // Обновление подгруппы
            .addCase(upsertSubgroupThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities)
                        .filter((subject: SubjectEntity) => {
                            return (
                                subject.subgroup?.id === action.payload.data!.id
                            );
                        })
                        .map((subject: SubjectEntity) => {
                            subjectAdapter.updateOne(state, {
                                id: subject.id,
                                changes: {
                                    ...subject,
                                    subgroup: action.payload.data!,
                                },
                            });
                        });
                }
            })
            // Обновление пользователя
            .addCase(upsertUserThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities)
                        .filter((subject: SubjectEntity) => {
                            return subject.user?.id === action.payload.data!.id;
                        })
                        .map((subject: SubjectEntity) => {
                            subjectAdapter.updateOne(state, {
                                id: subject.id,
                                changes: {
                                    ...subject,
                                    user: action.payload.data!,
                                },
                            });
                        });
                }
            })
            .addCase(deleteInitiatorByIdThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities)
                        .filter((subject: SubjectEntity) => {
                            return (
                                subject.initiator?.id ===
                                action.payload.data!.id
                            );
                        })
                        .map((subject: SubjectEntity) => {
                            subjectAdapter.updateOne(state, {
                                id: subject.id,
                                changes: {
                                    ...subject,
                                    initiator: undefined,
                                },
                            });
                        });
                }
            })
            .addCase(
                deleteAntropologicalTypeByIdThunk.fulfilled,
                (state, action) => {
                    if (state.entities) {
                        Object.values(state.entities)
                            .filter((subject: SubjectEntity) => {
                                return (
                                    subject.antropologicalType?.id ===
                                    action.payload.data!.id
                                );
                            })
                            .map((subject: SubjectEntity) => {
                                subjectAdapter.updateOne(state, {
                                    id: subject.id,
                                    changes: {
                                        ...subject,
                                        antropologicalType: undefined,
                                    },
                                });
                            });
                    }
                },
            )
            .addCase(deleteSubgroupByIdThunk.fulfilled, (state, action) => {
                if (state.entities) {
                    Object.values(state.entities)
                        .filter((subject: SubjectEntity) => {
                            return (
                                subject.subgroup?.id === action.payload.data!.id
                            );
                        })
                        .map((subject: SubjectEntity) => {
                            subjectAdapter.updateOne(state, {
                                id: subject.id,
                                changes: {
                                    ...subject,
                                    subgroup: undefined,
                                },
                            });
                        });
                }
            });
    },
});

export const { actions: subjectsListActions, reducer: subjectsListReducer } =
    subjectsListSlice;
