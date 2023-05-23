"use client";

import { useEffect, useState } from "react";
import SuperGif from "libgif";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import uuid from "react-uuid";

const ffmpeg = createFFmpeg();

const Gif = ({ prompt, id }) => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [gif, setGif] = useState(null);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [refElement, setRefElement] = useState(uuid());

  useEffect(() => {
    console.log("run");

    if (!finished) {
      // Generate Image
      const generateImage = async () => {
        console.log("Generating image");
        // Generate Image
        setImage("https://imgur.com/wTJtl2V.png");
        console.log("Image generated");
      };

      // Generate video
      const generateVideo = async () => {
        console.log("Generating video");
        // const response = await fetch(
        //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/3d-ken-burns`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       image: image,
        //     }),
        //   }
        // );
        // let video = await response.json();
        // if (response.status !== 201) {
        //   return;
        // }
        // setVideo(video);
        setVideo(
          "https://replicate.delivery/pbxt/UrPe2JdiZrTkdKbmzzaCCMmlzGPUFPPeU401Lx25bWxXwjehA/output.mp4"
        );
        console.log("Video generated");
      };

      const convertGif = async () => {
        if (video !== null) {
          console.log("Converting video");
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
          console.log("Video converted");
          setGif(url);
        }
      };

      // Load ffmpeg
      const load = async () => {
        await ffmpeg.load();
        setReady(true, generateImage());
      };
      if (!ffmpeg.isLoaded()) {
        load();
      }

      // Run
      if (image !== null) {
        generateVideo();
      }
      if (video !== null) {
        convertGif();
      }
    }

    if (gif !== null) {
      let ref = document.getElementById(id);
      if (ref !== null) {
        console.log(ref);
        const rub = new SuperGif({ gif: ref });
        rub.load(function () {
          console.log("Gif loaded");
        });
        const window_height = window.document.documentElement.clientHeight;
        let frame = function () {
          if (typeof rub === "object") {
            const rubLength = rub.get_length();
            var rubIndex;
            var position = document
              .getElementById(refElement)
              .firstChild.firstChild.getBoundingClientRect();
            if (position.top <= window_height && position.bottom >= 0) {
              rubIndex = Math.round(
                rubLength -
                  position.bottom *
                    (rubLength / (position.height + window_height))
              );
            } else if (position.bottom < window_height) {
              rubIndex = Math.round(rubLength - 1);
            } else {
              rubIndex = 0;
            }
            rub.move_to(rubIndex);
          }
        };
        window.addEventListener("wheel", frame);
        setFinished(true);
      }
    }
  }, [image, video, gif, id, finished, refElement]);

  return (
    <>
      <picture
        id={refElement}
        className="w-1/2"
      >
        <img
          id={id}
          rel:animated_src={gif}
          rel:auto_play="0"
          rel:rubbable="1"
          width="512"
          height="512"
          alt={prompt}
        />
      </picture>
    </>
  );
};

export default Gif;
