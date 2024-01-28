import React, { useState, useEffect } from "react";
import jsonData from "../data/megyek.json";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  const [minPersons, setMinPersons] = useState(0);
  const [maxPersons, setMaxPersons] = useState(100);

  const [maxPrice, setMaxPrice] = useState(1000000);

  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 

  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [counties, setCounties] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const countyNames = Object.keys(jsonData.megyek);
    setCounties(countyNames);
    setFilteredCounties(countyNames);
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/program/get");
        if (response.ok) {
          const programsData = await response.json();
          setPrograms(programsData);
          setFilteredPrograms(programsData);
        } else {
          console.error("Failed to fetch programs");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    

    const fetchThemes = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/program/theme");
        if (response.ok) {
          const themesData = await response.json();
          setThemes(themesData);
        } else {
          console.error("Failed to fetch themes");
        }
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };

    fetchPrograms();
    fetchThemes();
  }, []);

  const handleCitySelection = (selectedCity) => {
    setCity(selectedCity);
  };

  const handleCountySelection = (selectedCounty) => {
    setCounty(selectedCounty);

    const citiesOfSelectedCounty = jsonData.megyek[selectedCounty].telepulesek;
    setCities(citiesOfSelectedCounty);
  };

  const handleThemeChange = (theme) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(
        selectedThemes.filter((selectedTheme) => selectedTheme !== theme)
      );
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  const handleSearch = () => {
    setFilteredPrograms(
      programs.filter(
        (program) =>
          program.persons.min >= minPersons &&
          program.persons.max <= maxPersons &&
          program.price <= maxPrice && // Árszűrés
          (selectedThemes.length === 0 ||
            selectedThemes.some((selectedTheme) =>
              program.theme.includes(selectedTheme)
            )) &&
          // Dátumszűrés
          (!startDate || program.date.some(date => date.day >= startDate)) &&
          (!endDate || program.date.some(date => date.day <= endDate)) &&
          (!county || program.location.county === county) && // Megye szűrés
          (!city || program.location.city === city) // Város szűrés
      )
    );
    setSearchClicked(true);
  };

  const handleReset = () => {
    setMinPersons(0);
    setMaxPersons(100);
    setMaxPrice(1000000);
    setSelectedThemes([]);
    setStartDate("");
    setEndDate("");
    setSearchClicked(true);
    setCounty("")
    setCity("")
    setFilteredPrograms(programs); 
  };

  return (
    <div className="program-container">
      <div className="filters">
        <div className="themes">
          {themes.sort().map((theme, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={theme}
                checked={selectedThemes.includes(theme)}
                onChange={() => handleThemeChange(theme)}
              />
              <label>{theme}</label>
            </div>
          ))}
        </div>
        <div className="persons">
          <label>Minimális főszám:</label>
          <input
            type="number"
            value={minPersons}
            min={1}
            onChange={(e) => setMinPersons(parseInt(e.target.value))}
          />
          <label>Maximális főszám:</label>
          <input
            type="number"
            value={maxPersons}
            min={2}
            onChange={(e) => setMaxPersons(parseInt(e.target.value))}
          />
        </div>
        <div className="price">
          <label>Maximális ár (Ft/Fő):</label>
          <input
            type="number"
            value={maxPrice}
            min={0}
            step={1000}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          />
        </div>
        <div className="dates">
          <label>Kezdő dátum:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>Befejező dátum:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="location">
            <label htmlFor="county">Vármegye</label>
            <select
              id="county"
              value={county}
              onChange={(e) => handleCountySelection(e.target.value)}
            >
              <option value="" disabled>
                Válassz vármegyét...
              </option>
              {filteredCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>

            <label htmlFor="city">Város</label>
            <select
              id="city"
              value={city}
              disabled = {!county}
              onChange={(e) => handleCitySelection(e.target.value)}
            >
              <option value="" >
                Bármi
              </option>
              {
                cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        <div className="buttons">
          <button onClick={handleReset}>Visszaállítás</button>
          <button onClick={handleSearch}>Keresés</button>
        </div>
      </div>
      <div className="programs">
        <h2>Programok</h2>
        {filteredPrograms.map((program) => (
          <div className="program" key={program.id}>
            <h3>{program.name}</h3>
            <img src={program.img.url} alt="kép a programról" />
            <div className="programDetails">
              <div>
                <p>Fő: </p>
                <p>
                  {program.persons.min} - {program.persons.max}
                </p>
              </div>
              <div>
                <p>Hely:</p>
                <p>
                  {program.location.county} vármegye, &nbsp;{program.location.city},&nbsp;
                  {program.location.address}
                </p>
              </div>
              <div>
                <p>Ár:</p>
                <p>{program.price} Ft/fő</p>
              </div>           
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
