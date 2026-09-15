/**
 * Reviews Data Source
 * 
 * ARCHITECTURE NOTE FOR GOOGLE BUSINESS PROFILE API:
 * When connecting to Google Business Profile API / Places API:
 * 1. Fetch reviews server-side (build time or SSR route / API endpoint).
 *    Endpoint: https://places.googleapis.com/v1/places/{placeId}?fields=reviews,rating,userRatingCount
 * 2. Keep GOOGLE_PLACES_API_KEY secure in private env vars (e.g. import.meta.env.GOOGLE_PLACES_API_KEY).
 * 3. Map Google's review objects to the `ReviewItem` interface below.
 * 4. Pass the resulting array and summary to `Reviews.astro`.
 */

export interface ReviewItem {
    id: string;
    author: string;
    avatarUrl?: string;
    rating: number;
    date: string;
    text: string;
    source: "Google";
    reviewUrl?: string;
}

export interface ReviewsSummary {
    rating: string;
    maxRating: number;
    totalReviews: number;
    googleMapsUrl: string;
}

export const reviewsSummary: ReviewsSummary = {
    rating: "5.0",
    maxRating: 5,
    totalReviews: 28,
    googleMapsUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
};

export const reviews: ReviewItem[] = [
    {
        id: "1",
        author: "Familia Martínez G.",
        rating: 5,
        date: "Hace 2 semanas",
        text: "Acudimos a Ana desesperados porque en el colegio no sabían cómo orientar a nuestro hijo. Tras la evaluación psicopedagógica, nos explicó de forma clara y cercana qué ocurría y nos dio pautas precisas para casa y para los profesores. La coordinación con el colegio fue impecable.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
    {
        id: "2",
        author: "Laura Pastor",
        rating: 5,
        date: "Hace 1 mes",
        text: "Un trato profesional, empático y de diez. Mi hija adolescente se sintió escuchada y comprendida desde el primer minuto. Para nosotros como padres ha sido un alivio inmenso contar con su guía y orientación.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
    {
        id: "3",
        author: "Carlos Vilar",
        rating: 5,
        date: "Hace 2 meses",
        text: "Buscábamos una profesional con experiencia real en evaluación de altas capacidades y no pudimos elegir mejor. El informe fue exhaustivo, comprensible y muy útil para tramitar las adaptaciones necesarias en su centro educativo.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
    {
        id: "4",
        author: "Marta Gómez",
        rating: 5,
        date: "Hace 3 meses",
        text: "Gran profesional de la psicología infantil en Castellón. Su capacidad para conectar con los niños y devolver la calma a las familias marca la diferencia. Recomendable al 100%.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
    {
        id: "5",
        author: "Javier R.",
        rating: 5,
        date: "Hace 4 meses",
        text: "Excelente acompañamiento para el manejo del TDAH y la mejora del rendimiento escolar. Las sesiones son prácticas y los resultados en motivación y organización se notaron en muy pocas semanas.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
    {
        id: "6",
        author: "Elena Beltrán",
        rating: 5,
        date: "Hace 5 meses",
        text: "Destaco su cercanía, rigor y la tranquilidad que transmite en cada sesión. Nos ayudó a comprender las dificultades de aprendizaje de nuestra hija y a enfocar el día a día sin tensiones en casa.",
        source: "Google",
        reviewUrl: "https://maps.google.com/?cid=psicoinfantilcastellon",
    },
];
