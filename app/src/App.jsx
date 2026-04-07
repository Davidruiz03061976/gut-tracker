import { useEffect, useState } from "react";
import Onboarding from "./components/Onboarding";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("userProfile");
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch {
      return null;
    }
  });

  const [comida, setComida] = useState("");
  const [urgencia, setUrgencia] = useState(0);
  const [dolor, setDolor] = useState(0);
  const [hinchazon, setHinchazon] = useState(0);
  const [bristol, setBristol] = useState(3);

  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  const bristolLabel = (valor) => {
    switch (valor) {
      case 1:
        return "1 - Muy duro";
      case 2:
        return "2 - Duro";
      case 3:
        return "3 - Normal";
      case 4:
        return "4 - Ideal";
      case 5:
        return "5 - Blando";
      case 6:
        return "6 - Diarrea leve";
      case 7:
        return "7 - Diarrea líquida";
      default:
        return "Desconocido";
    }
  };

  const generarSugerencias = (profile) => {
    const sugerencias = [];

    if (!profile) return sugerencias;

    if (profile.comeRapido === "si") {
      sugerencias.push("Prueba a comer más despacio y masticar mejor.");
    }

    if (profile.snacks === "si") {
      sugerencias.push(
        "Revisa si los snacks empeoran tus síntomas o tu digestión.",
      );
    }

    if (profile.haceAyuno === "si" && Number(profile.horasAyuno) >= 16) {
      sugerencias.push(
        "Revisa si los ayunos largos coinciden con más hambre o peor digestión al romper el ayuno.",
      );
    }

    if (profile.comidasDia && Number(profile.comidasDia) <= 2) {
      sugerencias.push(
        "Comprueba si hacer pocas comidas muy grandes empeora tus síntomas.",
      );
    }

    if (profile.alimentosSospechosos?.trim()) {
      sugerencias.push(
        "Haz seguimiento de tus alimentos sospechosos durante varios días para detectar patrones.",
      );
    }

    if (profile.digestionConEstres === "si") {
      sugerencias.push(
        "Ten en cuenta el estrés al analizar tus síntomas, porque puede influir en la digestión.",
      );
    }

    if (sugerencias.length === 0) {
      sugerencias.push(
        "Sigue registrando tus comidas y síntomas para detectar patrones útiles.",
      );
    }

    return sugerencias;
  };

  const generarSugerenciasDesdeRegistros = (registros) => {
    const sugerencias = [];

    if (!registros || registros.length === 0) return sugerencias;

    const ultimos = registros.slice(0, 3);

    const mediaHinchazon =
      ultimos.reduce((acc, r) => acc + r.hinchazon, 0) / ultimos.length;

    const mediaDolor =
      ultimos.reduce((acc, r) => acc + r.dolor, 0) / ultimos.length;

    const mediaBristol =
      ultimos.reduce((acc, r) => acc + r.bristol, 0) / ultimos.length;

    if (mediaHinchazon >= 6) {
      sugerencias.push(
        "Últimamente tienes bastante hinchazón. Revisa qué alimentos se repiten.",
      );
    }

    if (mediaDolor >= 5) {
      sugerencias.push(
        "Estás registrando dolor frecuente. Puede ser útil simplificar comidas unos días.",
      );
    }

    if (mediaBristol >= 5.5) {
      sugerencias.push(
        "Tus heces tienden a ser blandas. Observa si hay alimentos desencadenantes.",
      );
    }

    if (mediaBristol <= 2.5) {
      sugerencias.push(
        "Tus heces tienden a ser duras. Podrías revisar hidratación y fibra.",
      );
    }

    return sugerencias;
  };

  const login = async () => {
    setAuthError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al hacer login");
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setPassword("");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setRegistros([]);
    setAuthError("");
  };

  const handleOnboardingComplete = (data) => {
    setProfile(data);
  };

  const guardarDia = async () => {
    const nuevoRegistro = {
      comida,
      urgencia,
      dolor,
      hinchazon,
      bristol,
    };

    try {
      const res = await fetch(`${API_URL}/registros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoRegistro),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error guardando registro");
      }

      setRegistros((prev) => [data, ...prev]);

      setComida("");
      setUrgencia(0);
      setDolor(0);
      setHinchazon(0);
      setBristol(3);
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const borrarRegistro = async (id) => {
    try {
      const res = await fetch(`${API_URL}/registros/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error borrando registro");
      }

      setRegistros((prev) => prev.filter((registro) => registro.id !== id));
    } catch (error) {
      console.error("Error borrando:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const cargarDatos = async () => {
      try {
        const resUser = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await resUser.json();

        if (!resUser.ok) {
          throw new Error(userData.error || "Error al obtener usuario");
        }

        setUser(userData.user);
        setLoading(true);

        const resRegistros = await fetch(`${API_URL}/registros`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const registrosData = await resRegistros.json();

        if (!resRegistros.ok) {
          throw new Error(registrosData.error || "Error cargando registros");
        }

        setRegistros(registrosData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        setRegistros([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-medium text-emerald-600">
              Gut Tracker
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Bienvenido</h1>
            <p className="mt-2 text-sm text-slate-500">
              Inicia sesión para seguir tu digestión y hábitos diarios.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <button
              onClick={login}
              disabled={!email.trim() || !password.trim()}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Entrar
            </button>

            {authError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {authError}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const sugerencias = generarSugerencias(profile);
  const sugerenciasRegistros = generarSugerenciasDesdeRegistros(registros);
  const todasSugerencias = [...sugerencias, ...sugerenciasRegistros];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Gut Tracker</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Registrar día
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Lleva un control simple de comida, síntomas y digestión.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-sm text-slate-600">
              Sesión iniciada como:{" "}
              <strong className="text-slate-900">{user?.email}</strong>
            </p>
            <button
              onClick={logout}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Nuevo registro
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Anota lo que has comido y cómo te has sentido hoy.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    ¿Qué has comido?
                  </label>
                  <textarea
                    placeholder="Ejemplo: arroz, pollo, ensalada y yogur"
                    value={comida}
                    onChange={(e) => setComida(e.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Urgencia
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {urgencia}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgencia(Math.max(0, urgencia - 1))}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgencia(Math.min(10, urgencia + 1))}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Hinchazón
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {hinchazon}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setHinchazon(Math.max(0, hinchazon - 1))}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHinchazon(Math.min(10, hinchazon + 1))
                        }
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Bristol
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                          {bristol}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {bristolLabel(bristol)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBristol(Math.max(1, bristol - 1))}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setBristol(Math.min(7, bristol + 1))}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Dolor
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {dolor}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDolor(Math.max(0, dolor - 1))}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setDolor(Math.min(10, dolor + 1))}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={guardarDia}
                  disabled={!comida.trim()}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Guardar día
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Sugerencias
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ideas basadas en tus hábitos y registros recientes.
                </p>
              </div>

              <div className="space-y-3">
                {todasSugerencias.map((sugerencia, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {sugerencia}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Histórico
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tus registros más recientes.
                </p>
              </div>

              {loading && (
                <p className="text-sm text-slate-500">Cargando registros...</p>
              )}

              {!loading && registros.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No hay registros todavía.
                </div>
              )}

              <div className="space-y-4">
                {registros.map((registro) => (
                  <div
                    key={registro.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="text-sm text-slate-500">Comida</p>
                    <p className="mb-3 font-medium text-slate-900">
                      {registro.comida}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>Urgencia: {registro.urgencia}</p>
                      <p>Hinchazón: {registro.hinchazon}</p>
                      <p>Dolor: {registro.dolor}</p>
                      <p>Bristol: {bristolLabel(registro.bristol)}</p>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Fecha: {registro.fecha}
                    </p>

                    <button
                      onClick={() => borrarRegistro(registro.id)}
                      className="mt-4 w-full rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Borrar registro
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
