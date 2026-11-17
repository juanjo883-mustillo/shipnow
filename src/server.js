// Punto de arranque: valida la configuración, conecta a MongoDB y abre el puerto.
// La config se importa dentro del try para que, si falta una variable de entorno,
// se muestre un mensaje claro y la app termine sin arrancar.
const start = async () => {
  try {
    const { config } = await import('./config/index.js')
    const { connectDB } = await import('./config/db.config.js')
    const { default: app } = await import('./app.js')

    await connectDB()
    app
      .listen(config.port, () => {
        console.log(`ShipNow escuchando en el puerto ${config.port} (${config.nodeEnv})`)
      })
      .on('error', (error) => {
        console.error(`❌ No se pudo abrir el puerto ${config.port}: ${error.message}`)
        process.exit(1)
      })
  } catch (error) {
    console.error(`❌ No se pudo iniciar ShipNow: ${error.message}`)
    process.exit(1)
  }
}

start()
