import React, { useState, useEffect } from 'react';
import videoBg from '../../video/main.mp4';
//import backgroundImage from '../../IMG/teki.jpg'; 
import { Link } from 'react-router-dom';
import './Main.css';
import Car from "../../IMG/sportcar.png";
import Sailboat from "../../IMG/sailboat01.png";
import Inside from "../../IMG/inside.png";
import Outside from "../../IMG/outside.png";
import Couple from "../../IMG/couple.png";
import Wellness from "../../IMG/wellness.png";
import Group from "../../IMG/group.png";
import Family from "../../IMG/family.png";
import Extreme from "../../IMG/extreme.png";
import Handmade from "../../IMG/handmade.png";
import Gastro from "../../IMG/gastro.png";
import Animal from "../../IMG/animal.png";

const Main = () => {
  const [text2, setText2] = useState('');
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 16000);

    setText2('');

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showText) {
      const fullText2 = "~Életre szóló élmények~";
      let currentIndex2 = -1;

      const textInterval2 = setInterval(() => {
        if (currentIndex2 === fullText2.length - 1) {
          clearInterval(textInterval2);
          document.querySelector('.content h2').style.border = 'none';
        } else {
          setText2(prevText => prevText + fullText2[currentIndex2]);
          currentIndex2++;
        }
      }, 100);

      return () => clearInterval(textInterval2);
    }
  }, [showText]);

  return (
    <div className='main'>
      <div className='overlay'></div>
      <video id='bgvideo' src={videoBg} autoPlay muted />
      <div className='content'>
        <h1>Üdvözlünk a GiftVentures oldalán!</h1>
        <h2>{text2}</h2>
        <h3 className='programs-header'>Programok</h3>
      </div>
      <div className='cards'>
        <a href= "Link" to='/programs?theme=autos'>
        <div className='card'>
        <img id="car" src={Car} alt='Program 1' />
            <h3>Autós Programok</h3>
          </div>
        </a>
        <Link to='/programs?theme=hajos'>
          <div className='card'>
            <img id="sailboat" src={Sailboat} alt='Program 2' />
            <h3>Hajós Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=kinti'>
          <div className='card'>
            <img id="outside" src={Outside} alt='Program 3' />
            <h3>Kültéri Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=hajos'>
          <div className='card'>
            <img id="inside" src={Inside} alt='Program 4' />
            <h3>Beltéri Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=paros'>
          <div className='card'>
          <img id="couple" src={Couple} alt='Program 5' />
            <h3>Páros Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=wellness'>
          <div className='card'>
          <img id="wellness" src={Wellness} alt='Program 6' />
            <h3>Wellness Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=csoportos'>
          <div className='card'>
          <img id="group" src={Group} alt='Program 7' />
            <h3>Csoportos Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=csaladi'>
          <div className='card'>
          <img id="family" src={Family} alt='Program 8' />
            <h3>Családi programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=extrem'>
          <div className='card'>
          <img id="extreme" src={Extreme} alt='Program 9' />
            <h3>Extrém Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=kezmuves'>
          <div className='card'>
          <img id="handmade" src={Handmade} alt='Program 8' />
            <h3>Kézműves Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=gasztronomia'>
          <div className='card'>
          <img id="gastro" src={Gastro} alt='Program 11' />
            <h3>Gasztronómia Programok</h3>
          </div>
        </Link>
        <Link to='/programs?theme=allat'>
          <div className='card'>
          <img id="animal" src={Animal} alt='Program 12' />
            <h3>Állatos Programok</h3>
          </div>
        </Link>
      </div>
      {/* <div className='parallax' style={{ backgroundImage: `url(${backgroundImage})` }}></div> */}
    </div>
  );
};

export default Main;
