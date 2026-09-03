import { Lottie } from "lottie-react";
import loadingAnimation from "../animations/loading.json";

export default function LoadingLottie() {
  return (
    <div className="loader-container">
      <Lottie
        src={loadingAnimation}
        autoplay
        loop
        style={{ width: `3.5rem`, height: `3.5rem`, paddingTop: `1rem` }}
      />
      <p>Indlæser...</p>
    </div>
  );
}
