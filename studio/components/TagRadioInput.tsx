import { useEffect, useState } from "react";
import { set, useSource } from "sanity";
import type { ObjectInputProps } from "sanity";
import { Stack, Flex, Radio, Text } from "@sanity/ui";

interface TagRaw {
  _id: string;
  name: string;
  postIds: string[];
}

interface Tag {
  _id: string;
  name: string;
  postCount: number;
}

const QUERY = `*[_type == "blogTag" && !(_id in path("drafts.**"))] | order(name.en asc) {
  _id,
  "name": name.en,
  "postIds": *[_type == "blogPost" && references(^._id)]._id
}`;

function countUnique(postIds: string[]): number {
  return new Set(postIds.map((id) => id.replace(/^drafts\./, ""))).size;
}

export function TagRadioInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const client = useSource().getClient({ apiVersion: "2026-01-01" });
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    client.fetch<TagRaw[]>(QUERY).then((raw) =>
      setTags(raw.map((t) => ({ _id: t._id, name: t.name, postCount: countUnique(t.postIds) })))
    );
  }, [client]);

  const selectedId = (value as { _ref?: string } | undefined)?._ref;

  function select(id: string) {
    onChange(set({ _type: "reference", _ref: id }));
    setTags((prev) =>
      prev.map((t) => {
        if (t._id === selectedId) return { ...t, postCount: t.postCount - 1 };
        if (t._id === id) return { ...t, postCount: t.postCount + 1 };
        return t;
      })
    );
  }

  if (tags.length === 0) return <Text size={1} muted>Loading…</Text>;

  return (
    <Stack space={2}>
      {tags.map((tag) => (
        <Flex key={tag._id} align="center" gap={3} style={{ cursor: "pointer" }} onClick={() => select(tag._id)}>
          <Radio
            checked={selectedId === tag._id}
            onChange={() => select(tag._id)}
            name="blogTag"
          />
          <Text size={1}>
            {tag.name}{" "}
            <span style={{ color: tag.postCount < 3 ? "#f59e0b" : undefined, opacity: tag.postCount < 3 ? 1 : 0.5 }}>
              ({tag.postCount})
            </span>
          </Text>
        </Flex>
      ))}
    </Stack>
  );
}
