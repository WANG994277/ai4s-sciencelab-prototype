"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScientificComputing } from "@/components/v1/scientific-computing";
import type { ComputingTask } from "@/components/v1/scientific-computing-domain";
import { isParentMessage, parentMessageOrigin } from "@/compat/parent-messaging";

export default function Page() {
  const router = useRouter();
  const query = useSearchParams();
  const [task, setTask] = useState<ComputingTask | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!isParentMessage(event) || event.data?.type !== "ai4s-execution-load") return;
      setTask(event.data.task);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "ai4s-execution-ready" }, parentMessageOrigin());
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!task || !["compute", "training", "inference"].includes(task.category)) {
    return <p>执行详情不可用，请返回列表。</p>;
  }

  return <div style={{ padding: 24 }} onClickCapture={event => {
    const a = (event.target as HTMLElement).closest("a");
    if (!a) return;
    const url = new URL(a.href);
    const tab = url.searchParams.get("tab") ?? new URLSearchParams(url.hash.split("?")[1] ?? "").get("tab");
    if (!tab) return;
    event.preventDefault();
    const next = new URLSearchParams(query.toString());
    next.set("tab", tab);
    router.replace("/execution-detail?" + next.toString());
  }}><ScientificComputing embedded initialCategory={task.category} externalTask={task} /></div>;
}
