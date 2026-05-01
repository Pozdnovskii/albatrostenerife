import { useEffect, useRef, useState } from "react";
import { set, useSource } from "sanity";
import type { ArrayOfObjectsInputProps } from "sanity";
import { Flex, Switch, Text, Box } from "@sanity/ui";

interface Feature {
  _id: string;
  name: string;
}

interface RefItem {
  _key: string;
  _type: string;
  _ref: string;
}

export function FeaturesToggleInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange } = props;
  const client = useSource().getClient({ apiVersion: "2026-01-01" });
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    client
      .fetch<Feature[]>(`*[_type == "feature"] | order(name.en asc) { _id, "name": name.en }`)
      .then((features) => {
        setAllFeatures(features);
        if (!initialized.current && (!value || value.length === 0)) {
          const allRefs: RefItem[] = features.map((f) => ({
            _key: f._id,
            _type: "reference",
            _ref: f._id,
          }));
          onChange(set(allRefs));
        }
        initialized.current = true;
      });
  }, []);

  const selectedIds = new Set((value ?? []).map((v) => (v as RefItem)._ref));

  function toggle(featureId: string) {
    const current = (value ?? []) as RefItem[];
    const next = selectedIds.has(featureId)
      ? current.filter((v) => v._ref !== featureId)
      : [...current, { _key: featureId, _type: "reference", _ref: featureId }];
    onChange(set(next));
  }

  if (allFeatures.length === 0) return <Text size={1} muted>Loading features…</Text>;

  return (
    <Box>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {allFeatures.map((feature) => (
          <Flex key={feature._id} align="center" gap={3}>
            <Switch
              checked={selectedIds.has(feature._id)}
              onChange={() => toggle(feature._id)}
            />
            <Text size={1}>{feature.name}</Text>
          </Flex>
        ))}
      </div>
    </Box>
  );
}
