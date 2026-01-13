import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

// Browser environment already has window object
if (typeof window !== "undefined") {
	window.umami = {
		track: () => {},
	};
}
