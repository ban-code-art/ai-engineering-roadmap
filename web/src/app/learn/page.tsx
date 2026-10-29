import { SectionLanding } from "@/components/docs/section-landing";

export const metadata = {
  title: "基础教程",
  description: "基础教程内容待编写。与项目实践共用当前文档模板，首批内容从 FastAPI 开始。",
};

export default function LearnPage() {
  return <SectionLanding section="learn" />;
}
