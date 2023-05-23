"use client";

import uuid from "react-uuid";
import { useState } from "react";
import Gif from "./components/Gif";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [dataArray, setDataArray] = useState([]);

  // useEffect(() => {
  //   window.addEventListener("wheel", (event) => {
  //     if (event.deltaY > 0) {
  //       window.scrollTo({ top: window.scrollY + 100, behavior: "smooth" });
  //     } else if (event.deltaY < 0) {
  //       window.scrollTo({ top: window.scrollY - 100, behavior: "smooth" });
  //     }
  //   });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit() started");
    setIsDone(false);
    setIsGenerating(true);
    setChapter(chapter + 1);

    setDataArray((prevState) => [
      ...prevState,
      {
        paragraph: "Test",
        prompt: "AI prompt",
      },
    ]);

    setIsGenerating(false);
    setIsDone(true);
    document.getElementById("output").scrollIntoView({ behavior: "smooth" });
    console.log("handleSubmit() ended");
  };

  return (
    <section>
      <div className="h-[100vh] bg-slate-300 flex items-center justify-center">
        <form
          className="flex flex-col items-center gap-[5vh]"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex gap-[1vw]">
            {/* <input
              id="protagonist-name"
              className="p-2"
              placeholder="Protagonist name"
              type="text"
              value={protagonistName}
              onChange={(e) => setProtagonistName(e.target.value)}
            />
            <input
              id="spi-domain"
              className="p-2"
              placeholder="SPI domain"
              type="text"
              value={spiDomain}
              onChange={(e) => setSpiDomain(e.target.value)}
            /> */}
          </div>

          <button
            className="w-min bg-slate-400 p-2"
            type="submit"
          >
            {!isGenerating ? "Submit" : "Generating..."}
          </button>
        </form>
      </div>
      <div
        id="output"
        className="max-w-[80vw] mx-auto py-[10vh]"
      >
        {dataArray?.map((section) => (
          <div
            className="flex flex-row gap-[5vw] items-center"
            key={uuid()}
          >
            <p className="w-1/2">{section.paragraph}</p>
            <Gif
              prompt={section.prompt}
              id={uuid()}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
