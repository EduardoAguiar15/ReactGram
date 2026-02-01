import { Link } from "react-router-dom";

// Components
import Message from "../../components/feedback/Message";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { login, reset } from '../../slices/authSlice'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const { loading, error } = useSelector((state) => state.auth);
  
  const handleSubmit = (e) => {
    e.preventDefault()

    const user = {
      email,
      password
    }

    dispatch(login(user));
  }

  useEffect(() => {
    dispatch(reset())
  }, [dispatch]);

  return (
    <div className="border border-[#363636] bg-black py-6 px-8 max-w-[33%] my-8 mx-auto">
      <h2 className="text-center text-[2.1em] mt-0">ReactGram</h2>
      <p className="font-bold text-[#ccc] mb-6 text-center">Faça o login para ver o que há de novo.</p>
      <form onSubmit={handleSubmit} className="pb-6 mb-6 border-b border-[#363636]">
        <input type="text" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email || ""} />
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
        {!loading && <input type='submit' value='Entrar' />}
        {loading && <input type='submit' value='Aguarde...' disabled />}
        {error && <Message msg={error} type='error' />}
      </form>
      <p className="text-center">
        Não tem uma conta? <Link to="/register" className="font-bold text-[#0094f6]">Clique aqui</Link>
      </p>
    </div>
  );
};

export default Login;