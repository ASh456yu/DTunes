import "../styles/IndividualP.css"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

function IndividualP() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const [csrfToken, setCsrfToken] = useState('');
    const [psongs, setPSongs] = useState({ playlist_s: [], nplaylist_s: [] });
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
        const fetchPlaylistSongs = async (usr_playlist_id) => {
            try {
                const response = await axios.post(`${apiUrl}/songmanage/send_playlist_songs/`, {
                    playlist_id: usr_playlist_id
                }, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                if (response.data.status === "ok") {
                    console.log("Fetching Playist data Success");
                    setPSongs(response.data.playlist_song);
                } else {
                    console.log("Fetching Playist data Fail", response.data.error);
                }
            } catch (error) {
                console.error("Error fetching playlists data:", error);
            }
        }
        fetchCSRFtoken();
        fetchPlaylistSongs(id)
    }, [id]);

    return (
        <div className="screen-container individualP">
            <div className="added_to_playlist">
                <h1>Added to playlist</h1>
                {psongs.playlist_s && psongs.playlist_s.length > 0 ? (
                    psongs.playlist_s.map((psong, ind) => (
                        <h4 key={ind}>{psong.song_name}</h4>
                    ))
                ) : (
                    <p>No songs found</p>
                )}
            </div>
            <div className="nadded_to_playlist">
                <h1>More songs you would like</h1>
                {psongs.nplaylist_s && psongs.nplaylist_s.length > 0 ? (
                    psongs.nplaylist_s.map((psong, ind) => (
                        <h4 key={ind}>{psong.song_name}</h4>
                    ))
                ) : (
                    <p>No songs found</p>
                )}
            </div>
        </div>
    )
}

export default IndividualP
