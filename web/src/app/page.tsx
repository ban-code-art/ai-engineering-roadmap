import { SectionLanding } from "@/components/docs/section-landing";

export const metadata = {
  title: "学习路线",
  description: "AI 工程学习路线。基础教程与项目实践共用文档模板，正式内容待编写。",
};

export default function HomePage() {
  return <SectionLanding section="overview" />;
}
