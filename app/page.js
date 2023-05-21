"use client";

import { useRef, useEffect, useState } from "react";
import SuperGif from "libgif";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg();

export default function Home() {
  const [video, setVideo] = useState("https://i.imgur.com/bzYIWDV.mp4");
  const [gif, setGif] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const ref = useRef();
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    if (!ffmpeg.isLoaded()) {
      load();
    }
    if (gif !== null) {
      const rub = new SuperGif({ gif: ref.current });
      rub.load(function () {
        console.log("Gif loaded");
      });
      let window_scroll_top =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const window_height = window.document.documentElement.clientHeight;
      const body = document.body;
      const html = document.documentElement;
      const document_height = Math.max(
        body.offsetHeight,
        body.scrollHeight,
        html.clientHeight,
        html.offsetHeight,
        html.scrollHeight
      );
      let frame = function () {
        if (typeof rub === "object") {
          window_scroll_top =
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
          const rubLength = rub.get_length();
          const rubIndex = Math.round(
            (window_scroll_top / (document_height - window_height)) *
              (rubLength - 1)
          );
          rub.move_to(rubIndex);
          console.log(ref.current.height)
        }
      };
      window.addEventListener("scroll", frame);
    }
  }, [gif]);

  // Generate video
  const generateVideo = async (e) => {
    e.preventDefault();
    console.log("Generating video");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/3d-ken-burns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: "https://imgur.com/DvamoTV.png",
        }),
      }
    );
    let video = await response.json();
    if (response.status !== 201) {
      setError(video.detail);
      return;
    }
    setVideo(video);
    console.log("Video generated");
  };

  // Convert video to gif
  const convertToGif = async (e) => {
    e.preventDefault();
    console.log("Converting video to gif");
    ffmpeg.FS("writeFile", "video1.mp4", await fetchFile(video));
    await ffmpeg.run(
      "-i",
      "video1.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "out.gif"
    );
    const data = ffmpeg.FS("readFile", "out.gif");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
    console.log("Video converted to gif");
  };

  return (
    <div className="max-w-[50vw] mx-auto pt-[100vh]">
      <div className="flex gap-[5vw] items-center">
        <p className="w-1/2">
          Peter had always been fascinated with the Mobility Center in the heart
          of Eindhoven. It was a hive of activity, a bustling hub of people
          coming and going in a constant stream. As he walked through the
          gleaming glass doors, the air hummed with the sound of electric
          vehicles darting back and forth.
        </p>
        {gif && (
          <picture className="w-1/2">
            <img
              ref={ref}
              rel:animated_src={gif}
              rel:auto_play="0"
              rel:rubbable="1"
              width="1024"
              height="1024"
              alt="scroll gif"
            />
          </picture>
        )}
      </div>

      {ready && (
        <div className="flex gap-8">
          <button
            className="bg-green-300 p-4"
            onClick={(e) => generateVideo(e)}
          >
            Generate video
          </button>
          <button
            className="bg-green-300 p-4"
            onClick={(e) => convertToGif(e)}
          >
            Convert to gif
          </button>
        </div>
      )}
    </div>
  );
}
