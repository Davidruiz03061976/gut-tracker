# GUT-TRACKER

SaaS para registrar comidas y síntomas digestivos (dolor, hinchazón, urgencia, escala Bristol, etc.) y correlacionarlos, pensado para personas con colon irritable, intolerancias o problemas digestivos.

---

## Stack tecnológico

| Parte | Tecnologías |
|-------|-------------|
| **API** | Python 3.13, Flask, SQLAlchemy, SQLite, Flask-CORS |
| **App** | React 19, Vite 7, Tailwind CSS 4 |
| **Monorepo** | Un solo repo: carpeta `api/` (Pipenv) y carpeta `app/` (npm) |

- **Gestión de dependencias API:** solo Pipenv (`api/Pipfile`).
- **Gestión de dependencias App:** solo npm (`app/package.json`).
- **Configuración:** un único `.env` en la **raíz** del proyecto; API y App lo leen desde ahí.

---

## Requisitos previos

- **Node.js** (v18+ recomendado) y **npm**
- **Python 3.13** (o compatible 3.12+)
- **Pipenv** (`pip install pipenv` o `brew install pipenv`)

---

## Estructura del proyecto (monorepo)

```
gut-tracker/
├── .env              # Variables de entorno (no commitear; crear desde .env.example)
├── .env.example      # Plantilla de variables
├── package.json      # Scripts desde raíz (npm run dev, dev:api, dev:app)
├── Makefile          # Alternativa: make dev-api, make dev-app, make dev
├── api/              # Backend Flask
│   ├── Pipfile       # Dependencias Python (Pipenv)
│   ├── app.py        # Entrada Flask
│   ├── config.py     # Carga .env de la raíz
│   ├── models.py
│   ├── auth/
│   └── instance/     # SQLite (registros.db) se crea aquí
└── app/              # Frontend React + Vite
    ├── package.json
    ├── vite.config.js
    └── src/
```

---

## Primera vez (setup)

1. **Clonar** y entrar en la raíz del proyecto.

2. **Variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Revisar y ajustar `.env` si hace falta (por defecto sirve para desarrollo local).

3. **Dependencias API**
   ```bash
   cd api && pipenv install && cd ..
   ```

4. **Dependencias App**
   ```bash
   cd app && npm install && cd ..
   ```

5. **Dependencias de la raíz** (para `npm run dev` que levanta API + App)
   ```bash
   npm install
   ```

---

## Cómo ejecutar (desde la raíz)

Todo se puede levantar **desde la raíz**, sin entrar en `api/` ni `app/`:

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Levanta **API + App** a la vez (un Ctrl+C cierra ambos) |
| `npm run dev:api` | Solo **API** (Flask en http://127.0.0.1:5000) |
| `npm run dev:app` | Solo **App** (Vite en http://localhost:5173) |

Con **Make** (alternativa):

- `make dev` → igual que `npm run dev`
- `make dev-api` → solo API
- `make dev-app` → solo App

---

## Si trabajas dentro de cada carpeta

- **Solo API:** `cd api` y luego `pipenv run dev` (o `pipenv run run` para `python app.py`).
- **Solo App:** `cd app` y luego `npm run dev` (o `npm run build`, `npm run preview`, `npm run lint`).

---

## Variables de entorno (.env)

Se leen desde el **único `.env` en la raíz**. No crear `.env` dentro de `api/` ni `app/`.

| Variable | Uso |
|----------|-----|
| `FLASK_APP` | Punto de entrada Flask (`app:app`) |
| `FLASK_ENV` | `development` / `production` |
| `SQLALCHEMY_DATABASE_URI` | URI de la base de datos (por defecto SQLite en `api/instance/registros.db`) |
| `VITE_API_URL` | URL del API para el frontend (p. ej. http://127.0.0.1:5000) |

Más detalle en `.env.example`.

---

## Base de datos

- Por defecto: **SQLite** en `api/instance/registros.db`.
- El archivo (y la carpeta `instance/`) se crean solos la primera vez que arranca el API.
- Para cambiar de BD, ajustar `SQLALCHEMY_DATABASE_URI` en `.env`.

---

## Si dejas el proyecto parado más de 1 año

1. **Requisitos:** Tener instalado Node, npm, Python 3.13 (o 3.12+) y Pipenv.
2. **Configuración:** Copiar de nuevo `.env.example` a `.env` si no tienes `.env`; el proyecto no arranca sin `.env` en la raíz.
3. **Dependencias:** Volver a instalar por si cambian versiones:
   - Raíz: `npm install`
   - API: `cd api && pipenv install`
   - App: `cd app && npm install`
4. **Levantar:** Desde la raíz, `npm run dev` (o `npm run dev:api` y `npm run dev:app` en dos terminales).
5. **Documentación de producto y reglas:** Ver `.cursor/.cursorrules` (MVP, historias de usuario, buenas prácticas) y `.cursor/rules/monorepo-gut-tracker.mdc` (estructura del monorepo).

---

## Licencia y uso

Proyecto privado. Ver repositorio y documentación interna del equipo.
