import React, { useState, useEffect } from 'react';

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Fetch programs from the backend when the component mounts
    const fetchPrograms = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/program/get'); // Adjust the endpoint based on your backend route
        if (response.ok) {
          const programsData = await response.json();
          setPrograms(programsData);
        } else {
          console.error('Failed to fetch programs');
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  return (
    <div className='program-container'>
        <div className='filters'>

        </div>
        <div className='programs'>
        <h2>Programok</h2>
            {programs.map(program => (
                <div className='program'>
                    <img src={program.img.url} alt="kép a programról" />
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Programs;