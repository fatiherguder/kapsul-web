import React, { useState, useEffect, useRef } from 'react';
import { MenuItems } from './menuItems';
import logo from '../../assets/logo2.png'
import './navbar-style.css';
import { Navbar, Nav } from 'react-bootstrap';
import { motion } from "framer-motion";
import * as Scroll from 'react-scroll';

const CustomNavbar = () => {

  var scroll = Scroll.animateScroll;

  function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
  }

  const [navBackground, setNavBackground] = useState(false)
  const navRef = useRef()
  navRef.current = navBackground
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > vh(60)
      if (navRef.current !== show) {
        setNavBackground(show)
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])


  function scrollToHash(e) {
    const sectionId = e.target.getAttribute("section-id");
    const anchor = document.querySelector(sectionId);
    if (anchor) {
      anchor.scrollIntoView();
    }
  }

  return (
    <Navbar id="nav" expand="lg" fixed="top" variant='dark' style={{ transition: '1s ease', backgroundColor: navBackground ? '#121126' : 'transparent', padding: "0 15vw" }}>
      <Navbar.Brand>
        {
          navBackground ? <motion.div
            animate={{ x: 0, y: 51, scale: 1, }}
            transition={{ duration: 1 }}>
            <a href="/" onClick={() => scroll.scrollTo(0, {
              duration: 100,
              delay: 0,
              smooth: "easeOutQuart"
            })}>
              <img
                style={{ transform: ' translateY(-120%)' }}
                src={logo}
                width="auto"
                height="40"
                className="d-inline-block align-top"
                alt="Logo"
              />
            </a>
          </motion.div> : null
        }
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" style={{ color: 'white' }} />
      <Navbar.Collapse className={navBackground ? "justify-content-center animated" : "justify-content-center animated-reverse"}>
        <Nav >
          {MenuItems.map((item, index) => {
            if (index !== MenuItems.length - 2) {
              return (
                <a onClick={(e) => scrollToHash(e)} key={item.id} className={item.cName} section-id={item.url}>
                  {item.title}
                </a>
              )
            }
            return false;
          })}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default CustomNavbar;
