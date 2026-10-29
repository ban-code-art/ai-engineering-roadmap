import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./docs.css";

export const metadata: Metadata = {
  title: { default: "AI Engineering Roadmap", template: "%s · AI Engineering Roadmap" },
  description: "AI 工程学习知识库。基础教程与项目实践统一使用 LangChain 风格文档框架，内容将重新编写。",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head><link rel="stylesheet" href="/fonts/fonts.css"/></head>
      <body>{children}</body>
    </html>
  );
}
