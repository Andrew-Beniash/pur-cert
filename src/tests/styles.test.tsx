import { render, screen } from "@testing-library/react";

describe("Tailwind CSS Integration", () => {
  it("applies Tailwind classes correctly", () => {
    render(
      <div data-testid="test-element" className="bg-primary text-white p-4">
        Test
      </div>
    );
    const element = screen.getByTestId("test-element");
    expect(element).toHaveClass("bg-primary", "text-white", "p-4");
  });
});
