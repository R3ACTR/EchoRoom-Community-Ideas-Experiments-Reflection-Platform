export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 80;
export const DESCRIPTION_MAX_LENGTH = 500;
export const HYPOTHESIS_MAX_LENGTH = 300;
export const PASSWORD_MIN_LENGTH = 6;
export const BACKEND_PASSWORD_MIN_LENGTH = 8;
export const MAX_TAGS = 5;
export const TAG_MIN_LENGTH = 2;
export const TAG_MAX_LENGTH = 30;
export const OUTCOME_NOTES_MAX_LENGTH = 1000;
export const MIN_REFLECTION_LENGTH = 10;
export const MAX_REFLECTION_LENGTH = 2000;
export const IDEA_STATUSES = [
  "draft",
  "proposed",
  "experiment",
  "outcome",
  "reflection",
  "discarded",
] as const;
export const IDEA_STATUS_FILTERS = [
  "All",
  "New",
  "In Progress",
  "Implemented",
  "Discarded",
] as const;

export type IdeaStatus = (typeof IDEA_STATUSES)[number];
export type IdeaStatusFilter = (typeof IDEA_STATUS_FILTERS)[number];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const IDEA_STATUS_ALIASES: Record<string, IdeaStatus> = {
  draft: "draft",
  proposed: "proposed",
  experiment: "experiment",
  outcome: "outcome",
  reflection: "reflection",
  discarded: "discarded",
  new: "proposed",
  "in progress": "experiment",
  "in-progress": "experiment",
  in_progress: "experiment",
  implemented: "reflection",
};

const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  draft: "Draft",
  proposed: "New",
  experiment: "In Progress",
  outcome: "In Progress",
  reflection: "Implemented",
  discarded: "Discarded",
};

export function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeIdeaStatus(value: unknown): IdeaStatus | null {
  if (typeof value !== "string") {
    return null;
  }

  return IDEA_STATUS_ALIASES[value.trim().toLowerCase()] ?? null;
}

export function isIdeaStatus(value: unknown): value is IdeaStatus {
  return normalizeIdeaStatus(value) !== null;
}

export function getIdeaStatusLabel(value: unknown): string {
  const normalized = normalizeIdeaStatus(value);
  if (!normalized) {
    return "Unknown";
  }

  return IDEA_STATUS_LABELS[normalized];
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateIdeaForm(title: unknown, description: unknown): ValidationResult {
  if (!isValidString(title)) {
    return { valid: false, error: "Title is required" };
  }

  if (!isValidString(description)) {
    return { valid: false, error: "Description is required" };
  }

  const titleStr = String(title).trim();
  const descStr = String(description).trim();

  if (titleStr.length > TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title must be ${TITLE_MAX_LENGTH} characters or less` };
  }

  if (descStr.length > DESCRIPTION_MAX_LENGTH) {
    return { valid: false, error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less` };
  }

  return { valid: true };
}

export function validateDraftForm(title: unknown, description: unknown): ValidationResult {
  if (!isValidString(title) || !isValidString(description)) {
    return { valid: false, error: "Title and description are required" };
  }
  return { valid: true };
}

export function validateExperimentForm(
  title: unknown,
  hypothesis: unknown,
  startDate: unknown,
  endDate: unknown
): ValidationResult {
  if (!isValidString(title)) {
    return { valid: false, error: "Title is required" };
  }

  if (!isValidString(hypothesis)) {
    return { valid: false, error: "Hypothesis is required" };
  }

  const hypothesisStr = String(hypothesis).trim();
  if (hypothesisStr.length > HYPOTHESIS_MAX_LENGTH) {
    return { valid: false, error: `Hypothesis must be ${HYPOTHESIS_MAX_LENGTH} characters or less` };
  }

  if (!isValidString(startDate)) {
    return { valid: false, error: "Start date is required" };
  }

  if (!isValidString(endDate)) {
    return { valid: false, error: "End date is required" };
  }

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  if (Number.isNaN(start.getTime())) {
    return { valid: false, error: "Invalid start date format" };
  }

  if (Number.isNaN(end.getTime())) {
    return { valid: false, error: "Invalid end date format" };
  }

  if (end < start) {
    return { valid: false, error: "End date must be after start date" };
  }

  return { valid: true };
}

