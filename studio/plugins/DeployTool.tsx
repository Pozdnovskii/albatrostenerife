import { useState } from "react";
import { Card, Stack, Heading, Text, Button, Spinner, Box } from "@sanity/ui";
import { RocketIcon } from "@sanity/icons";

type Status = "idle" | "deploying" | "success" | "error";

const HOOK_URL = import.meta.env.PUBLIC_SANITY_STUDIO_DEPLOY_HOOK as string | undefined;

export function DeployTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDeploy() {
    if (!HOOK_URL) {
      setErrorMsg("SANITY_STUDIO_DEPLOY_HOOK env var is not set.");
      setStatus("error");
      return;
    }

    setStatus("deploying");
    setErrorMsg("");

    try {
      const res = await fetch(HOOK_URL, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <Box padding={4}>
      <Card padding={5} radius={3} shadow={1} tone="default" style={{ maxWidth: 480 }}>
        <Stack space={5}>
          <Heading size={2}>Deploy site</Heading>

          <Text muted size={1}>
            Triggers a rebuild and deployment of{" "}
            <strong>albatrostenerife.com</strong> via Cloudflare Workers.
            <br />
            The build usually takes 1–2 minutes.
          </Text>

          {status === "idle" && (
            <Button
              tone="primary"
              icon={RocketIcon}
              text="Deploy now"
              onClick={handleDeploy}
            />
          )}

          {status === "deploying" && (
            <Button tone="primary" icon={Spinner} text="Deploying…" disabled />
          )}

          {status === "success" && (
            <Card tone="positive" padding={3} radius={2}>
              <Text size={1}>Deploy triggered successfully. Check Cloudflare dashboard for progress.</Text>
            </Card>
          )}

          {status === "error" && (
            <Stack space={3}>
              <Card tone="critical" padding={3} radius={2}>
                <Text size={1}>Deploy failed: {errorMsg || "Unknown error"}</Text>
              </Card>
              <Button tone="default" text="Try again" onClick={handleDeploy} />
            </Stack>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
