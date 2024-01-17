import React, { useEffect, useState } from 'react';
import { useAuthContext } from "../../hooks/useAuthContext";

const AddProgram = () => {
  const [temporaryHour, setTemporaryHour] = useState("")
  const [existingThemes, setExistingThemes] = useState([])
  const [chosenThemes, setChosenThemes] = useState([])
  const [customTheme, setCustomTheme] = useState("")
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState(0);
  const [minPersons, setMinPersons] = useState(0);
  const [maxPersons, setMaxPersons] = useState(0);
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [theme, setTheme] = useState([]);
  const [day, setDay] = useState('');
  const [hours, setHours] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/api/program/theme", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      setExistingThemes(json)
    };
    if (user) {
      fetchData();
    }
  }, [user]);


  const handleAddHour = (e) => {
    e.preventDefault()
    if (!hours.includes(temporaryHour)){
        setHours([...hours, temporaryHour])
        setTemporaryHour("")
    }
  }


 const handleAddTheme = (e) => {
    e.preventDefault()
    if(customTheme && !theme.includes(customTheme)){
        setTheme([...theme, customTheme])
        setCustomTheme("")
    }
    else if (chosenThemes && !theme.includes(chosenThemes)){
        console.log(chosenThemes);
        setTheme([...theme, ...chosenThemes])
        setChosenThemes([])
    }
  }


  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3500/api/program/add", {
        method: "POST", // Assuming you are sending data as a POST request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name,
          description,
          img,
          price,
          persons: { min: minPersons, max: maxPersons },
          location: { county, city, address },
          theme,
          date: [{ day, hours }],
        }),
      });
      if (response.ok) {
        console.log(response);
        try {
          const response = await fetch("http://localhost:3500/api/program/theme/add", {
            method: "POST", // Assuming you are sending data as a POST request
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }, body: JSON.stringify({
              themes: theme
            })
          })
          const json = await response.json();
          if (response.ok){
            console.log(json);
          }
        } catch (error){
          console.log(error);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
    
  }
  
  return (
    <div className='addProgram-container'>
        <h2>Program felvétele</h2>
        <form onSubmit={handleSubmit}>

            <label htmlFor="name">Név:</label>
            <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}/>


            <label htmlFor="description">Leírás</label>
            <input type="text"
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}/>

            {/*KÉP(TODO)*/}

            <label htmlFor="img">Kép</label>
            <input type="file"
            id='img'
            value={img}
            onChange={(e) => setImg(e.target.value)}/>


            <label htmlFor="price">Ár</label>
            <input type="number"
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}/>


            <h3>Személyek</h3>
            <label htmlFor="min">Min</label>
            <input type="number"
            id='min'
            value={minPersons}
            onChange={(e) => setMinPersons(e.target.value)}/>


            <label htmlFor="max">max</label>
            <input type="number"
            id='max'
            value={maxPersons}
            onChange={(e) => setMaxPersons(e.target.value)}/>


            <h3>Hely</h3>
            <label htmlFor="county">Megye</label>
            <input type="text"
            id='county'
            value={county}
            onChange={(e) => setCounty(e.target.value)}/>


            <label htmlFor="city">Város</label>
            <input type="text"
            id='city'
            value={city}
            onChange={(e) => setCity(e.target.value)}/>


            <label htmlFor="address">Cím</label>
            <input type="text"
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}/>


            <label htmlFor="theme">Témák</label>
            <p>Hozzáadott témák:</p>
            {theme.map((element) => (
                <p>{element}</p>
            ))}
           <select id="theme"
           multiple
           value={chosenThemes}
           onChange={(e) => setChosenThemes(Array.from(e.target.selectedOptions, (option) => option.value))}>
           <option value="" disabled>Válassz témát...</option>
            {existingThemes.map((t) => (
                <option key={t} value={t}>{t}</option>
            ))}
           </select>
            <input type="text"
            placeholder='vagy adj meg egy sajátot'
            value={customTheme}
            onChange={(e) => setCustomTheme(e.target.value)}/>
            <button type='button' onClick={handleAddTheme}>Téma hozzáadása</button>


            <label htmlFor="day">Nap</label>
            <input type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}/>


            {day ? (
                <>
                    <p>Időpontok hozzáadva: {hours.map((hour) => (
                        <p>{hour}</p>
                    ))}</p>
                    <label htmlFor="hours"></label>
                    <input type="text"
                    placeholder='Adj meg egy dátumot, vagy egy időintervallumot'
                    value={temporaryHour}
                    onChange={(e) => setTemporaryHour(e.target.value)}/>
                    <button type='button' onClick={handleAddHour}>Óra hozzáadása</button>
                </>
            ) : (null)}
            <button type="submit">Hozzáadás</button>
        </form>
    </div>
  );


}
export default AddProgram