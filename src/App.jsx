import WordCloud from "wordcloud";
import Papa from "papaparse";
import ReactJoyride from "react-joyride";
import gsap from "gsap";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import imgExample from './assets/imgs/example.png'
import imgExample2 from './assets/imgs/example2.png'
import imgExample3 from './assets/imgs/example3.png'
import imgExample4 from './assets/imgs/example4.png'



function App() {
  const [words, setWords] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const steps = [
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">First</h1>
          <h1>For the first you must have file .csv</h1>
          <p>Copy the link URL to the post you want to retrieve </p>
          <img
            src={imgExample2}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">Second</h1>
          <p>
            Paste the link URL into IGCommentsExport and click export, you must
            have installed it before
          </p>
          <img
            src={imgExample3}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">Third</h1>
          <p>
            Then delete all data and columns User Id, Username, Comment Id,
            Profile URL, Avatar URL & Date. Leave only data in column comment
            text
          </p>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <h1>Before: </h1>
              <img
                src={imgExample4}
                alt=""
                className="w-full h-full object-cover"
                
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>After: </p>
              <img
                src={imgExample}
                alt=""
                className="w-full h-full object-cover"
                
              />
            </div>
          </div>
        </div>
      ),
      placement: "center",
      target: "section",
    },

    {
      target: ".dropzone",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="font-bold text-xl">Fourth</h1>
          <h1>Put or drop your file .csv to drop zone.</h1>
        </div>
      ),
    },
    {
      target: ".process-button",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="font-bold text-xl">Fifth</h1>
          <h1>Click here to process the file and generate the word cloud.</h1>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-[50%] justify-center items-center gap-4">
          <h1 className="text-xl font-bold">🎉 Congratulation 🎉</h1>
          <p>Your word cloud has been built!</p>
        </div>
      ),
      placement: "center",
      target: "section",
    },
  ];

  const handleTourCallback = (data) => {
    if (data.status === "finished") {
      setShowGuide(false);
    } else if (data.status === "skipped") {
      setShowGuide(false);
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          const sortedWordCount = sortWordCounts(countWords(data));

          const wordArray = sortedWordCount.map(([word, count]) => [
            word,
            count,
          ]);
          setWords(wordArray);
          setFileName(file.name);
        },
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
      event.preventDefault();
    }
  };

  const extractWords = (comment) => {
    return comment.match(/\w+/g) || [];
  };

  const countWords = (comments) => {
    const wordCount = {};
    comments.forEach((commentArr) => {
      commentArr.forEach((comment) => {
        const words = extractWords(comment);
        words.forEach((word) => {
          const lowerWord = word.toLowerCase();
          if (wordCount[lowerWord]) {
            wordCount[lowerWord] += 1;
          } else {
            wordCount[lowerWord] = 1;
          }
        });
      });
    });
    return wordCount;
  };

  const sortWordCounts = (wordCount) => {
    return Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
  };

  const handleFormSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

    setTimeout(() => {
      setShowCanvas(true);
      setLoading(false);
    }, 3000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "wordcloud.png";
      link.click();
    }
  };

  const svgRef = useRef(null);

  useEffect(() => {
    if (showCanvas && canvasRef.current) {
      const numWords = words.length;
      let weightFactor;

      if (numWords <= 100) {
        weightFactor = 20;
      } else if (numWords <= 200) {
        weightFactor = 17;
      } else if (numWords <= 300) {
        weightFactor = 13;
      } else if (numWords <= 400) {
        weightFactor = 7;
      } else {
        weightFactor = 3;
      }

      WordCloud(canvasRef.current, {
        list: words,
        weightFactor: weightFactor,
        color: "random-light",
        backgroundColor: "transparent",
        header: false,
      });
    }

    // Gsap animation
    /* Text reveal */
    gsap.fromTo(
      ".text-reveal",
      {
        y: 100,
      },
      {
        y: 0,
        duration: 1,
        ease: "power2.out",
      }
    );

    /* star and moon*/
    const moon = gsap.fromTo(
      ".moon",
      {
        y: -1000,
      },
      {
        y: 0,
        duration: 1.5,
        ease: "bounce.out",
      }
    );

    const stars = gsap.fromTo(
      ".star",
      {
        y: -1000,
      },
      {
        y: 0,
        duration: 2.5,
        stagger: 0.7,
        ease: "bounce.out",
      }
    );

    gsap
      .timeline({
        duration: 0,
      })
      .add(moon, 0.1)
      .add(stars, 0.1)
      .fromTo(
        ".star",
        {
          rotate: -45,
        },
        {
          transformOrigin: "50% 50%",
          repeat: -1,
          rotate: 45,
          yoyo: true,
          duration: 1,
          stagger: 0.3,
        }
      );

    /* Component rotate */
    gsap.to(".sun", {
      duration: 10,
      rotation: 360,
      transformOrigin: "50% 50%",
      repeat: -1,
      ease: "none",
    });

    /* Animated stroke */
    const path = svgRef.current.querySelector("path");
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    /* marquee verti */
    const marqVerti = gsap.timeline({
      repeat: -1,
      defaults: { duration: 1, delay: 1, ease: "expo.inOut" },
    });

    marqVerti.to(".marquee-vertical", { yPercent: -100 });
    marqVerti.to(".marquee-vertical", { yPercent: -200 });
    marqVerti.to(".marquee-vertical", { yPercent: -300 });
    marqVerti.to(".marquee-vertical", { yPercent: 0 });

    /* arrow */
    gsap.fromTo(
      ".arrow",
      {
        x: -10,
      },
      {
        yoyo: true,
        repeat: -1,
        duration: 1,
        x: 10,
      }
    );

    /* Adjust */
    gsap.fromTo(
      ".adjust",
      {
        y: 500,
      },
      { y: 0, duration: 1, ease: "power2.out" }
    );
  }, [showCanvas, words]);

  return (
    <>
      <ReactJoyride
        steps={steps}
        run={showGuide}
        callback={handleTourCallback}
        continuous
        showSkipButton
        showProgress
      />
      <section className=" relative flex flex-col min-h-dvh bg-[#021526] px-10 justify-center items-center overflow-hidden ">
        {/* button guide */}
        <div
          onClick={() => setShowGuide(true)}
          className="absolute z-10 right-4 top-4 xl:right-10 xl:top-10 rounded-xl flex justify-center items-center px-4 py-2 gap-2 md:gap-2 bg-white hover:bg-yellow-200 transition-all duration-300 cursor-pointer"
        >
          <h1 className=" font-bold text-base xl:text-xl text-black">Guide</h1>
          <svg
            className="w-5 md:w-6 h-5 md:h-6 text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
            />
          </svg>
        </div>
        {/* button guide end*/}

        {/* Hero */}
        <div className="flex flex-col w-full gap-2 md:gap-6 justify-center items-center text-center z-10">
          <div className="overflow-hidden flex flex-col md:flex-row gap-2 md:gap-8 justify-center items-center ">
            <h1 className="text-reveal text-[16vw] md:text-[10vw] lg:text-[7vw] leading-[100%] font-Calistoga-Regular text-white text-balance ">
              Visualize
            </h1>

            <div className="relative text-reveal bg-yellow-200 rounded-full w-[240px] h-[63px] md:w-96 md:h-[100px] px-4 overflow-hidden flex flex-col ">
              <h1 className="marquee-vertical text-[44px] sm:text-[44px] md:text-[8vw] lg:text-[6vw] xl:text-[72px] font-Margarine-Regular">
                #^&@
              </h1>
              <h1 className="marquee-vertical text-[44px] sm:text-[44px] md:text-[8vw] lg:text-[6vw] xl:text-[72px] font-Margarine-Regular">
                🔥🔥🔥
              </h1>
              <h1 className="marquee-vertical text-[44px] sm:text-[44px] md:text-[8vw] lg:text-[6vw] xl:text-[72px] font-Margarine-Regular">
                ~@$-
              </h1>
              <h1 className="marquee-vertical text-[44px] sm:text-[44px] md:text-[8vw] lg:text-[6vw] xl:text-[72px] font-Margarine-Regular">
                Damn !
              </h1>
            </div>
          </div>

          <div className="overflow-hidden flex gap-2 md:gap-8 p-2 justify-center items-center">
            <h1 className="text-reveal font-Calistoga-Regular  text-[12vw] md:text-[10vw] lg:text-[7vw] leading-[100%] text-white text-balance ">
              your
            </h1>
            <div className=" bg-green-300 rounded-full h-12 w-12 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px] xl:w-32 xl:h-32 overflow-hidden flex justify-center items-center">
              <span>
                <svg
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 10"
                  width="16"
                  height="10"
                  className="w-8 md:w-16 h-auto arrow"
                >
                  <g data-name="Layer 1">
                    <path
                      d="m16,6H0v-2h11.53c-.95-1.06-1.53-2.46-1.53-4h2c0,2.21,1.79,4,4,4v2Z"
                      fill="#030326"
                      strokeWidth="0"
                    ></path>
                    <path
                      d="m12,10h-2c0-1.31.41-2.56,1.2-3.6l1.6,1.2c-.52.7-.8,1.52-.8,2.4Z"
                      fill="#030326"
                      strokeWidth="0"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
            <h1 className="text-reveal font-Calistoga-Regular text-[12vw] md:text-[10vw] lg:text-[7vw] leading-[100%] text-white text-balance ">
              words.
            </h1>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 items-center justify-center w-full md:w-[75%] lg:w-1/2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label
              htmlFor="dropzone-file"
              className="dropzone flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            >
              {fileName ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m2.665 9H6.647A1.647 1.647 0 0 1 5 15.353v-1.706A1.647 1.647 0 0 1 6.647 12h1.018M16 12l1.443 4.773L19 12m-6.057-.152-.943-.02a1.34 1.34 0 0 0-1.359 1.22 1.32 1.32 0 0 0 1.172 1.421l.536.059a1.273 1.273 0 0 1 1.226 1.718c-.2.571-.636.754-1.337.754h-1.13"
                    />
                  </svg>

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{fileName}</span> <br />
                    Or drag and drop another file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    .CSV
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                name="file"
                type="file"
                className="sr-only"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleInputChange}
              />
            </label>
            <button
              disabled={!fileName}
              type="submit"
              className={`process-button font-Calistoga-Regular text-black text-xl border-transparent px-4 py-2 rounded-lg bg-green-300 ${
                !fileName
                  ? "hover:bg-green-300 cursor-not-allowed"
                  : "hover:bg-green-500 cursor-pointer"
              }   transition-all duration-300 w-full`}
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  className="inline w-6 h-6 text-gray-200 animate-spin text-center dark:text-white fill-gray-600 dark:fill-gray-300"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <span>Process</span>
              )}
            </button>
          </form>
        </div>
        {/* Hero-end */}

        {/* wwww */}
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 951 367"
          fill="none"
          className="svg-w w-[250px] h-[250px] md:w-[380px] md:h-[380px] lg:w-[500px] lg:h-[500px]  absolute -top-12 -left-12 md:-top-24 md:-left-24 rotate-[-225deg] z-0 "
        >
          <path
            d="M926 366V41.4C926 32.7 919 25.6 910.2 25.6C904.6 25.6 899.7 28.4 897 32.9L730.2 333.3C727.5 338 722.3 341.2 716.5 341.2C707.8 341.2 700.7 334.2 700.7 325.4V41.6C700.7 32.9 693.7 25.8 684.9 25.8C679.3 25.8 674.4 28.6 671.7 33.1L504.7 333.3C502 338 496.8 341.2 491 341.2C482.3 341.2 475.2 334.2 475.2 325.4V41.6C475.2 32.9 468.2 25.8 459.4 25.8C453.8 25.8 448.9 28.6 446.2 33.1L280.2 333.3C277.5 338 272.3 341.2 266.5 341.2C257.8 341.2 250.7 334.2 250.7 325.4V41.6C250.7 32.9 243.7 25.8 234.9 25.8C229.3 25.8 224.4 28.6 221.7 33.1L54.7 333.3C52 338 46.8 341.2 41 341.2C32.3 341.2 25.2 334.2 25.2 325.4V1"
            stroke="#D61C4E"
            strokeWidth="50"
            strokeMiterlimit="10"
            strokeLinejoin="round"
          ></path>
        </svg>

        {/* Sun */}
        <svg
          className="sun w-[440px] h-[440px] lg:w-[700px] lg:h-[700px] text-[#FFAF61] absolute top-[-210px] right-[-170px] lg:-top-[300px] lg:-right-[260px] z-[0]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon */}
        <svg
          className="moon hidden lg:flex md:absolute bottom-[-30px] left-[-30px] w-[400px] h-[400px] text-gray-200 z-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
          />
        </svg>

        {/* star */}
        <svg
          className="star absolute left-0 w-[80px] h-[80px]  md:w-[150px] md:h-[150px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>

        <svg
          className="star absolute left-[240px] bottom-[220px] w-[80px] h-[80px]   md:w-[150px] md:h-[150px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>

        {/* adjust  */}
        <svg
          className="adjust absolute right-[-40px] bottom-[-40px] md:right-[-80px] md:bottom-[-80px] md:w-[400px] md:h-[400px] w-[200px] h-[200px] text-[#916DB3] rotate-[-45deg]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"
          />
        </svg>

        <p className="absolute bottom-4 text-lg font-serif text-gray-400 ">
          made with 💖 &copy; 2024
        </p>
      </section>

      {showCanvas && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-[#021526] object-contain relative p-6 max-w-[95%] min-h-[50%] lg:h-[90%] lg:max-w-[70%] xl:max-w-[65%] rounded-lg text-center flex flex-col gap-2">
            <div
              onClick={() => setShowCanvas(false)}
              className="flex items-center gap-2 cursor-pointer group justify-end"
            >
              <h1 className="text-md text-white group-hover:text-gray-200">
                Close
              </h1>
              <svg
                className="w-6 h-6 text-white group-hover:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fillRule="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold  text-white">
              Result
            </h2>
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="object-scale-down lg:object-contain  lg:w-full lg:h-full xl:min-h-[60%]  scale-100 border rounded-xl"
            ></canvas>
            <div className="grid grid-cols-3 items-center justify-between text-start gap-2">
              {words.slice(0, 9).map(([word, count], index) => (
                <h1
                  key={index}
                  className="text-md md:text-xl text-white font-bold"
                >
                  {word}: {count}
                </h1>
              ))}
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 rounded-lg py-2 px-4 bg-green-300 hover:bg-green-500 cursor-pointer text-xl text-black font-bold  transition-all duration-300"
            >
              Download as PNG
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App;
