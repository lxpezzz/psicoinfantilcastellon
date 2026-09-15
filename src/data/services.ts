import type { ImageMetadata } from "astro";

import altasCapacidadesImg from "../images/servicios/altas_capacidades.webp";
import rendimientoEscolarImg from "../images/servicios/rendimiento_escolar.webp";
import tdahImg from "../images/servicios/TDAH.webp";
import dislexiaImg from "../images/servicios/dislexia.webp";
import asesoramientoPadresImg from "../images/servicios/asesoramiento_familiar.webp";
import psicologiaJuvenilImg from "../images/servicios/psicologia_juvenil.webp";
import evaluacionImg from "../images/servicios/evaluacion.webp";
import informesImg from "../images/servicios/informes.webp";

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    href: string;
    image: ImageMetadata;
    alt: string;
    isPrincipal: boolean;
    principalVariant?: "media-first" | "content-first";
    bentoClass: string;
}

export const services: ServiceItem[] = [
    {
        id: "rendimiento-escolar",
        title: "Mejora del rendimiento escolar",
        description:
            "Estrategias personalizadas para superar bloqueos de aprendizaje, optimizar el método de estudio y devolverle la seguridad en sus capacidades académicas.",
        href: "/servicios/rendimiento-escolar",
        image: rendimientoEscolarImg,
        alt: "Niña concentrada y motivada estudiando en su mesa",
        isPrincipal: true,
        principalVariant: "media-first",
        bentoClass: "service-card--principal service-card--span-7",
    },
    {
        id: "evaluacion-diagnostico",
        title: "Evaluación y diagnóstico psicopedagógico",
        description:
            "Estudio clínico exhaustivo mediante pruebas baremadas para comprender el perfil cognitivo y emocional con rigor y certeza.",
        href: "/servicios/evaluacion-diagnostico",
        image: evaluacionImg,
        alt: "Materiales y pruebas especializadas de evaluación diagnóstica",
        isPrincipal: false,
        bentoClass: "service-card--span-5",
    },
    {
        id: "tdah",
        title: "Tratamiento y evaluación de TDAH",
        description:
            "Pautas efectivas para regular la atención, la impulsividad y la organización diaria en casa y en el aula.",
        href: "/servicios/tdah",
        image: tdahImg,
        alt: "Niño concentrado realizando tareas con apoyo estructurado",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "dislexia",
        title: "Tratamiento y evaluación de dislexia",
        description:
            "Intervención especializada en lectoescritura para reducir el sobreesfuerzo y transformar la frustración en soltura.",
        href: "/servicios/dislexia",
        image: dislexiaImg,
        alt: "Actividades prácticas de lectoescritura adaptadas",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "altas-capacidades",
        title: "Tratamiento y evaluación de altas capacidades",
        description:
            "Identificación temprana, estimulación adaptada y acompañamiento emocional para que desarrollen su potencial sin desmotivación.",
        href: "/servicios/altas-capacidades",
        image: altasCapacidadesImg,
        alt: "Niño explorando conceptos y desarrollando su creatividad",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "asesoramiento-padres",
        title: "Asesoramiento a padres",
        description:
            "Orientación cercana y pautas claras para resolver dudas de crianza, gestionar conductas complejas y recuperar la calma familiar.",
        href: "/servicios/asesoramiento-padres",
        image: asesoramientoPadresImg,
        alt: "Sesión de orientación y diálogo con padres y madres",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "psicologia-juvenil",
        title: "Psicología juvenil",
        description:
            "Un espacio seguro y confidencial donde adolescentes gestionan cambios emocionales, ansiedad, relaciones e identidad.",
        href: "/servicios/psicologia-juvenil",
        image: psicologiaJuvenilImg,
        alt: "Adolescente en sesión de apoyo y bienestar emocional",
        isPrincipal: false,
        bentoClass: "service-card--span-5",
    },
    {
        id: "informes-psicopedagogicos",
        title: "Informes psicopedagógicos",
        description:
            "Documentos clínicos completos y rigurosos, listos para coordinar adaptaciones curriculares con el centro escolar.",
        href: "/servicios/informes-psicopedagogicos",
        image: informesImg,
        alt: "Informe diagnóstico y plan de acción psicopedagógico",
        isPrincipal: true,
        principalVariant: "content-first",
        bentoClass: "service-card--principal service-card--span-7",
    },
];
