import { useEffect, useRef, useState } from "react";
import { Globe } from "react-feather";
import gsap from "gsap";
gsap.config({ force3D: true });
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const containerRef = useRef(null);
  const imagesRefs = useRef([]);
  const revolvingImages = [
    "/me9.webp",
    "/me10.webp",
    "/me16.webp",
    "/me11.webp",
    "/me12.jpg",
    "/me13.jpg",
    "/me14.jpg",
    "/me15.jpg",
  ];

  const [dimensions, setDimensions] = useState({
    radius: window.innerWidth <= 766 ? 120 : 300,
    imageSize: window.innerWidth <= 766 ? 100 : 200,
    isMobile: window.innerWidth <= 766,
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 766;
      setDimensions({
        radius: isMobile ? 120 : 280,
        imageSize: isMobile ? 100 : 200,
        isMobile,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const numImages = revolvingImages.length;
    const angles = new Array(numImages)
      .fill(0)
      .map((_, i) => (i / numImages) * Math.PI * 2);

    const container = containerRef.current;

    const getCenterX = () =>
      dimensions.isMobile
        ? container.offsetHeight / 13
        : container.offsetWidth / 15;
    const getCenterY = () =>
      dimensions.isMobile
        ? container.offsetHeight / 15
        : container.offsetHeight / 10;

    // Set initial hidden state
    imagesRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, {
          scale: 0.1,
          opacity: 0,
          rotate: 0,
        });
      }
    });

    const xSetters = imagesRefs.current.map((el) =>
      gsap.quickSetter(el, "x", "px")
    );
    const ySetters = imagesRefs.current.map((el) =>
      gsap.quickSetter(el, "y", "px")
    );
    const zSetters = imagesRefs.current.map((el) =>
      gsap.quickSetter(el, "zIndex")
    );

    // Orbiting logic
    const animateOrbit = () => {
      const heading = document.getElementById("main-heading");
      const headingRect = heading.getBoundingClientRect();

      angles.forEach((angle, i) => {
        angles[i] += 0.001;

        const el = imagesRefs.current[i];
        if (!el) return;

        const x =
          getCenterX() +
          Math.cos(angles[i]) * dimensions.radius -
          dimensions.imageSize / 2;
        const y =
          getCenterY() +
          Math.sin(angles[i]) * dimensions.radius -
          dimensions.imageSize / 2;

        xSetters[i](x);
        ySetters[i](y);
        zSetters[i](y < getCenterY() ? 10 : 5);

        gsap.set(el, {
          width: dimensions.imageSize,
          height: dimensions.imageSize,
          force3D: true, // extra smoothness
        });

        const elRect = el.getBoundingClientRect();
        const isIntersecting =
          elRect.right > headingRect.left &&
          elRect.left < headingRect.right &&
          elRect.bottom > headingRect.top &&
          elRect.top < headingRect.bottom;

        const img = el.querySelector("img");
        if (img) {
          img.style.mixBlendMode = isIntersecting ? "difference" : "normal";
        }
      });

      requestAnimationFrame(animateOrbit);
    };

    // Full in-out timeline loop
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    tl.fromTo(
      imagesRefs.current,
      {
        scale: 0.01,
        opacity: 0,
        rotate: -90,
      },
      {
        scale: 1,
        opacity: 1,
        rotate: 360,
        duration: 1.2,
        ease: "power3.out",
        stagger: {
          each: 0.12,
          from: "start",
        },
      }
    );

    tl.to({}, { duration: 6 }); // Let them revolve a while

    tl.to(
      imagesRefs.current.slice().reverse(),
      {
        scale: 0.1,
        opacity: 0,
        rotate: "+=90",
        duration: 0.6,
        ease: "power2.inOut",
        stagger: {
          each: 0.1,
          from: "end",
        },
      },
      ">-1" // start before previous ends
    );

    animateOrbit();

    return () => {
      tl.kill();
      cancelAnimationFrame(animateOrbit);
    };
  }, [dimensions]);

  const globeRef = useRef(null);

  useEffect(() => {
    gsap.to(globeRef.current, {
      rotate: 360, // Z-axis rotation
      duration: 6,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#111111]"
    >
      {/* Center Text */}
      <h1
        id="main-heading"
        className=" font-bold  md:tracking-[-0.3rem] text-white mix-blend-difference z-30 pointer-events-none select-none absolute"
        style={{
          fontFamily: "MangoGrotesque",
          fontSize: "clamp(5rem, 28vw, 26vw)",
        }}
      >
        JAI THAKUR
      </h1>

      {/* Orbiting Images */}
      {revolvingImages.map((img, index) => (
        <div
          key={index}
          ref={(el) => (imagesRefs.current[index] = el)}
          className="absolute pointer-events-none"
          style={{
            transform: "translate(0px, 0px)",
            zIndex: 5,
            willChange: "transform, opacity",
          }}
        >
          <img
            src={img}
            alt={`Revolving ${index}`}
            className="w-full h-full object-cover transition-all duration-300 mix-blend-normal"
            style={{
              transition: "all 0.3s ease",
              willChange: "transform, opacity",
            }}
          />
        </div>
      ))}

      {/* Bottom Left */}
      <div className="absolute md:bottom-10 bottom-8 md:left-10 left-6 flex items-center gap-3 text-[#8F8F8F] z-20">
        <div ref={globeRef}>
          <Globe size={24} />
        </div>
        <span
          style={{
            fontFamily: "Instrument Sans",
          }}
        >
          SINCE 2001
        </span>
      </div>

      {/* Bottom Right */}
      <div className="absolute md:bottom-10 bottom-6 md:right-10 right-4 flex items-center gap-2 text-[#8F8F8F] z-20">
        <span
          style={{
            fontFamily: "Instrument Sans",
          }}
        >
          JAMMU
        </span>
        {/* Animated Arc with MapPin at center */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* Bouncing Pin */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="z-10"
          >
            <FontAwesomeIcon icon={faLocationDot} size="lg" color="#8F8F8F" />
          </motion.div>

          {/* Rotating Arc around Pin */}
          <motion.div
            style={{
              position: "absolute",
              top: 8,
              left: 0,
              width: "100%",
              height: "100%",
              transformOrigin: "center",
              transformStyle: "preserve-3d",
            }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          >
            <svg width="10" height="40">
              <circle
                cx="20"
                cy="20"
                r="10"
                stroke="#8F8F8F"
                strokeWidth="2"
                strokeDasharray="50 100"
                fill="none"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
