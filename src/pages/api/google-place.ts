import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
    const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    const placeId = import.meta.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
        return new Response(
            JSON.stringify({
                error: "Configuración incompleta: GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID no definidos.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    try {
        const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`;
        const response = await fetch(url, {
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error de Google Places API (${response.status}):`, errorText);
            return new Response(
                JSON.stringify({
                    error: "Error al consultar Google Places API",
                    status: response.status,
                }),
                {
                    status: response.status,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const data = await response.json();

        const simplified = {
            name: data.displayName?.text ?? "Psico Infantil Castellón",
            rating: typeof data.rating === "number" ? data.rating : 5.0,
            totalReviews: typeof data.userRatingCount === "number" ? data.userRatingCount : 46,
            googleMapsUrl:
                data.googleMapsUri || "https://maps.google.com/?cid=4225123225601099366",
        };

        return new Response(JSON.stringify(simplified), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("Excepción en endpoint /api/google-place:", error);
        return new Response(
            JSON.stringify({
                error: "Error interno del servidor al procesar la solicitud de reseñas.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
};