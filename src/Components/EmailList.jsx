import React, { act, useEffect, useState } from "react";
import "../styles/EmailList.css";
import axios from "axios";
import EmailDetails from "./EmailDetails";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const EmailList = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [emailBody, setEmailBody] = useState(null);
  const [activeButton, setActiveButton] = useState("unread");
  const [loading, setLoading] = useState(true);

  const filterEmails = async (filterType) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const reads = JSON.parse(localStorage.getItem("reads")) || [];

    try {
      const { data } = await axios.get(
        `https://flipkart-email-mock.vercel.app/`
      );
      const filteredEmails = data.list.filter((email) => {
        if (filterType === "favorites") return favorites.includes(email.id);
        if (filterType === "read") return reads.includes(email.id);
        return !reads.includes(email.id);
      });
      setEmails(filteredEmails);
    } catch (error) {
      console.error("Error fetching the email data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleButtonClick(activeButton);
  }, [1]);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    filterEmails(buttonType);
  };

  const OpenDetailFun = (item) => {
    const reads = JSON.parse(localStorage.getItem("reads")) || [];
    if (!reads.includes(item.id)) {
      reads.push(item.id);
      localStorage.setItem("reads", JSON.stringify(reads));
    }
    setOpenDetails(true);
    setEmailBody(item);
  };

  const ExtractDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()} ${date.toLocaleTimeString()}`;
  };

  const GetTruncatedSubject = (subject) => {
    if (subject.length <= 50) return subject;
    return openDetails
      ? subject.slice(0, 40) + "..."
      : subject.slice(0, 250) + "...";
  };

  return (
    <div className="email-list-container">
      <div className="email-list-content">
        <div className="filter-email-btns">
          <p>Filter By:</p>
          {["unread", "read", "favorites"].map((type) => (
            <button
              key={type}
              onClick={() => handleButtonClick(type)}
              style={
                activeButton === type
                  ? { background: "#e1e4ea", border: "1px solid #cfd2dc" }
                  : {}
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner">
            <CircularProgress
              style={{ color: "#cfd2dc", marginTop: "300px" }}
            />
          </div>
        ) : (
          <div className="email-fullpage">
            <div className={!openDetails ? "email-list" : "email-division"}>
              {emails.map((item) => (
                <div
                  key={item.id}
                  className="one-mail"
                  onClick={() => OpenDetailFun(item)}
                  style={{
                    background: JSON.parse(
                      localStorage.getItem("reads")
                    )?.includes(item.id)
                      ? "white"
                      : "#f2f2f2",
                  }}
                >
                  <div className="one-mail-logo">
                    <p>{item.from.name[0].toUpperCase()}</p>
                  </div>
                  <div className="one-email-data">
                    <div className="from">
                      From: <span>{item.from.name}</span>{" "}
                      <span>&lt;{item.from.email}&gt;</span>
                    </div>
                    <div className="subject">
                      Subject: <span>{item.subject}</span>
                    </div>
                    <div className="short-description">
                      {GetTruncatedSubject(item.short_description)}
                    </div>
                    <div className="date-time-fav">
                      <div className="date-time">
                        {ExtractDateTime(item.date)}
                      </div>
                      {JSON.parse(localStorage.getItem("favorites"))?.includes(
                        item.id
                      ) && <div className="fav">Favorite</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {openDetails && (
              <div className="email-details">
                <div
                  className="close-btn"
                  onClick={() => setOpenDetails(false)}
                >
                  <CancelOutlinedIcon />
                </div>
                <EmailDetails emailBody={emailBody} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
