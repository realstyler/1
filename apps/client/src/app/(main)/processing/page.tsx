"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProcessingSpinner } from "@/components/processing";
import { Job } from "shared";
import { getJobsResultsApi } from "@/restyle/restyle.api";
import { createImageSignedUrlsApi } from "@/upload/images.api";

export default function ProcessingPage() {
  const router = useRouter();
  const [styleName, setSelectedStyle] = useState("");
  const [jobsIds, setJobsIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [images, setImages] = useState<
    {
      id: string;
      preview: string;
      path: string;
      status: "pending" | "completed";
    }[]
  >([]);
  const [signedLoaded, setSignedLoaded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("jobs");
    if (raw) {
      const jobIds = raw.split(",");
      setJobsIds(jobIds);
    }

    const storedStyle = sessionStorage.getItem("selectedStyle");
    if (storedStyle) {
      try {
        const style = JSON.parse(storedStyle).name as string;
        setSelectedStyle(style);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (jobsIds.length === 0) return;

    let active = true;

    const polling = async () => {
      const data = await getJobsResultsApi(jobsIds);
      if (!data || !active) return;

      const jobs = data.filter((j) => j !== null);
      setJobs(jobs);

      const hasPending = jobs.some((j) => j.status === "pending");
      if (hasPending) setTimeout(polling, 1000);
    };

    polling();

    return () => {
      active = false;
    };
  }, [jobsIds]);

  useEffect(() => {
    if (jobs.length === 0 || signedLoaded) return;

    const loadSigned = async () => {
      const paths = jobs.map((j) => j.input.path);
      const urls = await createImageSignedUrlsApi(paths);

      setImages(
        jobs.map((job, i) => ({
          id: job.id,
          preview: urls[i],
          path: job.input.path,
          status: job.status === "pending" ? "pending" : "completed",
        })),
      );

      setSignedLoaded(true);
    };

    loadSigned();
  }, [jobs, signedLoaded]);

  useEffect(() => {
    if (jobs.length === 0 || images.length === 0) return;

    setImages((prev) =>
      prev.map((img) => {
        const job = jobs.find((j) => j.id === img.id);
        if (!job) return img;

        return {
          ...img,
          status: job.status === "pending" ? "pending" : "completed",
        };
      }),
    );

    const done = jobs.every((j) => j.status !== "pending");
    if (done) setIsComplete(true);
  }, [images.length, jobs]);

  useEffect(() => {
    if (!isComplete) return;

    const tm = setTimeout(() => {
      router.push("/viewer");
    }, 1000);

    return () => clearTimeout(tm);
  }, [isComplete, router]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Spinner */}
          <div className="flex justify-center mb-8">
            <ProcessingSpinner />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {isComplete ? "All Done!" : "Transforming Your Rooms"}
          </h1>
          {styleName && (
            <p className="text-violet-400 font-medium mb-2">
              Applying {styleName} style
            </p>
          )}
          <p className="text-black/60">
            {isComplete
              ? "Redirecting to results..."
              : "Our AI is generating your new designs in parallel."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="bg-black/5 border border-black/10 p-4 rounded-xl flex items-center gap-4"
            >
              <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt={`Room ${idx + 1}`}
                  className="w-full h-full object-cover opacity-60"
                />
                {/* <Image
                  src={img.preview}
                  alt={`Room ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover opacity-60"
                /> */}
                {img.status === "completed" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-black/80">
                    Room {idx + 1}
                  </span>
                  <span className="text-xs text-black/50 uppercase">
                    {img.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
