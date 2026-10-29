import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { LessonCode, type LessonCodeProps } from "../../components/docs/lesson-code";
import { LessonCards } from "../../components/docs/lesson-cards";
import { LessonCommands, type LessonCommandsProps } from "../../components/docs/lesson-commands";

/** Resolve our controlled source slots once, for both SSR and whole-page copying. */
export async function materializeLesson(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(Children.toArray(node).map(materializeLesson));
  if (!isValidElement(node)) return node;
  if (node.type === LessonCode) return cloneElement(await LessonCode(node.props as LessonCodeProps), {key:node.key});
  if (node.type === LessonCommands) return cloneElement(await LessonCommands(node.props as LessonCommandsProps), {key:node.key});
  if (node.type === LessonCards) return cloneElement(LessonCards(node.props as Parameters<typeof LessonCards>[0]), {key:node.key});
  const props = node.props as { children?: ReactNode };
  if (props.children === undefined) return node;
  return cloneElement(node, {}, await materializeLesson(props.children));
}
