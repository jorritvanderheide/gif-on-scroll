"use client";

import { useRef, useEffect } from "react";
import SuperGif from "libgif";

export default function Home() {
  const ref = useRef();
  useEffect(() => {
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
      }
    };
    window.addEventListener("scroll", frame);
  }, []);

  return (
    <div className="max-w-[50vw] mx-auto pt-[100vh]">
      <div className="flex gap-[5vw] items-center">
        <p>
          Peter had always been fascinated with the Mobility Center in the heart
          of Eindhoven. It was a hive of activity, a bustling hub of people
          coming and going in a constant stream. As he walked through the
          gleaming glass doors, the air hummed with the sound of electric
          vehicles darting back and forth.
        </p>
        <picture>
          <img
            ref={ref}
            rel:animated_src="/gif.gif"
            rel:auto_play="0"
            rel:rubbable="1"
            width="1024"
            height="1024"
            alt="gif"
          />
        </picture>
      </div>
    </div>
  );
}
