import "./sidebar.css"
import SidebarButton from "./SidebarButton"
import "./sidebarButton.css"
import { MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa"
import { IoLibrary } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { PiPlaylistFill } from "react-icons/pi"


function Sidebar() {
    return (
        <div className="sidebar-container">
            <img src="#" alt="profile" className="profile-img" />
            <div>
                <SidebarButton title="Library" to="/" icon={<IoLibrary />}></SidebarButton>
                <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />}></SidebarButton>
                <SidebarButton title="Playlist" to="/playlist" icon={<PiPlaylistFill />}></SidebarButton>
                {/* <SidebarButton title="Player" to="/player" icon={<FaPlay />}></SidebarButton> */}
                {/* <SidebarButton title="Favourites" to="/favourites" icon={<MdFavorite />}></SidebarButton> */}
            </div>
            <SidebarButton title="Sign Out" to="/logout" icon={<FaSignOutAlt />}></SidebarButton>
        </div>
    )
}

export default Sidebar
