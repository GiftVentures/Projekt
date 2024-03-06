import React from 'react';
import '../components/About.css'; 
import TeamCard from '../components/TeamCard.jsx';

const About = () => {
  return (
    <div className='about-container'>
      <div className='about-header'>
        <h1>Rólunk</h1>
      </div>
      <div className='about-team-cards'>
        <TeamCard 
          name="Hódi Richárd"
          position="Backend"
          image="ricsi.png"
          socialLinks={[
            { icon: 'fab fa-facebook', link: '#' },
            { icon: 'fab fa-instagram', link: '#' },
            { icon: 'fas fa-envelope', link: '#' }
          ]}
        />
        <TeamCard 
          name="Szabó Korinna"
          position="Frontend"
          image="kori.jpeg"
          socialLinks={[
            { icon: 'fab fa-facebook', link: '#' },
            { icon: 'fab fa-instagram', link: '#' },
            { icon: 'fas fa-envelope', link: '#' }
          ]}
        />
        <TeamCard 
          name="Briják Ádám"
          position="Dokumentáció"
          image="adam.jpg"
          socialLinks={[
            { icon: 'fab fa-facebook', link: '#' },
            { icon: 'fab fa-instagram', link: '#' },
            { icon: 'fas fa-envelope', link: '#' }
          ]}
        />
      </div>
    </div>
  );
}

export default About;
