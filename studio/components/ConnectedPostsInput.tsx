import { useEffect, useState } from "react";
import { useFormValue, useSource } from "sanity";
import { Stack, Text, Card, Box } from "@sanity/ui";

interface Post {
  _id: string;
  title: string;
}

export function ConnectedPostsInput() {
  const _id = useFormValue(["_id"]) as string | undefined;
  const client = useSource().getClient({ apiVersion: "2026-01-01" });
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!_id) return;
    const id = _id.replace(/^drafts\./, "");
    client
      .fetch<Post[]>(
        `*[_type == "blogPost" && !(_id in path("drafts.**")) && references($id)] | order(publishedAt desc) { _id, "title": title.en }`,
        { id }
      )
      .then(setPosts);
  }, [_id, client]);

  const count = posts?.length ?? 0;

  return (
    <Stack space={3}>
      <Card
        padding={3}
        tone={posts === null ? "default" : count < 3 ? "caution" : "positive"}
        border
        radius={2}
      >
        <Text size={1}>
          {posts === null
            ? "Loading…"
            : count < 3
            ? `⚠️ ${count} post${count !== 1 ? "s" : ""} — ideally at least 3 posts per tag`
            : `✓ ${count} post${count !== 1 ? "s" : ""} connected`}
        </Text>
      </Card>

      {posts && posts.length > 0 && (
        <Box paddingLeft={1}>
          <Stack space={2}>
            {posts.map((post) => (
              <Text key={post._id} size={1} muted>
                — {post.title}
              </Text>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
