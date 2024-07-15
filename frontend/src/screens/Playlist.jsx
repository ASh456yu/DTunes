import "../styles/Playlist.css"
import { MdDelete } from "react-icons/md";
import { IconContext } from "react-icons"
import { SlOptionsVertical } from "react-icons/sl"
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { FaRegEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function Playlist() {
    const apiUrl = import.meta.env.VITE_API_URL;
    let [csrfToken, setCsrfToken] = useState('');
    const [isEditable, setIsEditable] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
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
        fetchPlaylist()
    }, [])

    const handleNav = (query) => {
        navigate(`/playlist/${query}`)
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


    const handleAddPlaylist = async () => {
        if (playlists.length < 7) {
            try {
                const response = await axios.post(`${apiUrl}/songmanage/create_playlist/`, {}, {
                    headers: {
                        "X-CSRFToken": csrfToken
                    },
                    withCredentials: true
                });
                if (response.data.status === "ok") {
                    console.log("Playlist created successfully!");
                    fetchPlaylist()
                } else {
                    console.error("Error creating playlist:", response.data.message);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    };

    const handleClick = (key) => {
        const copyArr = [...isEditable];
        copyArr.forEach((index, x) => {
            if (x != key) {
                copyArr[x] = false;
            } else {
                copyArr[x] = true;
            }
        })
        setIsEditable(copyArr);
    }

    const handleOnChange = (index, e) => {
        const copyPlaylists = [...playlists];
        copyPlaylists[index].playlist_name = e.target.value;
        setPlaylists(copyPlaylists);
    }

    const handleOnKeyUp = async (index, e, playlist_id) => {
        if (e.key == "Enter") {
            const copyEditable = [...isEditable]
            copyEditable[index] = false
            try {
                const response = await axios.post(`${apiUrl}/songmanage/update_playlist/`, {
                    name: e.target.value,
                    id: playlist_id
                }, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                if (response.data.status === "ok") {
                    console.log("Name Change Success");
                } else {
                    console.log("Name Change Fail", response.data.error);
                }
            } catch (error) {
                console.error("Error updating playlist name:", error);
            }
            setIsEditable(copyEditable)
            fetchPlaylist()
        }
    }

    const handleDeletePlaylist = async (playlist_id) => {
        try {
            const response = await axios.post(`${apiUrl}/songmanage/delete_playlist/`, {
                id: playlist_id
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.status === "ok") {
                console.log("Playlist deletion Success");
                fetchPlaylist()
            } else {
                console.log("Playlist deletion Fail", response.data.error);
            }
        } catch (error) {
            console.error("Error Playlist deletion :", error);
        }
    }


    return (
        <div className="screen-container" >
            <IconContext.Provider value={{ size: "50px", className: "add-playlist" }}>
                <button onClick={handleAddPlaylist} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <IoAddCircleOutline />
                </button>
            </IconContext.Provider>
            <div className="playlist">
                {playlists.map((playlist, index) => {
                    return (
                        <div key={index} className="playlists">
                            {isEditable[index] ? <input
                                type="text"
                                className="input-playlist"
                                onChange={(e) => handleOnChange(index, e)} value={playlist.playlist_name}
                                onKeyUp={(e) => handleOnKeyUp(index, e, playlist.id)}
                            />
                                : <p className="playlist-name">
                                    {playlist.playlist_name}
                                </p>}
                            <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                                <div>
                                    <button onClick={() => handleDeletePlaylist(playlist.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        <SlOptionsVertical />
                                    </button>
                                    <div className="view-more">
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={() => handleDeletePlaylist(playlist.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <MdDelete /> Delete
                                            </button>
                                        </IconContext.Provider>
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={()=>{handleNav(playlist.id)}} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <FaRegEye /> View
                                            </button>
                                        </IconContext.Provider>
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={() => handleClick(index)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <FaPen /> Rename
                                            </button>
                                        </IconContext.Provider>
                                    </div>
                                </div>
                            </IconContext.Provider>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Playlist
