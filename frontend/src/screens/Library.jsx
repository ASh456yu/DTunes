import { useEffect, useState } from "react"
import "../styles/Library.css"
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { IconContext } from "react-icons";
import { IoMdPlay } from "react-icons/io";
import axios from "axios";

function Library({ func, currentSongId }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [csrfToken, setCsrfToken] = useState('');
  const [songs, setSongs] = useState([])
  const [query, setQuery] = useState("")

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
    fetchSongs()
  }, [query])

  const fetchSongs = async () => {
    try {
      const response = await axios.post(`${apiUrl}/songmanage/search/`,
        {
          query: query
        }, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      setSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }

  const handleOnClick = (song_id) => {
    func(song_id)
  }

  const handleOnKeyUp = (e) => {
    if (e.key == "Enter") {
      setQuery(e.target.value);
    }
  }


  return (
    <div className="screen-container library">
      <input type="text" name="search" className="search-box" onKeyUp={handleOnKeyUp} />
      <div className="songs-cards">
        {songs.map((song, index) => {
          return (<div key={index + 1} className="song-card">
            <div className="song-title">{song.song_title}</div>
            <div className="song-artist">by {song.song_artist}</div>
            <div className="action-buttons">
              <IconContext.Provider value={{ size: "30px", className: "library-icon" }}>
                <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <MdOutlinePlaylistAdd style={{ color: "black" }} />
                </button>
              </IconContext.Provider>
              <IconContext.Provider value={{ size: "30px", className: "library-icon" }}>
                <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <IoMdPlay style={{ color: "black" }} onClick={() => handleOnClick(song.id)} />
                </button>
              </IconContext.Provider>
            </div>
          </div>)
        })
        }
        <div >
        </div>
      </div>
    </div>
  )
}

export default Library
