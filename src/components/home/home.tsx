import { useState, useEffect, useRef } from "react";
import vite from "./../../assets/react.svg";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

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

interface LastPosition {
  top: number;
  left: number;
}

const Home = () => {
  const [bgHome, setBgHome] = useState(vite);
  const [bgHome2, setBgHome2] = useState(vite);
  const [bgHome3, setBgHome3] = useState(vite);
  const [moviesPlaying, setMoviesPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [videoPlaying, setVideoPlaying] = useState(null);
  const [watchVideoPlaying, setWatchVideoPlaying] = useState(false);
  const [watchMoviePlaying, setWatchMoviePlaying] = useState(null);
  const [movieId, setMovieId] = useState("");
  // este es para acceder a la ventana del video creado dinámicamente.
  const videoDynamic = useRef(null);
  const [watchMoviePlayingIndex, setWatchMoviePlayingIndex] = useState("");
  const [assets, setAssets] = useState({
    asset1: asset1,
    asset2: asset2,
    asset3: asset3,
    asset4: asset4,
    asset5: asset5,
    asset6: asset6,
    asset7: asset7,
    asset8: asset8,
    asset9: asset9,
    asset10: asset10,
  });

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
        setTimeout(() => {
          setupResizable();
          setupDraggable();
        }, 1000);
      })
      .catch((err) => console.error(err));
  };

  let interval = 0;
  const [leftDynamic, setLeftDynamic] = useState(0);
  const [topDynamic, setTopDynamic] = useState(0);
  const [check, setCheck] = useState(true);

  const watchMovie = (e, movie) => {
    const clearI = setTimeout(() => {
      interval++;
      if (interval > 4) {
        if (watchMoviePlaying == null || watchMoviePlayingIndex != movieId) {
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${movie}/videos?language=en-US`,
              options
            )
            .then((response) => {
              const parentRect = e.nativeEvent.target.getBoundingClientRect();
              setWatchMoviePlaying(response.data.results[0].key);
              setWatchMoviePlayingIndex(movie);
              setMovieId(movie);

              if (videoDynamic && videoDynamic.current && parentRect) {
                const left =
                  parentRect.left +
                  parentRect.width / 2 -
                  videoDynamic.current.offsetWidth / 2;
                const top =
                  parentRect.top +
                  parentRect.height / 2 -
                  videoDynamic.current.offsetHeight / 2;

                setLeftDynamic(left);
                setTopDynamic(top);
                // Set the position of the child element
                videoDynamic.current.style.left = `${left}px`;
                videoDynamic.current.style.top = `${top}px`;
                videoDynamic.current.style.visibility = "visible";
                clearTimeout(clearI);
                interval = 0;
                setCheck(true);
              } else if (check) {
                watchMovie(e, movie);
              }
            })
            .catch((err) => console.error(err));
        }
      } else {
        setWatchMoviePlaying(null);
        watchMovie(e, movie);
      }
    }, 100);
  };

  const watchMovie2 = (e, movie) => {
    if (watchMoviePlaying == null || watchMoviePlayingIndex != movieId)
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie}/videos?language=en-US`,
        options
      )
      .then((response) => {
        setWatchMoviePlaying(response.data.results[0].key);
        setMovieId(movie);
      })
      .catch((err) => console.error(err));
  };

  const closeMovie = () => {
    setWatchMoviePlaying(null);
    setWatchMoviePlayingIndex("");
    setMovieId("");
    interval = 0;
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

  const dragStart = (event) => {
    dragEl = getDraggableAncestor(event.target);
    dragEl.style.setProperty("position", "absolute");
    lastPosition.current.left = event.target.clientX;
    lastPosition.current.top = event.target.clientY;
    dragHandleEl.classList.add("dragging");
    dragHandleEl.addEventListener("mousemove", dragMove);
  };

  const getDraggableAncestor = (element: HTMLElement) => {
    if (element.getAttribute("data-draggable")) return element;
    return getDraggableAncestor(element.parentElement as HTMLElement);
  };

  const dragEnd = () => {
    dragHandleEl.classList.remove("dragging");
    dragHandleEl.removeEventListener("mousemove", dragMove);
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
        const results = [];
        response.data.results.map((result, index: number) => {
          if (index < 10) {
            Object.keys(assets).forEach((el) => {
              if (assets[el].includes("src/assets/" + (index + 1) + ".svg")) {
                result.asset = assets[el];
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
    nowPlaying();
    popularVideos();
  }, []);

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
        <div className="relative h-screen w-full z-30 text-white flex items-end">
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            className="bg-[#000000AA]"
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            breakpoints={{
              540: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
          >
            {moviesPlaying.map((movie) => (
              <SwiperSlide
                key={movie.id}
              >
                <div
                  className="group z-40 my-16 flex items-center relative overflow-visible"
                  onMouseOver={(e) => watchMovie2(e, movie.id)}
                  onMouseOut={closeMovie}
                  >
                  <div className="p-4">
                    <img
                      className=""
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </div>
                  {movie.id == movieId &&
                  <div
                    className="hidden hover:positioning group-hover:block bg-black scale-150 top-0 left-0 z-50 absolute w-64 h-64"
                    onMouseOut={closeMovie}
                  >
                    <iframe
                      className={"w-full"}
                      src={`https://www.youtube.com/embed/${watchMoviePlaying}?autoplay=true`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                    <div className="bottom-0 left-0">{movieId}</div>
                  </div>
}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="bg-[#000000AA] relative">
          <h2 className="text-white text-4xl font-semibold py-4 px-2">
            1 Popular Movies
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
            {popular.map((movie, index) => (
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
      </div>
    </>
  );
};

export default Home;
