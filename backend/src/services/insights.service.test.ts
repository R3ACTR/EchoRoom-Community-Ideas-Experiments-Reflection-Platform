
import assert from "node:assert/strict";
import { findRelevantPatterns } from "./insights.service";

const run = () => {
    // Test match by title
    const draft1 = {
        title: "Testing Navigation Clarity",
        description: "We want to simplify the menu."
    };
    const suggestions1 = findRelevantPatterns(draft1);
    assert.ok(suggestions1.length > 0, "Should find suggestions for navigation keywords");
    assert.ok(suggestions1[0].label.includes("Navigation Clarity"), "Should find the specific navigation insight");

    // Test no match
    const draft2 = {
        title: "Random topic",
        description: "No overlap here."
    };
    const suggestions2 = findRelevantPatterns(draft2);
    assert.equal(suggestions2.length, 0, "Should find no suggestions for random keywords");

    // Test match by description
    const draft3 = {
        title: "Hero Page Design",
        description: "Avoid Oversized Images for better bounce rate."
    };
    const suggestions3 = findRelevantPatterns(draft3);
    assert.ok(suggestions3.length > 0, "Should find suggestions for image keywords in description");
    assert.ok(suggestions3[0].label.includes("Oversized Images"), "Should find the image pitfall insight");

    console.log("insights.service unit tests passed");
};

run();
