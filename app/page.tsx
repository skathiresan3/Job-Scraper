"use client";
import Image from "next/image";

export default function Home() {
  function getJobs() {
    const response = fetch("/api/find-jobs")
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })

  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>We are about to build the most insane job scraper known to man.</h1>
        <button onClick={getJobs}>Fetch Jobs</button>
      </main>
    </div>
  );
}
