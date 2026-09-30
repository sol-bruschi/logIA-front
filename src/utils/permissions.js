export function tienePermiso(accesos = [], menuCodigo, operacion) {
  if (!Array.isArray(accesos)) return false;
  const accesoMenu = accesos.find(
    (item) => item.menu && item.menu.codigo === menuCodigo
  );
  if (!accesoMenu) return false;
  return Boolean(accesoMenu[operacion]);
}