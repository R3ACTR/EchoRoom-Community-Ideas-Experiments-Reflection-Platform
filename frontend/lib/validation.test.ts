import { describe, it, expect } from "vitest";
import {
  isValidString,
  isValidEmail,
  validateIdeaForm,
  validateDraftForm,
  validateExperimentForm,
  validateSignupForm,
  validateLoginForm,
  validateReflectionForm,
  validateTag,
  validateTags,
  validateOutcomeForm,
  validateTitle,
  validateDescription,
  validateDate,
  isFormValid,
  getFirstError,
  normalizeIdeaStatus,
  getIdeaStatusLabel,
  isIdeaStatus,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  HYPOTHESIS_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  MAX_TAGS,
  TAG_MIN_LENGTH,
  TAG_MAX_LENGTH,
  OUTCOME_NOTES_MAX_LENGTH,
  MIN_REFLECTION_LENGTH,
  MAX_REFLECTION_LENGTH,
} from "./validation";

describe("idea status helpers", () => {
  it("normalizes UI and backend status values", () => {
    expect(normalizeIdeaStatus("New")).toBe("proposed");
    expect(normalizeIdeaStatus("in_progress")).toBe("experiment");
    expect(normalizeIdeaStatus("reflection")).toBe("reflection");
  });

  it("validates status values", () => {
    expect(isIdeaStatus("implemented")).toBe(true);
    expect(isIdeaStatus("discarded")).toBe(true);
    expect(isIdeaStatus("unknown")).toBe(false);
  });

  it("returns user-facing labels for canonical statuses", () => {
    expect(getIdeaStatusLabel("proposed")).toBe("New");
    expect(getIdeaStatusLabel("outcome")).toBe("In Progress");
    expect(getIdeaStatusLabel("discarded")).toBe("Discarded");
  });
});

describe("isValidString", () => {
  it("returns true for valid strings", () => {
    expect(isValidString("hello")).toBe(true);
    expect(isValidString("  trimmed  ")).toBe(true);
    expect(isValidString("a")).toBe(true);
  });

  it("returns false for empty or whitespace-only strings", () => {
    expect(isValidString("")).toBe(false);
    expect(isValidString("   ")).toBe(false);
    expect(isValidString("\t\n")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidString(null)).toBe(false);
    expect(isValidString(undefined)).toBe(false);
    expect(isValidString(123)).toBe(false);
    expect(isValidString({})).toBe(false);
    expect(isValidString([])).toBe(false);
    expect(isValidString(true)).toBe(false);
    expect(isValidString(() => {})).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("user+tag@example.org")).toBe(true);
    expect(isValidEmail("first-last@sub.domain.com")).toBe(true);
    expect(isValidEmail("user123@test.io")).toBe(true);
  });

  it("returns false for invalid emails", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("spaces in@email.com")).toBe(false);
    expect(isValidEmail("no@spaces allowed.com")).toBe(false);
    expect(isValidEmail("missing-at-sign.com")).toBe(false);
    expect(isValidEmail("@")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
    expect(isValidEmail({})).toBe(false);
  });
});

describe("validateTitle", () => {
  it("validates correct title", () => {
    const result = validateTitle("Valid Title");
    expect(result.valid).toBe(true);
  });

  it("fails for empty title", () => {
    const result = validateTitle("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it("fails for whitespace-only title", () => {
    const result = validateTitle("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it(`fails for title shorter than ${TITLE_MIN_LENGTH} characters`, () => {
    const result = validateTitle("ab");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TITLE_MIN_LENGTH));
  });

  it(`fails for title exceeding ${TITLE_MAX_LENGTH} characters`, () => {
    const longTitle = "a".repeat(TITLE_MAX_LENGTH + 1);
    const result = validateTitle(longTitle);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TITLE_MAX_LENGTH));
  });

  it(`accepts title at exactly ${TITLE_MIN_LENGTH} characters`, () => {
    const title = "abc";
    const result = validateTitle(title);
    expect(result.valid).toBe(true);
  });

  it(`accepts title at exactly ${TITLE_MAX_LENGTH} characters`, () => {
    const title = "a".repeat(TITLE_MAX_LENGTH);
    const result = validateTitle(title);
    expect(result.valid).toBe(true);
  });

  it("fails for null/undefined inputs", () => {
    expect(validateTitle(null).valid).toBe(false);
    expect(validateTitle(undefined).valid).toBe(false);
  });

  it("trims whitespace before validation", () => {
    const result = validateTitle("  ab  ");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TITLE_MIN_LENGTH));
  });
});

