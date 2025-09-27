export interface KotobaResponseData {
  term: string;
  reading: string;
  overall_usage: OverallUsage;
  definitions: Definition[];
  learner_warnings: string[];
}

export interface Definition {
  definition_text: string;
  part_of_speech: string;
  formality_level: string;
  usage_contexts: string[];
  appropriateness_notes: string;
  example_sentences: ExampleSentence[];
}

export interface ExampleSentence {
  japanese: string;
  english: string;
  context_note: string;
}

export interface OverallUsage {
  frequency: string;
  spoken_vs_written: string;
  age_demographics: string[];
}
