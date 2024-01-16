import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUserdataContext } from "../hooks/useUserdataContext";
import UpdateUserdata from '../components/UpdateUserdata'
import AccessDenied from "../components/AccessDenied";

const Profile = () => {
  const { user } = useAuthContext();
  const { userdata, dispatch } = useUserdataContext();
  const [isUpdating, setIsUpdating] = useState(false);

  function Editing() {
    setIsUpdating((prev) => !prev);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/api/user/data", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      

      if (response.ok) {
        dispatch({ type: "GET_USERDATA", payload: json });
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user, userdata]);

  if(!user){
    return <AccessDenied />
  }

  return (
    <div>
      {isUpdating ? (
        <div>
          <button onClick={Editing}>Vissza</button>
          <UpdateUserdata />
        </div>
      ) : (
        <div>
          {userdata ? (
            <div>
              <h2>Profil</h2>
              <table>
                <tr>
                  <td>Név:</td>
                  <td>{userdata.secondName + " " + userdata.firstName}</td>
                </tr>
                <tr>
                  <td>Email-cím:</td>
                  <td>{userdata.email}</td>
                </tr>
                <tr>
                  <td>Mobil:</td>
                  <td>{userdata.mobile}</td>
                </tr>
                <tr>
                  <td>Születési dátum:</td>
                  <td>{userdata.birthDate}</td>
                </tr>
                <tr>
                  <td>Születési hely:</td>
                  <td>{userdata.placeOfBirth}</td>
                </tr>
                <tr>
                  <td>Cím:</td>
                  <td>{userdata.address}</td>
                </tr>
              </table>
              <button onClick={Editing}>Adatok megváltoztatása</button>
              
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;
