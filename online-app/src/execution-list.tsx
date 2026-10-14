"use client";
import { useEffect, useState } from "react";
import { ScientificComputing } from "@/components/v1/scientific-computing";
import { createComputingSeed, type ComputingTask, type ComputingCategory } from "@/components/v1/scientific-computing-domain";
import { isParentMessage, parentMessageOrigin } from "@/compat/parent-messaging";

export default function Page() {
  const [tasks, setTasks] = useState<ComputingTask[] | null>(null);
  const [category, setCategory] = useState<ComputingCategory>("compute");

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!isParentMessage(event) || event.data?.type !== "ai4s-execution-list-load") return;
      setTasks(event.data.tasks);
      setCategory(event.data.category);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "ai4s-execution-list-ready", seeds: createComputingSeed("current") }, parentMessageOrigin());
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!tasks) return <p>正在加载执行记录…</p>;

  return <div style={{ padding: 24 }} onClickCapture={event => {
    const a = (event.target as HTMLElement).closest("a");
    if (!a) return;
    const url = new URL(a.href);
    const route = url.hash ? url.hash.split("?")[0] : url.pathname;
    const id = decodeURIComponent(route.split("/").pop() || "");
    if (tasks.some(task => task.id === id)) {
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage({ type: "ai4s-execution-open", id }, parentMessageOrigin());
    }
  }}><ScientificComputing embedded initialCategory={category} externalTasks={tasks} /></div>;
}
