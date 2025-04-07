import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import CrossIcon from "../icons/CrossIcon";

// NavItem with hover animation
const NavItem = ({ text, className = "" }) => {
  const itemRef = useRef(null);
  const blackRef = useRef(null);
  const greyRef = useRef(null);
  const underlineLeft = useRef(null);
  const underlineRight = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    const blackText = blackRef.current;
    const greyText = greyRef.current;

    const onEnter = () => {
      gsap.to(blackText, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.fromTo(
        greyText,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.05 }
      );

      gsap.to(underlineLeft.current, {
        width: "50%",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(underlineRight.current, {
        width: "50%",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(greyText, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      gsap.to(blackText, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
        delay: 0.05,
      });

      gsap.to(underlineLeft.current, {
        width: "0%",
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(underlineRight.current, {
        width: "0%",
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    item.addEventListener("mouseenter", onEnter);
    item.addEventListener("mouseleave", onLeave);

    return () => {
      item.removeEventListener("mouseenter", onEnter);
      item.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col items-center justify-center cursor-pointer px-2 `}
    >
      <div
        className={`relative justify-center h-[28px]  overflow-hidden ${className}`}
      >
        {/* Black text */}
        <span
          ref={blackRef}
          className="absolute left-0 top-0 text-white font-medium whitespace-nowrap"
        >
          {text}
        </span>

        {/* Grey text */}
        <span
          ref={greyRef}
          className="absolute left-0 top-0 text-gray-400 font-medium whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          {text}
        </span>
      </div>

      {/* Underline - ends to center animation */}
      <div className="relative w-full h-[1px] mt-[2px]">
        <div
          ref={underlineLeft}
          className="absolute left-0 bottom-0 h-full bg-white origin-right"
          style={{ width: 0 }}
        />
        <div
          ref={underlineRight}
          className="absolute right-0 bottom-0 h-full bg-white origin-left"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose }) => {
  const [showItems, setShowItems] = useState(false);
  // const [hideItems, setHideItems] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // const items = ["Home", "About", "Projects", "Service", "Blog", "Contact"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            width: 1,
            height: 1,

            delay: 1,
            opacity: 40,
            x: "-50%",
            y: "-50%",
            left: "50%",
            top: "50%",
            position: "fixed",
          }}
          animate={{
            width: "100vw",
            height: "100vh",
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            opacity: 1,
            rotate: 360,
            transition: {
              duration: 1.2,
              ease: [0.42, 0, 0.58, 1],
              onComplete: () => setShowItems(true),
            },
          }}
          exit={{
            width: 1,
            height: 1,
            opacity: 40,
            x: "-50%",
            y: "-50%",
            left: "50%",
            top: "50%",
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
          className="md:hidden fixed bg-[#282828] text-white flex flex-col justify-center items-center z-50"
        >
          {showItems &&
            ["Home", "About", "Projects", "Service", "Blog", "Contact"].map(
              (text, index) => (
                <motion.div
                  key={text}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="text-xl py-2"
                >
                  {text}
                </motion.div>
              )
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Navbar Container
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      style={{
        fontFamily: "Instrument Sans",
      }}
      className="absolute top-0 left-0 right-0 z-50 px-8 py-6  flex justify-between items-center font-medium text-lg w-full"
    >
      {/* Left Section */}
      <div className="md:flex hidden gap-2">
        <NavItem text="Home" className=" min-w-[52px]" />
        <NavItem text="About" className=" min-w-[52px]" />
        <NavItem text="Projects" className=" min-w-[69px]" />
      </div>

      {/* Logo Center */}
      <div
        style={{
          fontFamily: "Instrument Sans",
        }}
        className="text-2xl text-white z-[100]  top-6 md:top-0 md:static  font-extrabold"
      >
        J.
      </div>

      {/* Right Section */}
      <div
        className="md:flex     hidden gap-2"
        style={{
          fontFamily: "Instrument Sans",
        }}
      >
        <NavItem text="SERVICE" className=" min-w-[76px]" />
        <NavItem text="BASIC" className=" min-w-[54px]" />
        <NavItem text="CONTACT" className=" min-w-[86px]" />
      </div>

      {/* right side icon */}
      <div className="md:hidden z-[100] fixed top-6 right-8">
        <button
          className="w-10 h-10 border border-[#8F8F8F] flex items-center justify-center"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <motion.div
            animate={{ rotate: menuOpen ? 270 : 0 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 1, 1] }} // ease-in acceleration
          >
            <CrossIcon className="text-white" />
          </motion.div>
        </button>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Navbar;
