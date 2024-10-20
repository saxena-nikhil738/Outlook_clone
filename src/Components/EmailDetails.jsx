import axios from "axios";
import "../styles/EmailDetails.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const EmailDetails = ({ emailBody }) => {
  // console.log(emailBody);
  const location = useLocation();
  // const emailBody = location.state?.item;
  const navigate = useNavigate();
  const parem = useParams();
  console.log(parem);
  const [emailFullBody, setEmailFullBody] = useState();
  const [loading, setLoading] = useState(true);

  const id = emailBody?.id;
  const subject = emailBody?.subject;
  const dateTime = emailBody?.date;
  const name = emailBody?.from.name || "";

  const markedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
  const [marked, setMarked] = useState(markedFavs.includes(id));

  useEffect(() => {
    const updatedMarkedFavs =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setMarked(updatedMarkedFavs.includes(id));
  }, [id]);

  useEffect(() => {
    async function getEmailBody() {
      try {
        const response = await axios.get(
          `https://flipkart-email-mock.vercel.app/?id=${id}`,
          {
            Headers: {
              id: id,
            },
          }
        );
        setEmailFullBody(response.data.body);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getEmailBody();
  }, [marked, id]);

  const ExtractDateTime = (e) => {
    const date = new Date(e);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const formattedTime = date.toLocaleTimeString();

    const dateTime = `${formattedDate} ${formattedTime}`;
    return dateTime;
  };

  if (loading) {
    return (
      <div className="spinner">
        <CircularProgress
          style={{
            color: "#cfd2dc",
            marginTop: "330px",
          }}
        />
      </div>
    );
  }

  const markFavorite = async (id) => {
    try {
      // Create API to mark as favorite by post request with id
      // const response = await axios.post(`api`, {id});
      // if(response.success){
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.includes(id)) return;
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setMarked(true);

      toast.success("Makred as favorite", { autoClose: 1000 });
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const removeFavorite = async (id) => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = favorites.filter((favId) => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setMarked(false);
      toast.success("Removed from favorites", { autoClose: 1000 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="email-details-content">
      <div className="email-details-logo">{name[0]?.toUpperCase()}</div>
      <div className="email-details-data">
        <div className="fav-btn">
          {marked ? (
            <button onClick={(e) => removeFavorite(id)}>
              Remove from favorites
            </button>
          ) : (
            <button onClick={(e) => markFavorite(id)}>Mark as favorite</button>
          )}
        </div>
        <div className="email-details-head">
          <div className="email-details-subject">{subject}</div>
          <div className="email-details-datetime">
            {ExtractDateTime(dateTime)}
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: emailFullBody }}
          className="email-details-body"
        ></div>
      </div>
    </div>
  );
};

export default EmailDetails;
