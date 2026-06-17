import { describe, it, expect } from "vitest";
import { buildGatewayHeaders, buildPrompt, fallbackText, renderPage } from "../src/worker";

describe("prompt", () => {
  it("includes host and date", () => {
    const host = "example.com";
    const today = "2025-12-05";
    const prompt = buildPrompt(host, today);
    expect(prompt).toContain(host);
    expect(prompt).toContain(today);
    expect(prompt).toContain("220-400 words");
  });
});

describe("fallback", () => {
  it("mentions host and date", () => {
    const host = "abstract.md";
    const today = "2025-12-05";
    const text = fallbackText(host, today);
    expect(text).toContain(host);
    expect(text).toContain(today);
  });
});

describe("gateway headers", () => {
  it("sends the provider key as Authorization", () => {
    const headers = buildGatewayHeaders({ XAI_API_KEY: "xai-key" });
    expect(headers).toEqual({
      "content-type": "application/json",
      authorization: "Bearer xai-key",
    });
  });

  it("sends authenticated gateway token separately", () => {
    const headers = buildGatewayHeaders({
      XAI_API_KEY: "xai-key",
      GATEWAY_TOKEN: "cloudflare-token",
    });
    expect(headers.authorization).toBe("Bearer xai-key");
    expect(headers["cf-aig-authorization"]).toBe("Bearer cloudflare-token");
  });
});

describe("renderPage", () => {
  it("renders footer link and generated date", () => {
    const html = renderPage({
      host: "abstract.md",
      text: "# Title\n\nBody",
      generatedAt: "2025-12-05",
    });
    expect(html).toContain("Generated on 2025-12-05");
    expect(html).toContain("a @steipete project");
    expect(html).toContain("https://steipete.me");
  });
});
