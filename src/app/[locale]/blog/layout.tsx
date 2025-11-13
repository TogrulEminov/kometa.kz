import React from "react";
interface Props {
  children: React.ReactNode;
}
export default function BlogLayout({ children }: Props) {
  return <>{children}</>;
}
