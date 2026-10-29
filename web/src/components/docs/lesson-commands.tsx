import { CodeGroup } from "./code-group";
import { getSourceSample } from "@/lib/course/sources";

interface CommandSource {
  source: string;
  start: number;
  end: number;
}

export interface LessonCommandsProps {
  id: string;
  title: string;
  windows: CommandSource;
  posix: CommandSource;
}

/** Each OS command comes from its own pinned file; Windows is the teaching default. */
export async function LessonCommands({id,title,windows,posix}:LessonCommandsProps) {
  const windowsSample=await getSourceSample(windows.source,{start:windows.start,end:windows.end,label:"Windows · PowerShell",language:"powershell"});
  const posixSample=await getSourceSample(posix.source,{start:posix.start,end:posix.end,label:"macOS · Linux",language:"bash"});
  return <CodeGroup id={id} title={title} samples={[windowsSample,posixSample]} defaultSampleId={windowsSample.id}
    tabsLabel={`${title}：操作系统`} alternativesLabel="查看其他系统命令"/>;
}
