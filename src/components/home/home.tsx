import { useState, useEffect, useRef, MutableRefObject, createRef } from "react";
import vite from "./../../assets/react.svg";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import asset1 from "./../../assets/1.svg";
import asset2 from "./../../assets/2.svg";
import asset3 from "./../../assets/3.svg";
import asset4 from "./../../assets/4.svg";
import asset5 from "./../../assets/5.svg";
import asset6 from "./../../assets/6.svg";
import asset7 from "./../../assets/7.svg";
import asset8 from "./../../assets/8.svg";
import asset9 from "./../../assets/9.svg";
import asset10 from "./../../assets/10.svg";

interface Sixth {
  swiperSlideIndex: number;
  parentElement: HTMLElement;
}

interface Movie {
  id: string;
  asset: string;
  title: string;
  poster_path: string;
}

interface Genre {
  name: string;
}

interface Result extends Movie {
  asset: string;
}

const Home = (props) => {
  const [bgHome, setBgHome] = useState(vite);
  const [bgHome2, setBgHome2] = useState(vite);
  const [bgHome3, setBgHome3] = useState(vite);
  const [moviesPlaying, setMoviesPlaying] = useState([]);
  const [popular, setPopular] = useState<Result[]>([]);
  const [videoPlaying, setVideoPlaying] = useState(null);
  const [watchVideoPlaying, setWatchVideoPlaying] = useState(false);
  const [watchMoviePlaying, setWatchMoviePlaying] = useState(null);
  const [movieId, setMovieId] = useState("");
  const watchMoviePlayingRef = useRef(null);
  const [genres, setGenres] = useState([]);
  // resultados provinientes de la búsqueda del menu.
  const [results, setResults] = useState(null);
  // modal
  const modal = createRef();
  const [modalMovie, setModalMovie] = useState(null);

  const assets = [
    {
      value: asset1,
    },
    {
      value: asset2,
    },
    {
      value: asset3,
    },
    {
      value: asset4,
    },
    {
      value: asset5,
    },
    {
      value: asset6,
    },
    {
      value: asset7,
    },
    {
      value: asset8,
    },
    {
      value: asset9,
    },
    {
      value: asset10,
    },
  ];

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + import.meta.env.VITE_API_KEY,
    },
  };

  const nowPlaying = () => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
        options
      )
      .then((response) => {
        setBgHome(
          "https://image.tmdb.org/t/p/original/" +
            response.data.results[0].poster_path
        );
        setBgHome2(
          "https://image.tmdb.org/t/p/original/" +
            response.data.results[1].poster_path
        );
        setBgHome3(
          "https://image.tmdb.org/t/p/original/" +
            response.data.results[2].poster_path
        );
        setMoviesPlaying(response.data.results);
      })
      .catch((err) => console.error(err));
  };

  const watchVideo = (movieId: string) => () => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        options
      )
      .then((response) => {
        setVideoPlaying(response.data.results[0].key);
        setWatchVideoPlaying(true);
        setWatchMoviePlaying(null);
        watchMoviePlayingRef.current = null;
        setTimeout(() => {
          setupResizable();
          setupDraggable();
        }, 1000);
      })
      .catch((err) => console.error(err));
  };

  const [timeoutWatchMovie, setTimeoutWatchMovie] = useState(0);
  const interval = useRef(0);
  const movieHover: MutableRefObject<HTMLElement | null> = useRef(null);
  const [check, setCheck] = useState(false);
  const watchMovie1 = (movie: string) => {
    setCheck(false);
    if (watchMoviePlayingRef.current == null && interval.current < 20) {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${movie}/videos?language=en-US`,
          options
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.results.length > 0) {
            setWatchMoviePlaying(response.data.results[0].key);
            watchMoviePlayingRef.current = response.data.results[0].key;
          }
          setMovieId(movie);
        })
        .catch((err) => console.error(err));
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${movie}?language=en-US`,
          options
        )
        .then((response) => {
          setGenres(response.data.genres);
        })
        .catch((err) => console.error(err));
    } else if (interval.current < 20) {
      interval.current++;
      setTimeout(() => {
        watchMovie1(movie);
      }, 100);
    } else {
      clearTimeoutWatchMovie();
    }
  };
  const watchMovie2 = () => {
    interval.current = 0;
    if (watchMoviePlayingRef) {
      setCheck(true);
    }
    setTimeoutWatchMovie(timeoutWatchMovie);
  };

  const clearTimeoutWatchMovie = () => {
    watchMoviePlayingRef.current = null;
    interval.current = 0;
  };

  const clearMovieHover = () => {
    interval.current = 0;
    movieHover.current = null;
  };

  const clearWatchMoviePlayingRef = () => {
    // if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    watchMoviePlayingRef.current = null;
    interval.current = 0;
  };

  const closeMovie = () => {
    setWatchMoviePlaying(null);
    watchMoviePlayingRef.current = null;
    setMovieId("");
    interval.current = 0;
    setCheck(false);
  };

  let dragEl: HTMLElement | null;
  let dragHandleEl: HTMLElement;
  const lastPosition = useRef({ top: 0, left: 0 });

  const setupDraggable = () => {
    dragHandleEl = document.querySelector("[data-drag-handle]") as HTMLElement;
    dragHandleEl.addEventListener("mousedown", dragStart);
    dragHandleEl.addEventListener("mouseup", dragEnd);
    dragHandleEl.addEventListener("mouseout", dragEnd);
  };

  const setupResizable = () => {
    const resizeEl: HTMLElement = document.querySelector(
      "[data-resizable]"
    ) as HTMLElement;
    resizeEl.style.setProperty("resize", "both");
    resizeEl.style.setProperty("overflow", "hidden");
  };

  const dragMove = (event: MouseEvent) => {
    const dragElRect = dragEl?.getBoundingClientRect();
    if (!dragElRect) return;
    const newLeft = dragElRect.left + event.clientX - lastPosition.current.left;
    const newTop = dragElRect.top + event.clientY - lastPosition.current.top;
    dragEl?.style.setProperty("left", `${newLeft}px`);
    dragEl?.style.setProperty("top", `${newTop}px`);
    lastPosition.current.left = event.clientX;
    lastPosition.current.top = event.clientY;
    window.getSelection()?.removeAllRanges();
  };

  const dragStart = (event: MouseEvent) => {
    console.log(event);

    dragEl = getDraggableAncestor(event.target as HTMLElement);
    dragEl.style.setProperty("position", "absolute");
    lastPosition.current.left = event.clientX;
    lastPosition.current.top = event.clientY;
    dragHandleEl.classList.add("dragging");
    dragHandleEl.addEventListener("mousemove", dragMove);
  };

  const getDraggableAncestor = (element: HTMLElement) => {
    if (element.getAttribute("data-draggable")) return element;
    return getDraggableAncestor(element.parentElement as HTMLElement);
  };

  const dragEnd = () => {
    if (dragHandleEl) {
      dragHandleEl.classList.remove("dragging");
      dragHandleEl.removeEventListener("mousemove", dragMove);
    }
    dragEl = null;
  };

  const closeVideo = () => {
    setWatchVideoPlaying(false);
    dragEnd();
  };

  const popularVideos = () => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
        options
      )
      .then((response) => {
        const results: Result[] = [];
        response.data.results.map((result: Movie, index: number) => {
          if (index < 10) {
            Object.keys(assets).forEach((el, index2) => {
              if (
                assets[index2].value.includes(
                  "src/assets/" + (index + 1) + ".svg"
                )
              ) {
                result.asset = assets[index2].value;
              }
            });
            results.push(result);
          }
        });
        setPopular(results);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (props.results?.data?.results?.length > 0) {
      setResults(props.results.data.results);
      console.log(results);
    } else {
      nowPlaying();
      popularVideos();
      setResults(null);
    }
  }, [props, results]);

  const showModal = (movie) => {
    (modal.current as HTMLElement).classList.add('block');
    (modal.current as HTMLElement).classList.remove('hidden');
    setModalMovie(movie);
  }

  const closeModal = () => {
    (modal.current as HTMLElement).classList.remove('block');
    (modal.current as HTMLElement).classList.add('hidden');
  }

  return (
    <>
      <div className="relative">
        <div className="min-w-full min-h-screen w-full h-full fixed top-0 left-0">
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={bgHome}
              alt=""
              className="shadow-[0_0_12px_white,0_0_24px_black] absolute h-full object-contain z-20"
            />
            <div className="perspective-1200 absolute left-0 z-10">
              <img
                src={bgHome2}
                alt=""
                className="transform-left h-full object-contain"
              />
            </div>
            <div className="perspective-1200 absolute right-0">
              <img
                src={bgHome3}
                alt=""
                className="h-full transform-right object-contain"
              />
            </div>
          </div>
        </div>
        {results && (
          <div className="grid grid-cols-4 bg-[#000000AA] relative">
            {results.map((movie: Movie, index: number) => (
              <div
                key={movie.id}
                className={
                  index < 4
                    ? "mt-16 flex justify-center items-center"
                    : "flex justify-center items-center"
                }
              >
                <div className="group z-40 my-16 flex items-center relative overflow-visible">
                  <div
                    className="p-4"
                    onMouseOver={() => watchMovie1(movie.id)}
                    onMouseOut={() => {
                      clearTimeoutWatchMovie();
                    }}
                  >
                    <img
                      className=""
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </div>
                  {watchMoviePlayingRef && movie.id == movieId && (
                    <div
                      className="group hidden has-[.hidden]:hidden hover:positioning group-hover:block bg-black transition-all duration-500 scale-100 hover:scale-150 top-0 left-0 z-50 absolute w-64 h-64"
                      onMouseOver={() => watchMovie2()}
                      onMouseLeave={() => {
                        clearMovieHover();
                        closeMovie();
                        clearTimeoutWatchMovie();
                      }}
                    >
                      <div
                        ref={(el) => {
                          movieHover.current = el;
                        }}
                      >
                        {check && (
                          <iframe
                            className="w-full hidden group-hover:block"
                            src={`https://www.youtube.com/embed/${watchMoviePlaying}?autoplay=true`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        )}
                        <div className="">
                          <button
                            className="px-4 py-2 text-white"
                            onClick={watchVideo(movie.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-12"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                              />
                            </svg>
                          </button>
                          <div className="flex text-sm">
                            {genres.map((genre: Genre, index) => (
                              <div className="text-xs" key={index}>
                                {genre.name}{" "}
                                <span
                                  className={
                                    genres.length == index + 1
                                      ? "hidden"
                                      : "text-slate-700"
                                  }
                                >
                                  *&nbsp;
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {results == null && (
          <>
            <div className="relative h-screen w-full z-30 text-white flex items-end">
              <Swiper
                navigation={true}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={2}
                className="bg-[#000000AA]"
                onSlideChange={() => {
                  clearWatchMoviePlayingRef();
                  document
                    .querySelectorAll(".swiper-slide")
                    .forEach((slide) => {
                      slide.classList.remove("positioned");
                    });
                  const sixth = document.querySelector(
                    ".swiper-slide-active"
                  ) as unknown as Sixth;
                  const activeIndex = sixth.swiperSlideIndex ?? null;
                  if (sixth && sixth.parentElement) {
                    const siblings = sixth.parentElement.children;
                    if (siblings.length >= 7) {
                      // Asegúrate de que hay al menos 7 hijos
                      const sibling = siblings[activeIndex + 6];
                      if (sibling) sibling.classList.add("positioned"); // O cualquier estilo que desees
                    }
                  }
                }}
                onSwiper={(swiper) => console.log(swiper)}
                breakpoints={{
                  540: { slidesPerView: 3 },
                  640: { slidesPerView: 4 },
                  768: { slidesPerView: 5 },
                  1024: { slidesPerView: 6 },
                }}
              >
                {moviesPlaying.map((movie: Movie, index: number) => (
                  <SwiperSlide key={movie.id}>
                    <div className="group z-40 my-16 flex items-center relative overflow-visible">
                      <div
                        className="p-4"
                        onMouseOver={() => watchMovie1(movie.id)}
                        onMouseOut={() => {
                          clearTimeoutWatchMovie();
                        }}
                      >
                        <img
                          className=""
                          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                          alt={movie.title}
                        />
                      </div>
                      {watchMoviePlayingRef && movie.id == movieId && (
                        <div
                          className="group hidden has-[.hidden]:hidden hover:positioning group-hover:block bg-black transition-all duration-500 scale-100 hover:scale-150 top-0 left-0 z-50 absolute w-64 h-64"
                          onMouseOver={() => watchMovie2()}
                          onMouseLeave={() => {
                            clearMovieHover();
                            closeMovie();
                            clearTimeoutWatchMovie();
                          }}
                        >
                          <div
                            ref={(el) => {
                              movieHover.current = el;
                            }}
                          >
                            {check && (
                              <iframe
                                className="w-full hidden group-hover:block"
                                src={`https://www.youtube.com/embed/${watchMoviePlaying}?autoplay=true`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              ></iframe>
                            )}
                            <div className="">
                              {/* play video */}
                              <div className="flex justify-between items-center">
                                <button
                                  className="px-4 py-2 text-white"
                                  onClick={watchVideo(movie.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-12"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                                    />
                                  </svg>
                                </button>
                                <div onClick={(e) => showModal(movie)}>
                                  Info
                                </div>
                              </div>
                              <div className="flex text-sm">
                                {genres.map((genre: Genre, index) => (
                                  <div className="text-xs" key={index}>
                                    {genre.name}{" "}
                                    <span
                                      className={
                                        genres.length == index + 1
                                          ? "hidden"
                                          : "text-slate-700"
                                      }
                                    >
                                      *&nbsp;
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {watchVideoPlaying && (
              <div
                data-drag-handle="true"
                data-draggable="true"
                data-resizable="true"
                className="after:content-[''] after:absolute after:w-8 after:h-8 after:bg-transparent after:top-0 after:right-0 after:border-r-2 after:border-t-2 after:border-white before:content-[''] before:absolute before:w-8 before:h-8 before:bg-transparent before:bottom-0 before:right-0 before:border-r-2 before:border-b-2 before:border-white bg-transparent absolute resize top-0 left-0 z-50 w-80 h-64 flex justify-center items-center"
              >
                <div className="after:content-[''] after:absolute after:w-8 after:h-8 after:bg-transparent after:top-0 after:left-0 after:border-l-2 after:border-t-2 after:border-white before:content-[''] before:absolute before:w-8 before:h-8 before:bg-transparent before:bottom-0 before:left-0 before:border-l-2 before:border-b-2 before:border-white w-full h-full relative bg-transparent">
                  <span
                    className="cursor-pointer text-white absolute top-2 right-2 z-50"
                    onClick={closeVideo}
                  >
                    X
                  </span>
                  <iframe
                    data-drag-handle="true"
                    id="myIframe"
                    className={"absolute w-full h-full p-8 z-60"}
                    src={`https://www.youtube.com/embed/${videoPlaying}?autoplay=true`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
            )}
            <div className="bg-[#000000AA] relative">
              <h2 className="text-white text-4xl font-semibold py-4 px-2">
                Popular Movies
              </h2>
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
                loop={true}
                breakpoints={{
                  540: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 5,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 15,
                  },
                  1450: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                  },
                }}
              >
                {popular.map((movie: Movie, index) => (
                  <SwiperSlide key={movie.id} onClick={watchVideo(movie.id)}>
                    <div
                      className={`p-4 flex items-center gap-0 ${
                        index == 9 ? "relative left-[-2rem]" : ""
                      }`}
                    >
                      <img
                        src={movie.asset}
                        alt=""
                        className="max-h-[13rem] z-[-1] relative left-[2rem]"
                      />
                      <img
                        className="max-w-32"
                        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                        alt={movie.title}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}
      </div>
      {/* modal */}
      <div
        ref={modal}
        className="relative hidden z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-3/5">
              <div className="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                    <img
                      className=""
                      src={`https://image.tmdb.org/t/p/w200/${modalMovie?.poster_path}`}
                      alt={modalMovie?.title}
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col justify-between self-stretch">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-100"
                      id="modal-title"
                    >
                      {modalMovie?.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-100">
                        {modalMovie?.overview}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-gray-100">
                      <div className="flex items-center gap-5">
                        <p>
                          Puntuación: {modalMovie?.vote_average}
                        </p>
                        <p>
                          Votos: {modalMovie?.vote_count}
                        </p>
                      </div>
                      <div>
                        Estreno: {modalMovie?.release_date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
