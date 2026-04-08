import { useEffect, useState } from "react";
import shipcargo from "../../assets/shipcargo.jpg";

export default function LoginBackground() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const img = new Image();
    img.src = shipcargo;

    img.onload = () => {
      if (isMounted) setBgLoaded(true);
    };

    img.onerror = () => {
      if (isMounted) setBgLoaded(true); // fallback para evitar pantalla negra
    };

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 hidden lg:block pointer-events-none">

      {/* BASE GRADIENT (siempre visible) */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0B1B33] via-[#09162A] to-black" />

      {/* IMAGE */}
      <img
        src={shipcargo}
        alt="background"
        loading="eager"
        decoding="async"
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-700 will-change-opacity
          ${bgLoaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#0B1B33]/75" />

    </div>
  );
}