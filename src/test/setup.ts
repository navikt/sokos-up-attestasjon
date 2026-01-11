import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

afterEach(() => {
	// Cleanup is handled automatically by @vitest/browser
});

// Browser environment already has window object
if (typeof window !== "undefined") {
	window.umami = {
		track: () => {},
	};
}
