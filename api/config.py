"""
Configuración del API. Carga variables desde el .env en la raíz del monorepo.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# Raíz del monorepo (un nivel por encima de api/)
ROOT_DIR = Path(__file__).resolve().parent.parent
API_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")


def get_env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def _sqlite_uri() -> str:
    """URI de SQLite: si es relativa (instance/...), se resuelve respecto a api/."""
    raw = get_env("SQLALCHEMY_DATABASE_URI", "sqlite:///instance/registros.db")
    if not raw.startswith("sqlite:///"):
        return raw
    path_part = raw.replace("sqlite:///", "", 1)
    if path_part.startswith("/") or (len(path_part) > 1 and path_part[1] == ":"):
        return raw  # ya absoluta
    instance_dir = API_DIR / path_part.split("/")[0]
    instance_dir.mkdir(exist_ok=True)
    db_path = (API_DIR / path_part).resolve()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{db_path.as_posix()}"


class Config:
    FLASK_ENV = get_env("FLASK_ENV", "development")
    SQLALCHEMY_DATABASE_URI = _sqlite_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
