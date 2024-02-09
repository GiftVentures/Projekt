import React, { useEffect } from 'react'
import videoBg from '../../video/main.mp4'
import './Main.css'

const Main = () => {

  useEffect(() => {
    let vid = document.getElementById("bgvideo");
    

    const handleTimeUpdate = () => {
      if(vid.currentTime > 7){
        vid.playbackRate = 2
      }
      if (vid.currentTime > 21) {
        vid.pause();
        vid.removeEventListener("timeupdate", handleTimeUpdate);
      }

    };
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className='main'>
      <div className='overlay'></div>
      <video id='bgvideo' src={videoBg} autoPlay muted/>
      <div className='content'>
        <h1>Üdvözlünk a GiftVentures oldalán!</h1>
        <p>~Életre szóló élmények~</p>
      </div>
    </div>
  )
}

export default Main