export function validateSignupForm(
  name: unknown,
  email: unknown,
  password: unknown,
  confirmPassword: unknown
): ValidationResult {
  if (!isValidString(name)) {
    return { valid: false, error: "Name is required." };
  }

  if (!isValidString(email)) {
    return { valid: false, error: "Email is required." };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  if (!isValidString(password)) {
    return { valid: false, error: "Password is required." };
  }

  const passwordStr = String(password);

  if (passwordStr.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }

  if (!isValidString(confirmPassword)) {
    return { valid: false, error: "Please confirm your password." };
  }

  if (passwordStr !== String(confirmPassword)) {
    return { valid: false, error: "Passwords do not match." };
  }

  return { valid: true };
}

export function validateLoginForm(email: unknown, password: unknown): ValidationResult {
  if (!isValidString(email)) {
    return { valid: false, error: "Email is required." };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  if (!isValidString(password)) {
    return { valid: false, error: "Password is required." };
  }

  return { valid: true };
}

export function validateReflectionForm(content: unknown): ValidationResult {
  if (!isValidString(content)) {
    return { valid: false, error: "Reflection content is required" };
  }

  const contentStr = String(content).trim();

  if (contentStr.length < MIN_REFLECTION_LENGTH) {
    return { valid: false, error: `Reflection must be at least ${MIN_REFLECTION_LENGTH} characters` };
  }

  if (contentStr.length > MAX_REFLECTION_LENGTH) {
    return { valid: false, error: `Reflection must be ${MAX_REFLECTION_LENGTH} characters or less` };
  }

  return { valid: true };
}

export function validateTag(tag: unknown): ValidationResult {
  if (!isValidString(tag)) {
    return { valid: false, error: "Tag cannot be empty" };
  }

  const tagStr = String(tag).trim();

  if (tagStr.length < TAG_MIN_LENGTH) {
    return { valid: false, error: `Tag must be at least ${TAG_MIN_LENGTH} characters` };
  }

  if (tagStr.length > TAG_MAX_LENGTH) {
    return { valid: false, error: `Tag must be ${TAG_MAX_LENGTH} characters or less` };
  }

  const invalidCharsRegex = /[^a-zA-Z0-9\s\-_]/;
  if (invalidCharsRegex.test(tagStr)) {
    return { valid: false, error: "Tag contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed" };
  }

  return { valid: true };
}

export function validateTags(tags: unknown[]): ValidationResult {
  if (!Array.isArray(tags)) {
    return { valid: false, error: "Tags must be an array" };
  }

  if (tags.length > MAX_TAGS) {
    return { valid: false, error: `Cannot have more than ${MAX_TAGS} tags` };
  }

  const normalizedTags = tags.map(tag => String(tag).trim().toLowerCase());
  const uniqueTags = new Set(normalizedTags);

  if (uniqueTags.size !== normalizedTags.length) {
    return { valid: false, error: "Duplicate tags are not allowed" };
  }

  for (const tag of tags) {
    const tagValidation = validateTag(tag);
    if (!tagValidation.valid) {
      return { valid: false, error: tagValidation.error };
    }
  }

  return { valid: true };
}

export function validateOutcomeForm(
  result: unknown,
  notes: unknown
): ValidationResult {
  if (!isValidString(result)) {
    return { valid: false, error: "Result is required" };
  }

  const validResults = ["Success", "Mixed", "Failed"];
  if (!validResults.includes(String(result))) {
    return { valid: false, error: "Result must be Success, Mixed, or Failed" };
  }

  if (isValidString(notes)) {
    const notesStr = String(notes).trim();
    if (notesStr.length > OUTCOME_NOTES_MAX_LENGTH) {
      return { valid: false, error: `Notes must be ${OUTCOME_NOTES_MAX_LENGTH} characters or less` };
    }
  }

  return { valid: true };
}

export function validateTitle(title: unknown): ValidationResult {
  if (!isValidString(title)) {
    return { valid: false, error: "Title is required" };
  }

  const titleStr = String(title).trim();

  if (titleStr.length < TITLE_MIN_LENGTH) {
    return { valid: false, error: `Title must be at least ${TITLE_MIN_LENGTH} characters` };
  }

  if (titleStr.length > TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title must be ${TITLE_MAX_LENGTH} characters or less` };
  }

  return { valid: true };
}

export function validateDescription(description: unknown): ValidationResult {
  if (!isValidString(description)) {
    return { valid: false, error: "Description is required" };
  }

  const descStr = String(description).trim();

  if (descStr.length > DESCRIPTION_MAX_LENGTH) {
    return { valid: false, error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less` };
  }

  return { valid: true };
}

export function validateDate(date: unknown, fieldName: string = "Date"): ValidationResult {
  if (!isValidString(date)) {
    return { valid: false, error: `${fieldName} is required` };
  }

  const parsedDate = new Date(String(date));

  if (Number.isNaN(parsedDate.getTime())) {
    return { valid: false, error: `Invalid ${fieldName.toLowerCase()} format` };
  }

  return { valid: true };
}

export function isFormValid(validationResults: ValidationResult[]): boolean {
  return validationResults.every(result => result.valid);
}

export function getFirstError(validationResults: ValidationResult[]): string | undefined {
  const firstInvalid = validationResults.find(result => !result.valid);
  return firstInvalid?.error;
}