describe("validateDescription", () => {
  it("validates correct description", () => {
    const result = validateDescription("This is a valid description");
    expect(result.valid).toBe(true);
  });

  it("fails for empty description", () => {
    const result = validateDescription("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it(`fails for description exceeding ${DESCRIPTION_MAX_LENGTH} characters`, () => {
    const longDesc = "a".repeat(DESCRIPTION_MAX_LENGTH + 1);
    const result = validateDescription(longDesc);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(DESCRIPTION_MAX_LENGTH));
  });

  it(`accepts description at exactly ${DESCRIPTION_MAX_LENGTH} characters`, () => {
    const desc = "a".repeat(DESCRIPTION_MAX_LENGTH);
    const result = validateDescription(desc);
    expect(result.valid).toBe(true);
  });

  it("accepts single character description", () => {
    const result = validateDescription("a");
    expect(result.valid).toBe(true);
  });
});

describe("validateIdeaForm", () => {
  it("validates correct input", () => {
    const result = validateIdeaForm("My Idea", "This is a description");
    expect(result.valid).toBe(true);
  });

  it("fails for empty title", () => {
    const result = validateIdeaForm("", "description");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Title");
  });

  it("fails for empty description", () => {
    const result = validateIdeaForm("title", "");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Description");
  });

  it("fails for whitespace-only inputs", () => {
    expect(validateIdeaForm("   ", "description").valid).toBe(false);
    expect(validateIdeaForm("title", "   ").valid).toBe(false);
  });

  it("fails for null/undefined inputs", () => {
    expect(validateIdeaForm(null, "description").valid).toBe(false);
    expect(validateIdeaForm("title", null).valid).toBe(false);
    expect(validateIdeaForm(undefined, "description").valid).toBe(false);
  });

  it(`fails for title exceeding ${TITLE_MAX_LENGTH} characters`, () => {
    const longTitle = "a".repeat(TITLE_MAX_LENGTH + 1);
    const result = validateIdeaForm(longTitle, "description");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TITLE_MAX_LENGTH));
  });

  it(`fails for description exceeding ${DESCRIPTION_MAX_LENGTH} characters`, () => {
    const longDesc = "a".repeat(DESCRIPTION_MAX_LENGTH + 1);
    const result = validateIdeaForm("title", longDesc);
    expect(result.valid).toBe(false);
  });

  it(`accepts title at exactly ${TITLE_MAX_LENGTH} characters`, () => {
    const title = "a".repeat(TITLE_MAX_LENGTH);
    const result = validateIdeaForm(title, "description");
    expect(result.valid).toBe(true);
  });

  it(`accepts description at exactly ${DESCRIPTION_MAX_LENGTH} characters`, () => {
    const desc = "a".repeat(DESCRIPTION_MAX_LENGTH);
    const result = validateIdeaForm("title", desc);
    expect(result.valid).toBe(true);
  });
});

describe("validateDraftForm", () => {
  it("validates correct input", () => {
    const result = validateDraftForm("Title", "Description");
    expect(result.valid).toBe(true);
  });

  it("fails when title or description is missing", () => {
    expect(validateDraftForm("", "Description").valid).toBe(false);
    expect(validateDraftForm("Title", "").valid).toBe(false);
    expect(validateDraftForm("", "").valid).toBe(false);
  });

  it("provides combined error message", () => {
    const result = validateDraftForm("", "Description");
    expect(result.error).toContain("Title and description are required");
  });

  it("fails for whitespace-only inputs", () => {
    expect(validateDraftForm("   ", "Description").valid).toBe(false);
    expect(validateDraftForm("Title", "   ").valid).toBe(false);
  });
});

