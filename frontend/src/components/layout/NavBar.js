
// Components
import { NavLink, Link } from 'react-router-dom'
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from 'react-icons/bs';

// Hooks
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { logout, reset } from '../../slices/authSlice.js';

const NavBar = () => {
    const { auth } = useAuth();
    const { user } = useSelector((state) => state.auth);

    const [query, setQuery] = useState("")

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());

        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault()

        if (query) {
            return navigate(`/search?q=${query}`);
        }
    };

    return <nav className="flex justify-between items-center bg-[#000] border-b border-b-[#363636] px-[1em] py-[0.2em] z-10 fixed w-full top-0 left-0">
        <Link className="text-[#FAFAFA] no-underline text-[1.1em]" to="/">ReactGram</Link>
        <form className="relative h-[7vh] flex flex-col justify-center" onSubmit={handleSearch}>
            <BsSearch className="absolute left-[9px]" />
            <input className="h-[5vh] pl-[2.5em] border-none rounded-[5px] w-full m-0" type="text" placeholder="Pesquisar" onChange={(e) => setQuery(e.target.value)} />
        </form>
        <ul className="flex items-center m-0 p-0 list-none space-x-[1.1em]" id="nav-links">
            {auth ? (
                <>
                    <li>
                        <NavLink to="/">
                            <BsHouseDoorFill className="text-[1.6em]" />
                        </NavLink>
                    </li>
                    {user && (
                        <li>
                            <NavLink to={`/users/${user._id}`}>
                                <BsFillCameraFill className="text-[1.6em]" />
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to="/profile">
                            <BsFillPersonFill className="text-[1.6em]" />
                        </NavLink>
                    </li>
                    <li>
                        <span onClick={handleLogout} className="cursor-pointer text-[1.1em]">Sair</span>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <NavLink to="/login">Entrar</NavLink>
                    </li>
                    <li>
                        <NavLink to="/register">Cadastrar</NavLink>
                    </li>
                </>
            )}
        </ul>
    </nav>;
};

export default NavBar;