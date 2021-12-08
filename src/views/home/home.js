import React from "react";
import logo from "../../assets/logo2.png";
import video from "../../assets/video3.mp4";
import { CounterCard } from "../../components/counter-card/counter-card";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import "./home.css";


function scrollToHash() {
  const anchor = document.getElementById("join-us");
  if (anchor) {
    anchor.scrollIntoView();
  }
}

const Home = () => {
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <section id="home">
      <video autoPlay loop muted className="video-area" preload="auto">
        <source src={video} type="video/mp4" />
      </video>
      <div className="blackout"></div>
      <motion.div style={{ scale }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <motion.div animate={{ scale: 1.5 }} transition={{ duration: 2 }}>
            <img src={logo} alt="logo" className="logo" />
            <p className="subtitle" style={{ textAlign: "center" }}>
              Teknolojinin olduğu her yerde biz varız !
            </p>
          </motion.div>
          <a section-id="#join-us" onClick={scrollToHash}>
            <div className="apply-btn">
                <p className="apply-text">Bize Katıl</p>
            </div>
          </a>
        </div>
      </motion.div>

    </section>
  );
};

export default Home;
