import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const AddProgram = () => {
  const [temporaryHour, setTemporaryHour] = useState("");
  const [existingThemes, setExistingThemes] = useState([]);
  const [chosenThemes, setChosenThemes] = useState([]);
  const [customTheme, setCustomTheme] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [price, setPrice] = useState(0);
  const [minPersons, setMinPersons] = useState(0);
  const [maxPersons, setMaxPersons] = useState(0);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [theme, setTheme] = useState([]);
  const [day, setDay] = useState("");
  const [hours, setHours] = useState([]);
  const [date, setDate] = useState({})
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/api/program/theme", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      setExistingThemes(json);
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddDate = (e) =>{
    e.preventDefault();

    if (day){
      setDate(...date, day)
    }
    setDay(" ")
  }

  const handleAddHour = (e) => {
    e.preventDefault();
    if (temporaryHour &&!hours.includes(temporaryHour) ) {
      setHours([...hours, temporaryHour]);
      setTemporaryHour("");
    }
  };

  const handleAddTheme = (e) => {
    e.preventDefault();
    if (customTheme && customTheme != " " && !theme.includes(customTheme)) {
      console.log(customTheme);
      setTheme([...theme, customTheme]);
      setCustomTheme("");
      return;
    }

    if (chosenThemes && !theme.includes(chosenThemes)) {
      const updatedExistingThemes = existingThemes.filter(
        (t) => !chosenThemes.includes(t)
      );
      setTheme([...theme, ...chosenThemes]);
      setExistingThemes(updatedExistingThemes);
      setChosenThemes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        "http://localhost:3500/api/program/img/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const image = await response.json();
        try {
          const response = await fetch(
            "http://localhost:3500/api/program/add",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                name,
                description,
                img: {
                  id: image.asset_id,
                  url: image.url,
                },
                price,
                persons: { min: minPersons, max: maxPersons },
                location: { county, city, address },
                theme,
                date: [{ day, hours }],
              }),
            }
          );
          if (response.ok) {
            console.log(response);
            try {
              const response = await fetch(
                "http://localhost:3500/api/program/theme/add",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                  body: JSON.stringify({
                    themes: theme,
                  }),
                }
              );
              const json = await response.json();
              if (response.ok) {
                console.log(json);
              }
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTemporaryHour("");
      setChosenThemes([]);
      setCustomTheme("");
      setName("");
      setDescription("");
      setImageFile({});
      setPrice(0);
      setMinPersons(0);
      setMaxPersons(0);
      setCounty("");
      setCity("");
      setAddress("");
      setTheme([]);
      setDay("");
      setHours([]);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <div className="addProgram-container">
      <div className={isUploading ? "loading" : "notLoading"}>
        <h2>Program felvétele</h2>
        <form className="addProgram" onSubmit={handleSubmit}>
          <div id="name">
            <label htmlFor="name">Név: &nbsp;</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div id="description">
            <label htmlFor="description">Leírás:</label>
            <textarea
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="img">
            <label htmlFor="img"><h3>Kép:</h3></label>
            <input type="file" id="img" onChange={handleImageChange} />
          </div>

          <div id="price">
            <label htmlFor="price"><h3>Ár:</h3></label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div id="persons">
            <h3>Személyek:</h3>
            <label htmlFor="min">Min</label>
            <input
              type="number"
              id="min"
              value={minPersons}
              onChange={(e) => setMinPersons(e.target.value)}
            />

            <label htmlFor="max">max</label>
            <input
              type="number"
              id="max"
              value={maxPersons}
              onChange={(e) => setMaxPersons(e.target.value)}
            />
          </div>

          <div id="location">
            <h3>Hely</h3>
            <label htmlFor="county">Megye</label>
            <input
              type="text"
              id="county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />

            <label htmlFor="city">Város</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <label htmlFor="address">Cím</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div id="themes">
            <label htmlFor="theme"><h3>Témák</h3></label>
            <p>Hozzáadott témák:</p>
            <div>
              {theme.map((element, index, array) => (
                <React.Fragment key={index}>
                  <span>{element}</span>
                  {index !== array.length - 1 && <span>,&nbsp;</span>}
                </React.Fragment>
              ))}
            </div>
            <select
              id="theme"
              multiple
              value={chosenThemes}
              onChange={(e) =>
                setChosenThemes(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              <option value="" disabled>
                Válassz témát...
              </option>
              {existingThemes.sort().map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="vagy adj meg egy sajátot"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
            />
            <button
              disabled={isUploading}
              type="button"
              onClick={handleAddTheme}
            >
              Téma hozzáadása
            </button>
          </div>

          <div id="date">
            <label htmlFor="day">Nap</label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />

            {day ? (
              <>
              
                <label htmlFor="hours"></label>
                <input
                  type="time"            
                  value={temporaryHour}
                  onChange={(e) => setTemporaryHour(e.target.value)}
                />
                <button
                  disabled={isUploading}
                  type="button"
                  onClick={handleAddHour}
                >
                  Óra hozzáadása
                </button>
                <div id="addedHours">
                  <p>
                    Időpontok hozzáadva:&nbsp; {" "}
                    {hours.map((hour) => (
                      <p>{hour}, &nbsp;</p>
                    ))}
                  </p>
              </div>
              <button type="button">Nap felvétele</button>

              </>
            ) : null}
          </div>
          <div id="submitButton">
            <button disabled={isUploading} type="submit">
              Hozzáadás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProgram;