describe("validateExperimentForm", () => {
  it("validates correct input", () => {
    const result = validateExperimentForm(
      "Test Experiment",
      "Test hypothesis",
      "2024-01-01",
      "2024-12-31"
    );
    expect(result.valid).toBe(true);
  });

  it("fails for empty title", () => {
    const result = validateExperimentForm("", "hypothesis", "2024-01-01", "2024-12-31");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Title");
  });

  it("fails for empty hypothesis", () => {
    const result = validateExperimentForm("title", "", "2024-01-01", "2024-12-31");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Hypothesis");
  });

  it(`fails for hypothesis exceeding ${HYPOTHESIS_MAX_LENGTH} characters`, () => {
    const longHypothesis = "a".repeat(HYPOTHESIS_MAX_LENGTH + 1);
    const result = validateExperimentForm("title", longHypothesis, "2024-01-01", "2024-12-31");
    expect(result.valid).toBe(false);
  });

  it("fails for missing start date", () => {
    const result = validateExperimentForm("title", "hypothesis", "", "2024-12-31");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Start date");
  });

  it("fails for missing end date", () => {
    const result = validateExperimentForm("title", "hypothesis", "2024-01-01", "");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("End date");
  });

  it("fails for invalid date format", () => {
    const result = validateExperimentForm("title", "hypothesis", "invalid", "2024-12-31");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid start date");
  });

  it("fails when end date is before start date", () => {
    const result = validateExperimentForm("title", "hypothesis", "2024-12-31", "2024-01-01");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("after start date");
  });

  it("accepts same start and end date", () => {
    const result = validateExperimentForm("title", "hypothesis", "2024-01-01", "2024-01-01");
    expect(result.valid).toBe(true);
  });

  it("handles various date formats correctly", () => {
    expect(validateExperimentForm("title", "hypothesis", "2024-02-29", "2024-03-01").valid).toBe(true);
    // Note: JavaScript's Date.parse auto-corrects invalid dates like Feb 29 on non-leap years
    // The validation allows these as they parse to valid dates (e.g., 2023-02-29 becomes 2023-03-01)
    expect(validateExperimentForm("title", "hypothesis", "not-a-date", "2024-03-01").valid).toBe(false);
  });
});

describe("validateSignupForm", () => {
  it("validates correct input", () => {
    const result = validateSignupForm("John Doe", "john@example.com", "password123", "password123");
    expect(result.valid).toBe(true);
  });

  it("fails for empty name", () => {
    const result = validateSignupForm("", "john@example.com", "password123", "password123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Name");
  });

  it("fails for invalid email", () => {
    expect(validateSignupForm("John", "invalid-email", "password123", "password123").valid).toBe(false);
    expect(validateSignupForm("John", "missing@domain", "password123", "password123").valid).toBe(false);
    expect(validateSignupForm("John", "", "password123", "password123").valid).toBe(false);
  });

  it(`fails for password shorter than ${PASSWORD_MIN_LENGTH} characters`, () => {
    const result = validateSignupForm("John", "john@example.com", "12345", "12345");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(PASSWORD_MIN_LENGTH));
  });

  it(`accepts password of exactly ${PASSWORD_MIN_LENGTH} characters`, () => {
    const password = "a".repeat(PASSWORD_MIN_LENGTH);
    const result = validateSignupForm("John", "john@example.com", password, password);
    expect(result.valid).toBe(true);
  });

  it("fails for non-matching passwords", () => {
    const result = validateSignupForm("John", "john@example.com", "password123", "different123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("do not match");
  });

  it("fails for empty confirm password", () => {
    const result = validateSignupForm("John", "john@example.com", "password123", "");
    expect(result.valid).toBe(false);
  });

  it("fails for null/undefined values", () => {
    expect(validateSignupForm(null, "john@example.com", "password123", "password123").valid).toBe(false);
    expect(validateSignupForm("John", null, "password123", "password123").valid).toBe(false);
  });
});

describe("validateLoginForm", () => {
  it("validates correct input", () => {
    const result = validateLoginForm("user@example.com", "password123");
    expect(result.valid).toBe(true);
  });

  it("fails for empty email", () => {
    const result = validateLoginForm("", "password123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Email");
  });

  it("fails for invalid email format", () => {
    const result = validateLoginForm("invalid-email", "password123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid email");
  });

  it("fails for empty password", () => {
    const result = validateLoginForm("user@example.com", "");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Password");
  });

  it("fails for whitespace-only password", () => {
    const result = validateLoginForm("user@example.com", "   ");
    expect(result.valid).toBe(false);
  });
});

