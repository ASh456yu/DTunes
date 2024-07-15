import { useState, useRef, useEffect } from "react"
import "../styles/Home.css"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Library from "../screens/Library"
import Playlist from "../screens/Playlist"
import Trending from "../screens/Trending"
import Player from "../screens/Player"
import IndividualP from "../screens/IndividualP"
import Sidebar from "../components/sidebar/index"
import Songplayer from "../components/songplayer/index"
import axios from "axios"


function Home() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [songId, setSongId] = useState(null)
    const [csrfToken, setCsrfToken] = useState('');
    const [songName, setSongName] = useState({})
    const [iconPlay, setIconPlay] = useState("pause")
    const audioRef = useRef(null);
    const [iconExcess, setIconExcess] = useState("no repeat")
    const location = useLocation();
    const [widthl, setWidth] = useState(0);
    const [usrInfo, setUserInfo] = useState({})
    const [playlists, setPlaylists] = useState([]);
    const [isEditable, setIsEditable] = useState([]);


    useEffect(() => {
        if (songId != null) {
            const fetchCSRFtoken = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/csrf_token/`, {
                        withCredentials: true
                    });
                    const token = response.data.csrfToken;
                    setCsrfToken(token);
                    axios.defaults.headers.common['X-CSRFToken'] = token;
                } catch (error) {
                    console.error("Error fetching CSRF token:", error);
                }
            }
            fetchCSRFtoken();
            fetchSong()
            setIconPlay("pause")
        }

        fetchPlaylist()
        fetchUserData()
        const handleTimeUpdate = () => {
            if (audioRef.current && audioRef.current.duration) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                const newWidth = (currentTime / duration) * 100;
                setWidth(newWidth);
            }
        };

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [songId])

    const fetchSong = async () => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/send_song/`, {
                song_id: songId
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                setSongName(response.data.song);
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    }

    const fetchPlaylist = async () => {
        try {
            const response = await axios.get(`${apiUrl}/songmanage/send_playlist/`, {
                withCredentials: true
            });
            setPlaylists(response.data.playlists);
            setIsEditable(Array.from({ length: response.data.playlists.length }, () => false));
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/send_user_data/`, {}, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                setUserInfo(response.data.usrdata);
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    }

    

    
    const handlePlay = () => {
        if (iconPlay == "play" && audioRef.current) {
            setIconPlay("pause")
            audioRef.current.pause()
        } else if (iconPlay == "pause" && audioRef.current) {
            setIconPlay("play")
            audioRef.current.play()
        }
    }

    const rewindAudio = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            audioRef.current.currentTime = Math.max(0, currentTime - 5);
        }
    };

    const skipAudio = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            audioRef.current.currentTime = Math.min(audioRef.current.duration, currentTime + 5);
        }
    };

    const handleExcessControl = () => {
        if (iconExcess === "repeat one") {
            setIconExcess("shuffle")
            audioRef.current.loop = false
        } else if (iconExcess === "shuffle") {
            setIconExcess("no repeat")
            audioRef.current.loop = false
        } else if (iconExcess === "no repeat") {
            setIconExcess("repeat one")
            audioRef.current.loop = true
        }
    }

    const handleAddToPlaylist = async (song_id, playlist_id, addordel) => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/${addordel}/`, {
                song_id: song_id,
                playlist_id: playlist_id
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                console.log("Playlist changing Success");
                fetchUserData()
            } else {
                console.log("Playlist changing Fail", response.data.error);
            }
        } catch (error) {
            console.error("Error updating playlist:", error);
        }
    }

    const handleLike = async (song_id, addordel) => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/likes_manage/`, {
                song_id: song_id,
                add_or_del: addordel
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                console.log("Liked Song Success");
                fetchUserData()
            } else {
                console.log("Liked Song Fail", response.data.error);
            }
        } catch (error) {
            console.error("Error updating Liked Song:", error);
        }
    }

    const handleDLike = async (song_id, addordel) => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/dlikes_manage/`, {
                song_id: song_id,
                add_or_del: addordel
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                console.log("Disliked Song Success");
                fetchUserData()
            } else {
                console.log("Disliked Song Fail", response.data.error);
            }
        } catch (error) {
            console.error("Error updating Disliked Song:", error);
        }
    }

    function changeSong(params) {
        setSongId(params);
        fetchUserData()
    };

    return (
        <div className="main-body">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Library func={changeSong} currentSongId={songId} />} />
                <Route path="/playlist" element={<Playlist
                    func={changeSong}
                    currentSongId={songId}
                />} />
                <Route path="/trending" element={<Trending func={changeSong} currentSongId={songId} />} />
                <Route path="/player" element={<Player
                    func={changeSong}
                    songId={songId}
                    handlePlay={handlePlay}
                    rewindAudio={rewindAudio}
                    skipAudio={skipAudio}
                    songName={songName}
                    iconPlay={iconPlay}
                    iconExcess={iconExcess}
                    handleExcessControl={handleExcessControl}
                    handleAddToPlaylist={handleAddToPlaylist}
                    handleLike={handleLike}
                    handleDLike={handleDLike}
                    widthl={widthl}
                    playlists={playlists}
                    usrInfo={usrInfo}
                />} />
                <Route path="/playlist/:id" element={<IndividualP func={changeSong} currentSongId={songId} />} />
            </Routes>
            {songId != null && location.pathname !== '/player' && <Songplayer
                songId={songId}
                handlePlay={handlePlay}
                rewindAudio={rewindAudio}
                skipAudio={skipAudio}
                songName={songName}
                iconPlay={iconPlay}
            />}
            {songId != null && <audio ref={audioRef} src={`${apiUrl}/media/${songName.song}`} />}
        </div>
    )
}

export default Home