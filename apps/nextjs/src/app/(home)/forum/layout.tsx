import React from "react";

export default function ForumLayout(props: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 py-10">{props.children}</div>;
}
