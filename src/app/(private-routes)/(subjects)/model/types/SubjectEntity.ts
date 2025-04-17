import { z } from "zod";
import { AntropologicalTypeEntity } from "@/app/(private-routes)/(antropological-types)";
import { SubgroupEntity } from "@/app/(private-routes)/(subgroups)";
import { GenderEntity } from "@/app/(private-routes)/(genders)";
import { ViewTypeEntity } from "@/app/(private-routes)/(view-types)";
import { InitiatorEntity } from "@/app/(private-routes)/(initiators)";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";

/**
 * Схема валидации
 */
export const SubjectEntitySchema = z.object({
    date: z.string().datetime({ offset: true }).nullish(),
    objectNumber: z.string().nullish(),
    name: z.string().nullish(),
    location: z.string().nullish(),
    age: z.string().nullish(),
    durationOfObservation: z.string().nullish(),
    lastObservation: z.string().nullish(),
    eyewitnessCharacteristics: z.string().nullish(),
    anatomicCharacteristics: z.string().nullish(),
    functionalCharacteristics: z.string().nullish(),
    face: z.string().nullish(),
    forehead: z.string().nullish(),
    eyes: z.string().nullish(),
    mouth: z.string().nullish(),
    scars: z.string().nullish(),
    hear: z.string().nullish(),
    eyebrow: z.string().nullish(),
    nose: z.string().nullish(),
    chin: z.string().nullish(),
    ears: z.string().nullish(),
    portraitMatch: z.string().nullish(),
});

export type SubjectEntity = Omit<
    z.infer<typeof SubjectEntitySchema>,
    "id" | "date" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    photos?: PhotoEntity[];
    photosIdsToDelete?: string[];
    date: Date;
    initiator?: InitiatorEntity;
    antropologicalType?: AntropologicalTypeEntity;
    subgroup?: SubgroupEntity;
    gender?: GenderEntity;
    viewType?: ViewTypeEntity;
    createdAt?: Date;
    updatedAt?: Date;
};
