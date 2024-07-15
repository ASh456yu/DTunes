import "./songplayer.css"
import { MdOutlinePlayCircleOutline, MdOutlinePauseCircle } from "react-icons/md";
import { IconContext } from "react-icons";
import { useState, useRef, useEffect } from "react";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function songplayer({ songId, handlePlay, skipAudio, rewindAudio, songName, iconPlay }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const handleNav = () => {
        navigate("/player")
    }
    return (
        <div className="song-player">
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                {iconPlay === "play" ? <MdOutlinePauseCircle onClick={handlePlay} style={{ color: "black" }} /> : <MdOutlinePlayCircleOutline style={{ color: "black" }} onClick={handlePlay} />}
            </IconContext.Provider>
            <div className="song-player-title" onClick={handleNav}>
                <p>{songName.song_title}</p>
            </div>
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                <FaBackwardStep style={{ color: "black" }} onClick={rewindAudio} />
            </IconContext.Provider>
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                <FaForwardStep style={{ color: "black" }} onClick={skipAudio} />
            </IconContext.Provider>
        </div>
    )
}

export default songplayer
