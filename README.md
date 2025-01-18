# Prueba Tecnica

Este es un proyecto [Next.js](https://nextjs.org) inicializado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

El mismo provee:
- Manejo de sesiones (simulado).
- Manejo de carga de imágenes (simulado).
- Procesamiento de imágenes en el backend (simulado).
- Páginas de manejo de sesiones.
- Páginas de creación, modificación y visualización de los elementos cargados.
## Inicio Rápido

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev

Abre http://localhost:3000 en tu navegador para ver el resultado.

## Despliegue con Docker
### Prerrequisitos
- Docker instalado en tu sistema
### Construir la imagen
Para construir la imagen Docker, ejecuta el siguiente comando en la raíz del proyecto:
```bash
docker build -t prueba-tecnica .
```
### Ejecutar el contenedor
Para ejecutar la aplicación en un contenedor:
```bash
docker run -p 3000:3000 prueba-tecnica
```
La aplicación estará disponible en http://localhost:3000

## Tecnologías utilizadas
- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI