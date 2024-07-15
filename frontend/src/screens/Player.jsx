import { useState, useRef, useEffect } from "react";
import "../styles/Player.css"
import { IconContext } from "react-icons"
import { FaPlay, FaPause } from "react-icons/fa"
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { IoShuffle, IoRepeat, IoAddCircleOutline, IoAddCircleSharp } from "react-icons/io5"
import { BsRepeat1 } from "react-icons/bs"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi"
import { MdFavorite, MdFavoriteBorder, MdOutlinePlaylistAdd, MdOutlinePlaylistAddCheck } from "react-icons/md"
import axios from "axios";


function Player({
    songId,
    handlePlay,
    skipAudio,
    rewindAudio,
    songName,
    iconPlay,
    iconExcess,
    handleDLike,
    handleLike,
    handleExcessControl,
    handleAddToPlaylist,
    widthl,
    playlists,
    usrInfo
}) {

    const handlePlaylist = () => {
        if (document.getElementById("all-playlists").style.display == "none") {
            document.getElementById("all-playlists").style.display = "flex"
        } else {
            document.getElementById("all-playlists").style.display = "none"
        }
    }
    return (
        <div className="screen-container player">
            <div className="song-info">
                <img src="/musiclogo.jpg" alt="Song Picture" className="song-img" />
            </div>
            <h2 className="song-title">
                {songName.song_title}
            </h2>
            <h3 className="song-artist">
                {songName.song_artist}
            </h3>
            <div className="progress-bar-back">
                <div className="progress-bar-progress" style={{ width: `${widthl}%` }}></div>
            </div>
            <div className="audio-control">
                <div className="excess-control">
                    <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                        {songId != null && usrInfo.likedSongs.indexOf(songId) === -1 ? <BiLike onClick={() => { handleLike(songId, true) }} /> : <BiSolidLike onClick={() => { handleLike(songId, false) }} />}
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                        {songId != null && usrInfo.dlikedSongs.indexOf(songId) === -1 ? <BiDislike onClick={() => { handleDLike(songId, true) }} /> : <BiSolidDislike onClick={() => { handleDLike(songId, false) }} />}
                    </IconContext.Provider>
                </div>
                <div className="main-control">
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        <FaBackwardStep onClick={rewindAudio} />
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        {iconPlay === "play" ? <FaPause onClick={handlePlay} /> : <FaPlay onClick={handlePlay} />}
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        <FaForwardStep onClick={skipAudio} />
                    </IconContext.Provider>
                </div>

                <div className="excess-control">
                    <IconContext.Provider value={{ size: "25px", className: "play-icon" }} >
                        {iconExcess === "repeat one" ? <BsRepeat1 onClick={handleExcessControl} /> : iconExcess === "no repeat" ? <IoRepeat onClick={handleExcessControl} /> : <IoShuffle onClick={handleExcessControl} />}
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "25px", className: "play-icon" }} >
                        <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={handlePlaylist}>
                            <MdOutlinePlaylistAdd />
                        </button>
                        <div className="all-playlists" id="all-playlists">
                            {playlists.map((plist, index) => {
                                if (songId != null && songName.song_playlist.indexOf(plist.id) != -1) {
                                    return (
                                        <button className="all-playlists-btn" key={index} onClick={() => { handleAddToPlaylist(songId, plist.id, "delete_from_playlist") }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                            {plist.playlist_name}
                                        </button>
                                    )
                                } else if (songId != null) {
                                    return (
                                        <button className="all-playlists-btn" key={index} onClick={() => { handleAddToPlaylist(songId, plist.id, "add_to_playlist") }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "grey" }}>
                                            {plist.playlist_name}
                                        </button>
                                    )
                                }
                            })}
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default Player
