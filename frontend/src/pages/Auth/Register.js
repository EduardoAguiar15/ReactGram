import { Link } from 'react-router-dom'

// Components
import Message from '../../components/feedback/Message';

// Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, reset } from "../../slices/authSlice"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const dispatch = useDispatch()

    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            name,
            email,
            password,
            confirmPassword
        }

        dispatch(register(user))
    };

    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    return (
        <div className="border border-[#363636] bg-black py-6 px-8 max-w-[33%] my-8 mx-auto">
            <h2 className="text-center text-[2.1em] mt-0">ReactGram</h2>
            <p className="font-bold text-[#ccc] mb-6 text-center">Cadastre-se para ver as fotos dos seus amigos.</p>
            <form onSubmit={handleSubmit} className="pb-6 mb-6 border-b border-[#363636]">
                <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name || ""} />
                <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email || ""} />
                <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
                <input type="password" placeholder="Confirme a senha" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ""} />
                {!loading && <input type='submit' value='Cadastrar' />}
                {loading && <input type='submit' value='Aguarde...' disabled />}
                {error && <Message msg={error} type='error' />}
            </form>
            <p className="text-center">
                Já tem conta? <Link to="/login" className="font-bold text-[#0094f6]">Clique aqui.</Link>
            </p>
        </div>
    );
};

export default Register;