import { useState } from "react";

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    haceAyuno: "",
    horasAyuno: "",
    tipoDieta: "",
    objetivo: "",
    haceEjercicio: "",
    diasEntreno: 0,
    tipoEjercicio: "",
    nivelActividad: "",
    edad: "",
    sexo: "",
    altura: "",
    peso: "",
    estres: 3,
    suenoHoras: "",
    digestionConEstres: "",
    comidasDia: "",
    horaDesayuno: "",
    horaComida: "",
    horaCena: "",
    snacks: "",
    comeRapido: "",
    sintomasBase: [],
    alimentosSospechosos: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = () => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-emerald-600">
            Gut Tracker
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Configuración inicial
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Vamos a conocerte un poco mejor para personalizar tu seguimiento
          </p>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Paso {step} de 5
          </p>

          <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-emerald-600 transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Alimentación
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Primero, elige el tipo de dieta que sigues habitualmente.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ¿Qué tipo de dieta sigues?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Omnívora", value: "omnivora" },
                    { label: "Vegetariana", value: "vegetariana" },
                    { label: "Vegana", value: "vegana" },
                    { label: "Keto", value: "keto" },
                    { label: "Mediterránea", value: "mediterranea" },
                    { label: "Sin gluten", value: "sin_gluten" },
                  ].map((dieta) => (
                    <button
                      key={dieta.value}
                      type="button"
                      onClick={() => updateField("tipoDieta", dieta.value)}
                      className={`rounded-2xl border p-4 text-sm font-medium transition ${
                        formData.tipoDieta === dieta.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {dieta.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ¿Haces ayuno?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Sí", value: "si" },
                    { label: "No", value: "no" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => updateField("haceAyuno", opcion.value)}
                      className={`rounded-2xl border p-4 text-sm font-medium transition ${
                        formData.haceAyuno === opcion.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.haceAyuno === "si" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    ¿Cuántas horas de ayuno haces normalmente?
                  </label>

                  <select
                    value={formData.horasAyuno}
                    onChange={(e) => updateField("horasAyuno", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="12">12 horas</option>
                    <option value="13">13 horas</option>
                    <option value="14">14 horas</option>
                    <option value="15">15 horas</option>
                    <option value="16">16 horas</option>
                    <option value="17">17 horas</option>
                    <option value="18">18 horas</option>
                    <option value="20">20 horas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ¿Cuál es tu objetivo principal?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Mejorar digestión", value: "mejorar_digestion" },
                    { label: "Perder grasa", value: "perder_grasa" },
                    { label: "Mantener peso", value: "mantener_peso" },
                    { label: "Ganar músculo", value: "ganar_musculo" },
                    { label: "Más energía", value: "mas_energia" },
                    {
                      label: "Identificar alimentos",
                      value: "identificar_alimentos",
                    },
                  ].map((obj) => (
                    <button
                      key={obj.value}
                      type="button"
                      onClick={() => updateField("objetivo", obj.value)}
                      className={`rounded-2xl border p-4 text-sm font-medium transition ${
                        formData.objetivo === obj.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Actividad física
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Cuéntanos cómo es tu nivel de actividad.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ¿Haces ejercicio?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Sí", value: "si" },
                    { label: "No", value: "no" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => updateField("haceEjercicio", opcion.value)}
                      className={`rounded-2xl border p-4 text-sm font-medium transition ${
                        formData.haceEjercicio === opcion.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ¿Cuántos días entrenas por semana?
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={formData.diasEntreno}
                  onChange={(e) => updateField("diasEntreno", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tipo principal de ejercicio
                </label>
                <select
                  value={formData.tipoEjercicio}
                  onChange={(e) => updateField("tipoEjercicio", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="cardio">Cardio</option>
                  <option value="caminar">Caminar</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nivel de actividad general
                </label>
                <select
                  value={formData.nivelActividad}
                  onChange={(e) =>
                    updateField("nivelActividad", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="sedentario">Sedentario</option>
                  <option value="ligero">Ligero</option>
                  <option value="moderado">Moderado</option>
                  <option value="alto">Alto</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Datos personales
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Unos datos básicos para personalizar mejor la experiencia.
                </p>
              </div>

              <input
                type="number"
                placeholder="Edad"
                value={formData.edad}
                onChange={(e) => updateField("edad", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <select
                value={formData.sexo}
                onChange={(e) => updateField("sexo", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Sexo</option>
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
              </select>

              <input
                type="number"
                placeholder="Altura (cm)"
                value={formData.altura}
                onChange={(e) => updateField("altura", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="number"
                placeholder="Peso (kg)"
                value={formData.peso}
                onChange={(e) => updateField("peso", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Estrés, sueño y digestión
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Estos factores pueden influir mucho en cómo te sientes.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nivel de estrés: {formData.estres}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.estres}
                  onChange={(e) =>
                    updateField("estres", Number(e.target.value))
                  }
                  className="w-full accent-emerald-600"
                />
              </div>

              <input
                type="number"
                step="0.5"
                placeholder="Horas de sueño por noche"
                value={formData.suenoHoras}
                onChange={(e) => updateField("suenoHoras", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <select
                value={formData.digestionConEstres}
                onChange={(e) =>
                  updateField("digestionConEstres", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">¿Tu digestión empeora con el estrés?</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>

              <textarea
                rows={4}
                placeholder="Alimentos que sospechas que te sientan mal"
                value={formData.alimentosSospechosos}
                onChange={(e) =>
                  updateField("alimentosSospechosos", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Rutina de comidas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Último paso para completar tu perfil.
                </p>
              </div>

              <input
                type="number"
                min="1"
                max="10"
                placeholder="¿Cuántas comidas haces al día?"
                value={formData.comidasDia}
                onChange={(e) => updateField("comidasDia", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="time"
                value={formData.horaDesayuno}
                onChange={(e) => updateField("horaDesayuno", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="time"
                value={formData.horaComida}
                onChange={(e) => updateField("horaComida", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="time"
                value={formData.horaCena}
                onChange={(e) => updateField("horaCena", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Atrás
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  step === 1 &&
                  (!formData.tipoDieta ||
                    !formData.haceAyuno ||
                    (formData.haceAyuno === "si" && !formData.horasAyuno) ||
                    !formData.objetivo)
                }
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Guardar perfil y empezar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
