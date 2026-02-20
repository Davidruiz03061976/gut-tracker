# GUT-TRACKER – Ejecutar desde la raíz del proyecto
# Uso: make dev-api | make dev-app | make dev

.PHONY: dev-api dev-app dev

dev-api:
	cd api && pipenv run dev

dev-app:
	cd app && npm run dev

dev:
	npm run dev
