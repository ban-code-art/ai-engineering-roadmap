/** Published chapters only. The remaining curriculum lives in the planning document. */
export const fastapiChapters = [
  { id: "F01", slug: "http-request-response", title: "读懂 HTTP 请求与响应", summary: "从一条请求和一条响应，看清客户端、服务端、URL 与 JSON。", source: "f01-request" },
  { id: "F02", slug: "environment-and-project-root", title: "准备环境与项目根目录", summary: "建立独立 Python 环境，让终端与 PyCharm 使用同一个解释器。", source: "f02-check" },
  { id: "F03", slug: "python-for-api", title: "读懂写接口需要的 Python", summary: "用短脚本理解变量、函数、字典、模块与类型提示。", source: "f03-functions" },
] as const;

export function chapterHref(slug: string) { return `/learn/fastapi/${slug}`; }
export function findFastapiChapter(slug: string) { return fastapiChapters.find(chapter => chapter.slug === slug); }
