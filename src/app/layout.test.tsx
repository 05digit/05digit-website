import RootLayout, { metadata } from "./layout";

// Mock the next/font/google module to prevent actual font fetching and issues during testing
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans-mock",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono-mock",
  }),
}));

describe("RootLayout", () => {
  it("renders children correctly and applies correct HTML structure", () => {
    const children = <div data-testid="child-element">Test Child Content</div>;
    const layout = RootLayout({ children });

    // Verify it renders html tag
    expect(layout.type).toBe("html");

    // Verify html tag props
    expect(layout.props.lang).toBe("en");
    expect(layout.props.className).toContain("--font-geist-sans-mock");
    expect(layout.props.className).toContain("--font-geist-mono-mock");
    expect(layout.props.className).toContain("h-full");
    expect(layout.props.className).toContain("antialiased");

    // Verify body tag
    const body = layout.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toContain("min-h-full");
    expect(body.props.className).toContain("flex");
    expect(body.props.className).toContain("flex-col");

    // Verify children are passed inside body
    expect(body.props.children).toBe(children);
  });

  it("exports the correct metadata", () => {
    expect(metadata.title).toBe("digit | 05digit");
    expect(metadata.description).toBe(
      "Official website for underground artist digit aka 05digit. Stream music, watch official visualizers, and connect."
    );
    expect(metadata.icons).toEqual({
      icon: [
        { url: "/favicon_io/favicon-32x32.png?v=05", sizes: "32x32", type: "image/png" },
        { url: "/favicon_io/favicon-16x16.png?v=05", sizes: "16x16", type: "image/png" },
      ],
      shortcut: "/favicon_io/favicon.ico?v=05",
      apple: "/favicon_io/apple-touch-icon.png?v=05",
    });
    expect(metadata.manifest).toBe("/favicon_io/site.webmanifest?v=05");
  });
});
