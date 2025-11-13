import React from "react";
interface Props {
  children: React.ReactNode;
}
export default function MediaLayout({ children }: Props) {
  return <>{children}</>;
}
