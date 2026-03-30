import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de datos para LexChile...')

  // === TRIBUNALES CHILENOS ===
  const tribunales = [
    { nombre: 'Corte Suprema de Chile', tipo: 'CORTE_SUPREMA', region: 'XIII', direccion: 'Compania 1140, Santiago', competencia: 'Tribunal superior del pais' },
    { nombre: 'Corte de Apelaciones de Santiago', tipo: 'CORTE_APELACIONES', region: 'XIII', direccion: 'Santiago', competencia: 'Segunda instancia Region Metropolitana' },
    { nombre: 'Corte de Apelaciones de Valparaiso', tipo: 'CORTE_APELACIONES', region: 'V', direccion: 'Valparaiso', competencia: 'Segunda instancia Region de Valparaiso' },
    { nombre: 'Corte de Apelaciones de Concepcion', tipo: 'CORTE_APELACIONES', region: 'VIII', direccion: 'Concepcion', competencia: 'Segunda instancia Region del Biobio' },
    { nombre: '1 Juzgado Civil de Santiago', tipo: 'JUZGADO_CIVIL', region: 'XIII', direccion: 'Santiago', competencia: 'Causas civiles' },
    { nombre: '1 Juzgado de Letras del Trabajo de Santiago', tipo: 'JUZGADO_LABORAL', region: 'XIII', direccion: 'Santiago', competencia: 'Causas laborales' },
    { nombre: 'Juzgado de Familia de Santiago', tipo: 'JUZGADO_FAMILIA', region: 'XIII', direccion: 'Santiago', competencia: 'Causas de familia' },
    { nombre: '1 Juzgado de Garantia de Santiago', tipo: 'JUZGADO_PENAL', region: 'XIII', direccion: 'Santiago', competencia: 'Causas penales en etapa de investigacion' },
    { nombre: 'Tribunal de Defensa de la Libre Competencia', tipo: 'TRIBUNAL_LIBRE_COMPETENCIA', region: 'XIII', direccion: 'Santiago', competencia: 'Libre competencia' },
    { nombre: 'Tribunal Constitucional', tipo: 'TRIBUNAL_CONSTITUCIONAL', region: 'XIII', direccion: 'Santiago', competencia: 'Control de constitucionalidad' },
    { nombre: 'Tribunal Ambiental de Santiago', tipo: 'TRIBUNAL_AMBIENTAL', region: 'XIII', direccion: 'Santiago', competencia: 'Causas ambientales zona central' },
  ]

  for (const tribunal of tribunales) {
    await prisma.tribunal.create({ data: tribunal })
  }
  console.log(`${tribunales.length} tribunales creados`)

  // === LEYES FUNDAMENTALES ===
  const leyes = [
    {
      nombre: 'Codigo del Trabajo',
      numero: 'DFL-1',
      tipo: 'CODIGO',
      areaLegal: 'LABORAL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('2003-01-16'),
      resumen: 'Fija el texto refundido, coordinado y sistematizado del Codigo del Trabajo. Regula las relaciones laborales entre empleadores y trabajadores en Chile.',
      textoCompleto: 'Codigo del Trabajo de Chile. Articulo 1: Las relaciones laborales entre los empleadores y los trabajadores se regularan por este Codigo y por sus leyes complementarias. Articulo 7: Contrato individual de trabajo es una convencion por la cual el empleador y el trabajador se obligan reciprocamente, este a prestar servicios personales bajo dependencia y subordinacion del primero, y aquel a pagar por estos servicios una remuneracion determinada. Articulo 159: El contrato de trabajo terminara en los siguientes casos: 1.- Mutuo acuerdo de las partes. 2.- Renuncia del trabajador, dando aviso al empleador con treinta dias de anticipacion, a lo menos. 3.- Muerte del trabajador. 4.- Vencimiento del plazo convenido. 5.- Conclusion del trabajo o servicio que dio origen al contrato. 6.- Caso fortuito o fuerza mayor. Articulo 160: El contrato de trabajo termina sin derecho a indemnizacion alguna cuando el empleador le ponga termino invocando una o mas de las siguientes causales. Articulo 161: El empleador podra poner termino al contrato de trabajo invocando como causal las necesidades de la empresa. Articulo 163: Si el contrato hubiere estado vigente un ano o mas y el empleador le pusiere termino por necesidades de la empresa, debera pagar al trabajador una indemnizacion por anos de servicio. Articulo 67: Los trabajadores con mas de un ano de servicio tendran derecho a un feriado anual de quince dias habiles.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=207436',
    },
    {
      nombre: 'Codigo Civil',
      numero: 'LEY-CODIGO-CIVIL',
      tipo: 'CODIGO',
      areaLegal: 'CIVIL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1857-01-01'),
      resumen: 'Codigo Civil de la Republica de Chile. Regula las relaciones entre particulares, propiedad, contratos, obligaciones, familia y sucesiones.',
      textoCompleto: 'Codigo Civil de Chile. Articulo 1: La ley es una declaracion de la voluntad soberana que, manifestada en la forma prescrita por la Constitucion, manda, prohibe o permite. Articulo 1437: Las obligaciones nacen, ya del concurso real de las voluntades de dos o mas personas, como en los contratos o convenciones. Articulo 1545: Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales. Articulo 1915: El arrendamiento es un contrato en que las dos partes se obligan reciprocamente, la una a conceder el goce de una cosa, o a ejecutar una obra o prestar un servicio, y la otra a pagar por este goce, obra o servicio un precio determinado.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=172986',
    },
    {
      nombre: 'Codigo Penal',
      numero: 'LEY-CODIGO-PENAL',
      tipo: 'CODIGO',
      areaLegal: 'PENAL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1874-11-12'),
      resumen: 'Codigo Penal de la Republica de Chile. Define los delitos y las penas aplicables en el territorio nacional.',
      textoCompleto: 'Codigo Penal de Chile. Articulo 1: Es delito toda accion u omision voluntaria penada por la ley. Las acciones u omisiones penadas por la ley se reputan siempre voluntarias, a no ser que conste lo contrario. Articulo 10: Estan exentos de responsabilidad criminal: 1 El loco o demente. 2 El menor de dieciocho anos. Articulo 15: Se consideran autores de un delito.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=1984',
    },
    {
      nombre: 'Codigo Procesal Penal',
      numero: 'LEY-19696',
      tipo: 'CODIGO',
      areaLegal: 'PENAL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('2000-10-12'),
      resumen: 'Establece el Codigo Procesal Penal de Chile. Regula el procedimiento penal basado en el sistema acusatorio.',
      textoCompleto: 'Codigo Procesal Penal de Chile. Articulo 1: Juicio previo y unica persecucion. Ninguna persona podra ser condenada o penada, ni sometida a una de las medidas de seguridad establecidas en este Codigo, sino en virtud de una sentencia fundada, dictada por un tribunal imparcial.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=176595',
    },
    {
      nombre: 'Ley sobre Proteccion de los Derechos de los Consumidores',
      numero: '19496',
      tipo: 'LEY',
      areaLegal: 'CONSUMIDOR',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1997-03-07'),
      resumen: 'Establece normas sobre proteccion de los derechos de los consumidores en Chile. Define derechos del consumidor, garantia legal, publicidad enganosa y SERNAC.',
      textoCompleto: 'Ley 19.496 sobre Proteccion de los Derechos de los Consumidores. Articulo 1: La presente ley tiene por objeto normar las relaciones entre proveedores y consumidores. Articulo 3: Son derechos y deberes basicos del consumidor: a) La libre eleccion del bien o servicio. b) El derecho a una informacion veraz y oportuna. c) El no ser discriminado arbitrariamente por parte de proveedores. d) La seguridad en el consumo. e) El derecho a la reparacion e indemnizacion adecuada. Articulo 20: En los casos que la cantidad o calidad de un bien no corresponda a lo informado, el consumidor podra optar entre la reparacion gratuita del bien, su reposicion, o la devolucion del precio pagado. Garantia legal minima de 6 meses.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=61438',
    },
    {
      nombre: 'Ley sobre Proteccion de la Vida Privada',
      numero: '19628',
      tipo: 'LEY',
      areaLegal: 'CIVIL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1999-08-28'),
      resumen: 'Ley sobre proteccion de la vida privada y datos personales en Chile.',
      textoCompleto: 'Ley 19.628 sobre Proteccion de la Vida Privada. Articulo 1: El tratamiento de los datos de caracter personal en registros o bancos de datos por organismos publicos o por particulares se sujetara a las disposiciones de esta ley. Articulo 4: El tratamiento de los datos personales solo puede efectuarse cuando esta ley u otras disposiciones legales lo autoricen o el titular consienta expresamente en ello.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=141599',
    },
    {
      nombre: 'Ley de Impuesto al Valor Agregado',
      numero: 'DL-825',
      tipo: 'DL',
      areaLegal: 'TRIBUTARIO',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1974-12-31'),
      resumen: 'Ley sobre Impuesto a las Ventas y Servicios (IVA) en Chile. Establece la tasa del 19%.',
      textoCompleto: 'Decreto Ley 825 sobre Impuesto a las Ventas y Servicios. Establece un impuesto del 19% sobre las ventas y servicios en Chile. Regula las exenciones, credito fiscal, debito fiscal y las obligaciones tributarias de los contribuyentes.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=6369',
    },
    {
      nombre: 'Ley de Arrendamiento de Predios Urbanos',
      numero: '18101',
      tipo: 'LEY',
      areaLegal: 'ARRENDAMIENTO',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1982-01-29'),
      resumen: 'Fija normas especiales sobre arrendamiento de predios urbanos en Chile.',
      textoCompleto: 'Ley 18.101 de Arrendamiento de Predios Urbanos. Regula el contrato de arrendamiento de bienes raices urbanos, plazos de desahucio, procedimiento de restitucion del inmueble y derechos del arrendatario en Chile.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=29526',
    },
    {
      nombre: 'Ley de Sociedades Anonimas',
      numero: '18046',
      tipo: 'LEY',
      areaLegal: 'COMERCIAL',
      estado: 'VIGENTE',
      fechaPublicacion: new Date('1981-10-22'),
      resumen: 'Ley sobre Sociedades Anonimas en Chile.',
      textoCompleto: 'Ley 18.046 de Sociedades Anonimas. Regula las sociedades anonimas abiertas y cerradas en Chile, su constitucion, capital, acciones, juntas de accionistas, directorio, fiscalizacion y disolucion.',
      fuenteUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=29473',
    },
  ]

  for (const ley of leyes) {
    await prisma.ley.create({ data: ley })
  }
  console.log(`${leyes.length} leyes fundamentales cargadas`)

  // === PLANTILLAS DE DOCUMENTOS ===
  const plantillas = [
    {
      nombre: 'Carta de Despido',
      tipo: 'CARTA',
      areaLegal: 'LABORAL',
      variables: JSON.stringify({ trabajador: 'string', rut_trabajador: 'string', cargo: 'string', fecha_inicio: 'date', causal: 'string', fecha_despido: 'date', empleador: 'string', rut_empleador: 'string' }),
      contenidoTemplate: 'En Santiago de Chile, a {{fecha_despido}}, don/dona {{empleador}}, RUT {{rut_empleador}}, en su calidad de empleador, comunica a don/dona {{trabajador}}, RUT {{rut_trabajador}}, quien se desempena como {{cargo}} desde el {{fecha_inicio}}, que se ha decidido poner termino a su contrato de trabajo.',
    },
    {
      nombre: 'Contrato de Arrendamiento',
      tipo: 'CONTRATO',
      areaLegal: 'ARRENDAMIENTO',
      variables: JSON.stringify({ arrendador: 'string', rut_arrendador: 'string', arrendatario: 'string', rut_arrendatario: 'string', direccion: 'string', comuna: 'string', renta: 'number', plazo: 'number' }),
      contenidoTemplate: 'CONTRATO DE ARRENDAMIENTO\n\nEn Santiago de Chile, entre don/dona {{arrendador}}, RUT {{rut_arrendador}}, en adelante "el Arrendador", y don/dona {{arrendatario}}, RUT {{rut_arrendatario}}, en adelante "el Arrendatario".',
    },
    {
      nombre: 'Poder Simple',
      tipo: 'PODER',
      areaLegal: 'CIVIL',
      variables: JSON.stringify({ poderdante: 'string', rut_poderdante: 'string', apoderado: 'string', rut_apoderado: 'string', facultades: 'string' }),
      contenidoTemplate: 'PODER\n\nEn Santiago de Chile, don/dona {{poderdante}}, RUT {{rut_poderdante}}, confiere poder especial a don/dona {{apoderado}}, RUT {{rut_apoderado}}, para que en su nombre y representacion pueda:\n\n{{facultades}}',
    },
    {
      nombre: 'Reclamo SERNAC',
      tipo: 'CARTA',
      areaLegal: 'CONSUMIDOR',
      variables: JSON.stringify({ consumidor: 'string', rut_consumidor: 'string', proveedor: 'string', producto: 'string', fecha_compra: 'date', problema: 'string', monto: 'number' }),
      contenidoTemplate: 'RECLAMO ANTE SERNAC\n\nYo, {{consumidor}}, RUT {{rut_consumidor}}, interpongo el siguiente reclamo en contra de {{proveedor}}:\n\nProducto/Servicio: {{producto}}\nMonto: ${{monto}} CLP\n\nMotivo del reclamo:\n{{problema}}',
    },
  ]

  for (const plantilla of plantillas) {
    await prisma.plantillaDocumento.create({ data: plantilla })
  }
  console.log(`${plantillas.length} plantillas de documentos creadas`)

  // === USUARIO ADMIN ===
  const adminPassword = await hash('admin123', 12)
  await prisma.usuario.create({
    data: {
      email: 'admin@lexchile.cl',
      nombre: 'Administrador',
      apellido: 'LexChile',
      rut: '111111111',
      passwordHash: adminPassword,
      rol: 'ADMIN',
    },
  })
  console.log('Usuario admin creado (admin@lexchile.cl / admin123)')

  // === USUARIO ABOGADO DE PRUEBA ===
  const abogadoPassword = await hash('abogado123', 12)
  await prisma.usuario.create({
    data: {
      email: 'abogado@lexchile.cl',
      nombre: 'Maria',
      apellido: 'Gonzalez',
      rut: '123456789',
      passwordHash: abogadoPassword,
      rol: 'ABOGADO',
    },
  })
  console.log('Usuario abogado creado (abogado@lexchile.cl / abogado123)')

  console.log('Seed completado exitosamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
