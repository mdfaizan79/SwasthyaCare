# TODO

- Add a startup check that warns when `PORT`, `VITE_API_BASE_URL`, and `VITE_SOCKET_URL` point at different backends.
- Add automated API smoke tests for `/api/health`, `/api/users/doctors`, and auth flows.
- Handle `EADDRINUSE` in the server bootstrap with a clearer message and recovery guidance.
- Add route-level loading skeletons for authenticated dashboards to smooth slow-network states.
- Split the large client bundle with route-based code splitting to reduce initial load time.
