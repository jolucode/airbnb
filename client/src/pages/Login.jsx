import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-airbnb-gray">Correo electrónico</label>
          <input 
            type="email" 
            className="w-full border p-3 rounded-lg mt-1 outline-airbnb-pink"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-airbnb-gray">Contraseña</label>
          <input 
            type="password" 
            className="w-full border p-3 rounded-lg mt-1 outline-airbnb-pink"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="airbnb-btn w-full mt-4">Continuar</button>
      </form>
    </div>
  );
};

export default Login;
