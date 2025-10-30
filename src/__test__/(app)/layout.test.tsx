import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppLayout from "../../app/(app)/layout";

describe("AppLayout", () => {
  it("should render children correctly", async () => {
    const childText = "Test Child Component";
    render(
      <AppLayout>
        <div>{childText}</div>
      </AppLayout>,
    );

    const childElement = screen.getByText(childText);
    expect(childElement).toBeInTheDocument();
  });
});
