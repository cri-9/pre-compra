/* Desactivar completamente HMR en producción */
if (import.meta.env.PROD || location.protocol === 'https:') {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {});
    import.meta.hot.accept(() => {});
  }
}
