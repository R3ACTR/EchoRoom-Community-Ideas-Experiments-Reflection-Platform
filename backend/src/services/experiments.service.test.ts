import assert from "node:assert/strict";
import {
  getProgressForExperimentStatus,
  isExperimentStatus,
} from "./experiments.service";

const run = () => {
  assert.equal(isExperimentStatus("planned"), true);
  assert.equal(isExperimentStatus("in-progress"), true);
  assert.equal(isExperimentStatus("completed"), true);
  assert.equal(isExperimentStatus("Completed"), false);
  assert.equal(isExperimentStatus("active"), false);

  assert.equal(getProgressForExperimentStatus("planned"), 0);
  assert.equal(getProgressForExperimentStatus("in-progress"), 50);
  assert.equal(getProgressForExperimentStatus("completed"), 100);
};

run();
console.log("experiments.service contract tests passed");
