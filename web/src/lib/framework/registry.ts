import { PREVIEW_PATH, type DocTarget, type SearchEntry } from "./types";
import { siteSearchEntries } from "../../content/site";

/** Only published routes belong in the normal documentation search. */
const productionEntries: readonly SearchEntry[] = siteSearchEntries;

/** Preview-only anchors are registered explicitly, including expandable tool targets. */
export const previewTargets: DocTarget[] = [
  { id: "introduction", title: "从连续阅读开始", level: 2 },
  { id: "typography", title: "文字与信息层级", level: 2 },
  { id: "code", title: "代码与完整版本", level: 2 },
  { id: "commands", title: "命令与操作步骤", level: 2 },
  { id: "callouts", title: "提示与展开", level: 2 },
  { id: "files", title: "看清文件位置", level: 2 },
  { id: "files--file--sample-py", title: "sample.py 样例", level: 3 },
  { id: "flow", title: "把关系放回流程里", level: 2 },
  { id: "flow--node--handler", title: "处理函数节点", level: 3 },
  { id: "verification", title: "验证与资料来源", level: 2 },
];

const previewSummaries: Record<string, string> = {
  introduction: "内部文档框架预览，导航、组件与交互的展示范围。",
  typography: "标题、正文、段落、列表、表格与阅读宽度。",
  code: "sample.py 组件源码、语法高亮、代码复制与局部版本隔离。",
  commands: "终端命令、运行结果、预期响应与复制操作。",
  callouts: "说明、注意、错误、验证状态与下一步提示。",
  files: "项目文件树、文件说明与目录层级。",
  "files--file--sample-py": "展开sample.py，查看框架测试素材的位置、来源和版本。",
  flow: "请求、连接、路径匹配、函数处理与 JSON 响应。",
  "flow--node--handler": "选择组件流程中的处理函数节点，查看局部解释。",
  verification: "键盘导航、移动端阅读、链接定位与组件验收。",
};

const previewEntries: readonly SearchEntry[] = previewTargets.map((target) => ({
  id: `preview-${target.id}`,
  title: target.title,
  section: "文档框架预览",
  summary: previewSummaries[target.id],
  href: `${PREVIEW_PATH}#${encodeURIComponent(target.id)}`,
  preview: true,
}));

const allowedHrefs = new Set([...productionEntries, ...previewEntries].map((entry) => entry.href));

export function isSearchHrefAllowed(href: string): boolean {
  return allowedHrefs.has(href);
}

export function getSearchEntries(includePreview: boolean): SearchEntry[] {
  const entries = includePreview ? [...productionEntries, ...previewEntries] : productionEntries;
  // Callers can sort or annotate their own index without changing later requests.
  return entries.map((entry) => ({ ...entry }));
}