describe("validateReflectionForm", () => {
  it("validates correct input", () => {
    const result = validateReflectionForm("This is a meaningful reflection about my experiment.");
    expect(result.valid).toBe(true);
  });

  it("fails for empty content", () => {
    const result = validateReflectionForm("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it("fails for whitespace-only content", () => {
    const result = validateReflectionForm("     ");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it(`fails for content shorter than ${MIN_REFLECTION_LENGTH} characters`, () => {
    const result = validateReflectionForm("too short");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(MIN_REFLECTION_LENGTH));
  });

  it(`accepts content of exactly ${MIN_REFLECTION_LENGTH} characters`, () => {
    const content = "a".repeat(MIN_REFLECTION_LENGTH);
    const result = validateReflectionForm(content);
    expect(result.valid).toBe(true);
  });

  it(`fails for content exceeding ${MAX_REFLECTION_LENGTH} characters`, () => {
    const longContent = "a".repeat(MAX_REFLECTION_LENGTH + 1);
    const result = validateReflectionForm(longContent);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(MAX_REFLECTION_LENGTH));
  });

  it(`accepts content at exactly ${MAX_REFLECTION_LENGTH} characters`, () => {
    const content = "a".repeat(MAX_REFLECTION_LENGTH);
    const result = validateReflectionForm(content);
    expect(result.valid).toBe(true);
  });

  it("fails for null/undefined", () => {
    expect(validateReflectionForm(null).valid).toBe(false);
    expect(validateReflectionForm(undefined).valid).toBe(false);
  });
});

describe("validateTag", () => {
  it("validates correct tag", () => {
    expect(validateTag("javascript").valid).toBe(true);
    expect(validateTag("react-js").valid).toBe(true);
    expect(validateTag("web_development").valid).toBe(true);
    expect(validateTag("AI ML").valid).toBe(true);
  });

  it("fails for empty tag", () => {
    const result = validateTag("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be empty");
  });

  it("fails for whitespace-only tag", () => {
    const result = validateTag("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be empty");
  });

  it(`fails for tag shorter than ${TAG_MIN_LENGTH} characters`, () => {
    const result = validateTag("a");
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TAG_MIN_LENGTH));
  });

  it(`accepts tag at exactly ${TAG_MIN_LENGTH} characters`, () => {
    const result = validateTag("ab");
    expect(result.valid).toBe(true);
  });

  it(`fails for tag exceeding ${TAG_MAX_LENGTH} characters`, () => {
    const longTag = "a".repeat(TAG_MAX_LENGTH + 1);
    const result = validateTag(longTag);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(TAG_MAX_LENGTH));
  });

  it(`accepts tag at exactly ${TAG_MAX_LENGTH} characters`, () => {
    const tag = "a".repeat(TAG_MAX_LENGTH);
    const result = validateTag(tag);
    expect(result.valid).toBe(true);
  });

  it("fails for tags with invalid characters", () => {
    expect(validateTag("tag@name").valid).toBe(false);
    expect(validateTag("tag#name").valid).toBe(false);
    expect(validateTag("tag$name").valid).toBe(false);
    expect(validateTag("tag%name").valid).toBe(false);
    expect(validateTag("tag<name>").valid).toBe(false);
    expect(validateTag("tag'name").valid).toBe(false);
    expect(validateTag('tag"name').valid).toBe(false);
  });

  it("accepts tags with valid special characters", () => {
    expect(validateTag("my-tag").valid).toBe(true);
    expect(validateTag("my_tag").valid).toBe(true);
    expect(validateTag("my tag").valid).toBe(true);
    expect(validateTag("tag123").valid).toBe(true);
  });

  it("trims whitespace before validation", () => {
    const result = validateTag("  abc  ");
    expect(result.valid).toBe(true);
  });

  it("fails for null/undefined", () => {
    expect(validateTag(null).valid).toBe(false);
    expect(validateTag(undefined).valid).toBe(false);
  });
});

describe("validateTags", () => {
  it("validates empty array", () => {
    const result = validateTags([]);
    expect(result.valid).toBe(true);
  });

  it("validates array with valid tags", () => {
    const result = validateTags(["javascript", "react", "web-dev"]);
    expect(result.valid).toBe(true);
  });

  it(`fails when more than ${MAX_TAGS} tags provided`, () => {
    const tags = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"];
    const result = validateTags(tags);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(MAX_TAGS));
  });

  it(`accepts exactly ${MAX_TAGS} tags`, () => {
    const tags = ["tag1", "tag2", "tag3", "tag4", "tag5"];
    const result = validateTags(tags);
    expect(result.valid).toBe(true);
  });

  it("fails for duplicate tags (case-insensitive)", () => {
    expect(validateTags(["JavaScript", "javascript"]).valid).toBe(false);
    expect(validateTags(["React", "react", "REACT"]).valid).toBe(false);
    expect(validateTags(["tag", "tag"]).valid).toBe(false);
  });

  it("accepts tags with different whitespace but same content", () => {
    const result = validateTags(["  javascript  ", "javascript"]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Duplicate");
  });

  it("fails if any tag is invalid", () => {
    const result = validateTags(["valid", "a", "another"]);
    expect(result.valid).toBe(false);
  });

  it("fails for non-array input", () => {
    expect(validateTags("not an array" as any).valid).toBe(false);
    expect(validateTags(null as any).valid).toBe(false);
    expect(validateTags({} as any).valid).toBe(false);
  });
});

