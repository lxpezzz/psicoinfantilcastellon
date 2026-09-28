import { getCollection } from "astro:content";

export async function getPublishedPosts() {
    const posts = await getCollection("blog", ({ data }) => data.draft === false);

    return posts.sort(
        (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
    );
}
