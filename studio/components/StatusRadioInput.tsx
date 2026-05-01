import { useEffect, useState } from "react";
import { set, useSource } from "sanity";
import type { ObjectInputProps } from "sanity";
import { Stack, Flex, Radio, Text } from "@sanity/ui";

interface Status {
  _id: string;
  name: string;
}

export function StatusRadioInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const client = useSource().getClient({ apiVersion: "2026-01-01" });
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    client
      .fetch<Status[]>(`*[_type == "propertyStatus"] | order(order asc) { _id, "name": name.en }`)
      .then(setStatuses);
  }, []);

  const selectedId = (value as { _ref?: string } | undefined)?._ref;

  function select(id: string) {
    onChange(set({ _type: "reference", _ref: id }));
  }

  if (statuses.length === 0) return <Text size={1} muted>Loading…</Text>;

  return (
    <Stack space={2}>
      {statuses.map((status) => (
        <Flex key={status._id} align="center" gap={3} style={{ cursor: "pointer" }} onClick={() => select(status._id)}>
          <Radio
            checked={selectedId === status._id}
            onChange={() => select(status._id)}
            name="propertyStatus"
          />
          <Text size={1}>{status.name}</Text>
        </Flex>
      ))}
    </Stack>
  );
}
