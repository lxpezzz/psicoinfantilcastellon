import type { ImageMetadata } from "astro";

import altasCapacidadesImg from "../images/servicios/altas_capacidades.webp";
import rendimientoEscolarImg from "../images/servicios/rendimiento_escolar.webp";
import tdahImg from "../images/servicios/TDAH.webp";
import dislexiaImg from "../images/servicios/dislexia.webp";
import asesoramientoPadresImg from "../images/servicios/asesoramiento_familiar.webp";
import psicologiaJuvenilImg from "../images/servicios/psicologia_juvenil.webp";
import evaluacionImg from "../images/servicios/evaluacion.webp";
import informesImg from "../images/servicios/informes.webp";
import rendimientoHeroImg from "../images/servicios-pagina/rendimiento-hero.webp";
import evaluacionHeroImg from "../images/servicios-pagina/evaluacion-diagnostica-hero.webp";
import tdahHeroImg from "../images/servicios-pagina/pagina-tdah-hero.webp";
import dislexiaHeroImg from "../images/servicios-pagina/dislexia-hero.webp";
import altasCapacidadesHeroImg from "../images/servicios-pagina/altas-capacidades-hero.webp";
import asesoramientoPadresHeroImg from "../images/servicios-pagina/asesoramiento-padres-hero.webp";
import psicologiaJuvenilHeroImg from "../images/servicios-pagina/psicologia-juvenil-hero.webp";
import informesHeroImg from "../images/servicios-pagina/informes-psicopedagogicos-hero.webp";

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    href: string;
    image: ImageMetadata;
    heroImage: ImageMetadata;
    alt: string;
    isPrincipal: boolean;
    principalVariant?: "media-first" | "content-first";
    bentoClass: string;
    imagePosition?: string;
}

export const services: ServiceItem[] = [
    {
        id: "rendimiento-escolar",
        title: "Mejora del rendimiento escolar",
        description:
            "Cuando el esfuerzo no se refleja en los resultados, trabajamos organización, método de estudio y estrategias para ganar autonomía y seguridad.",
        href: "/mejora-del-rendimiento-escolar/",
        image: rendimientoEscolarImg,
        heroImage: rendimientoHeroImg,
        alt: "Niño concentrado y motivado estudiando en su mesa",
        isPrincipal: true,
        principalVariant: "media-first",
        bentoClass: "service-card--principal service-card--span-7",
    },
    {
        id: "evaluacion-diagnostico",
        title: "Evaluación y diagnóstico psicopedagógico",
        description:
            "Una evaluación completa para comprender cómo aprende, detectar sus necesidades y saber qué pasos dar a partir de ahí.",
        href: "/evaluacion-y-diagnostico/",
        image: evaluacionImg,
        heroImage: evaluacionHeroImg,
        alt: "Materiales y pruebas especializadas de evaluación diagnóstica",
        isPrincipal: false,
        bentoClass: "service-card--span-5",
    },
    {
        id: "tdah",
        title: "Evaluación y acompañamiento en TDAH",
        description:
            "Valoramos las dificultades de atención, impulsividad y organización para definir estrategias concretas para su día a día.",
        href: "/tratamiento-tdah/",
        image: tdahImg,
        heroImage: tdahHeroImg,
        alt: "Niño con problemas de concentración",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "dislexia",
        title: "Evaluación y acompañamiento en dislexia",
        description:
            "Identificamos qué está dificultando la lectura y la escritura y trabajamos estrategias adaptadas a su forma de aprender.",
        href: "/tratamiento-dislexia/",
        image: dislexiaImg,
        heroImage: dislexiaHeroImg,
        alt: "Niña confundida en la escritura",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "altas-capacidades",
        title: "Evaluación y acompañamiento en altas capacidades",
        description:
            "Identificamos sus capacidades y necesidades para favorecer un aprendizaje que le estimule y responda a su forma de pensar.",
        href: "/tratamiento-altas-capacidades/",
        image: altasCapacidadesImg,
        heroImage: altasCapacidadesHeroImg,
        alt: "Niño leyendo un libro",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
        imagePosition: "50% 75%",
    },
    {
        id: "asesoramiento-padres",
        title: "Asesoramiento a padres",
        description:
            "Un espacio para entender mejor lo que está ocurriendo, resolver dudas y encontrar pautas concretas para el día a día en familia.",
        href: "/asesoramiento-a-padres/",
        image: asesoramientoPadresImg,
        heroImage: asesoramientoPadresHeroImg,
        alt: "Sesión de orientación y diálogo con padres y madres",
        isPrincipal: false,
        bentoClass: "service-card--span-3",
    },
    {
        id: "psicologia-juvenil",
        title: "Psicología juvenil",
        description:
            "Acompañamiento a adolescentes ante dificultades emocionales, familiares, sociales o académicas en una etapa llena de cambios.  ",
        href: "/orientacion-adolescentes/",
        image: psicologiaJuvenilImg,
        heroImage: psicologiaJuvenilHeroImg,
        alt: "Adolescente en sesión de apoyo y bienestar emocional",
        isPrincipal: false,
        bentoClass: "service-card--span-5",
    },
    {
        id: "informes-psicopedagogicos",
        title: "Informes psicopedagógicos",
        description:
            "Informes claros y rigurosos que recogen la evaluación realizada y facilitan la coordinación con la familia y el centro educativo.",
        href: "/informes-psicopedagogicos/",
        image: informesImg,
        heroImage: informesHeroImg,
        alt: "Informe diagnóstico y plan de acción psicopedagógico",
        isPrincipal: true,
        principalVariant: "content-first",
        bentoClass: "service-card--principal service-card--span-7",
    },
];
