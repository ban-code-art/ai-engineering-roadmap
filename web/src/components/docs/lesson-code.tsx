import { CodeGroup } from "./code-group";
import { getSourceSample } from "@/lib/course/sources";

export interface LessonCodeProps {
  id: string;
  source: string;
  start?: number;
  end?: number;
  label?: string;
  language?: string;
  title?: string;
  /** Absolute line numbers in the pinned source file. */
  highlightLines?: number[];
}

/** Small excerpts and full recovery files share the same published source. */
export async function LessonCode({ id, source, title, ...options }: LessonCodeProps) {
  const sample = await getSourceSample(source, options);
  return <CodeGroup id={id} samples={[sample]} title={title ?? sample.label} />;
}