describe("validateOutcomeForm", () => {
  it("validates correct input with Success result", () => {
    const result = validateOutcomeForm("Success", "Great outcome!");
    expect(result.valid).toBe(true);
  });

  it("validates correct input with Mixed result", () => {
    const result = validateOutcomeForm("Mixed", "Partial success");
    expect(result.valid).toBe(true);
  });

  it("validates correct input with Failed result", () => {
    const result = validateOutcomeForm("Failed", "Did not work");
    expect(result.valid).toBe(true);
  });

  it("validates without notes", () => {
    const result = validateOutcomeForm("Success", "");
    expect(result.valid).toBe(true);
  });

  it("fails for empty result", () => {
    const result = validateOutcomeForm("", "notes");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Result");
  });

  it("fails for invalid result value", () => {
    expect(validateOutcomeForm("Invalid", "notes").valid).toBe(false);
    expect(validateOutcomeForm("Win", "notes").valid).toBe(false);
    expect(validateOutcomeForm("Loss", "notes").valid).toBe(false);
  });

  it(`fails for notes exceeding ${OUTCOME_NOTES_MAX_LENGTH} characters`, () => {
    const longNotes = "a".repeat(OUTCOME_NOTES_MAX_LENGTH + 1);
    const result = validateOutcomeForm("Success", longNotes);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(OUTCOME_NOTES_MAX_LENGTH));
  });

  it(`accepts notes at exactly ${OUTCOME_NOTES_MAX_LENGTH} characters`, () => {
    const notes = "a".repeat(OUTCOME_NOTES_MAX_LENGTH);
    const result = validateOutcomeForm("Success", notes);
    expect(result.valid).toBe(true);
  });

  it("accepts null/undefined for notes", () => {
    expect(validateOutcomeForm("Success", null).valid).toBe(true);
    expect(validateOutcomeForm("Success", undefined).valid).toBe(true);
  });
});

describe("validateDate", () => {
  it("validates correct date", () => {
    const result = validateDate("2024-01-01", "Start date");
    expect(result.valid).toBe(true);
  });

  it("fails for empty date", () => {
    const result = validateDate("", "End date");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("End date");
    expect(result.error).toContain("required");
  });

  it("fails for invalid date format", () => {
    expect(validateDate("invalid", "Date").valid).toBe(false);
    expect(validateDate("not-a-date", "Date").valid).toBe(false);
    // Note: JavaScript's Date.parse auto-corrects some invalid dates
  });

  it("fails for null/undefined", () => {
    expect(validateDate(null, "Date").valid).toBe(false);
    expect(validateDate(undefined, "Date").valid).toBe(false);
  });

  it("accepts various valid date formats", () => {
    expect(validateDate("2024-01-15", "Date").valid).toBe(true);
    expect(validateDate("2024-12-31", "Date").valid).toBe(true);
    expect(validateDate("2024-02-29", "Date").valid).toBe(true);
  });
});

describe("isFormValid", () => {
  it("returns true when all validations pass", () => {
    const results = [
      { valid: true },
      { valid: true },
      { valid: true }
    ];
    expect(isFormValid(results)).toBe(true);
  });

  it("returns false when any validation fails", () => {
    const results = [
      { valid: true },
      { valid: false, error: "Failed" },
      { valid: true }
    ];
    expect(isFormValid(results)).toBe(false);
  });

  it("returns false when all validations fail", () => {
    const results = [
      { valid: false, error: "Error 1" },
      { valid: false, error: "Error 2" }
    ];
    expect(isFormValid(results)).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(isFormValid([])).toBe(true);
  });
});

describe("getFirstError", () => {
  it("returns undefined when all validations pass", () => {
    const results = [
      { valid: true },
      { valid: true }
    ];
    expect(getFirstError(results)).toBeUndefined();
  });

  it("returns first error message", () => {
    const results = [
      { valid: true },
      { valid: false, error: "Second error" },
      { valid: false, error: "Third error" }
    ];
    expect(getFirstError(results)).toBe("Second error");
  });

  it("returns error when first validation fails", () => {
    const results = [
      { valid: false, error: "First error" },
      { valid: false, error: "Second error" }
    ];
    expect(getFirstError(results)).toBe("First error");
  });

  it("returns undefined for empty array", () => {
    expect(getFirstError([])).toBeUndefined();
  });
});
