import os from "os";
import http from "http";
import fs from "fs/promises";

const server = http.createServer((peticion, respuesta) => {
    const inicioActividadServidor = new Date();
    const ruta = peticion.url;

    if (ruta === "/log") {
        
        const interfacesRed = os.networkInterfaces();
        let informacionInterfaz = "";

        for (const nombreInterfaz in interfacesRed) {
            informacionInterfaz += `Nombre: ${nombreInterfaz}\n`;

            const direcciones = interfacesRed[nombreInterfaz];
            direcciones.forEach(direccion => {
                if (!direccion.internal) {
                    informacionInterfaz += `  Tipo: ${direccion.family}\n`;
                    informacionInterfaz += `  Dirección IP: ${direccion.address}\n`;
                }
            });

            informacionInterfaz += "\n";
        }

        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; 
        const año = fechaActual.getFullYear();

        const nombreArchivo = `log-${dia}-${mes}-${año}.txt`; 

        const totalMemoria = os.totalmem();
        const totalMemoriaGB = totalMemoria / (1024 * 1024 * 1024);

        const memoriaUtilizada = os.totalmem() - os.freemem();
        const memoriaUtilizadaGB = memoriaUtilizada / (1024 * 1024 * 1024)

        const cpus = os.cpus();
        const modelosCPU = cpus.map(cpu => cpu.model);
        const modeloCPU = modelosCPU[0];

        const contenido = `Fecha del reporte: ${dia}/${mes}/${año} \nEncendido: ${inicioActividadServidor} \nCPU: ${modeloCPU} \nTotal RAM: ${totalMemoriaGB.toFixed(2)}GB \nRAM Utilizada: ${memoriaUtilizadaGB.toFixed(2)}GB \nInterfaz de red: \n ${informacionInterfaz}`;

        // Llama a la función escribirArchivo para escribir en el archivo
        escribirArchivo(nombreArchivo, contenido)
            .then(() => {
                console.log(`Se ha escrito en el archivo ${nombreArchivo} correctamente.`);
                respuesta.end("Registro exitoso"); // Envia respuesta al cliente
            })
            .catch((error) => {
                console.error(`Error al escribir en el archivo ${nombreArchivo}:`, error);
                respuesta.statusCode = 500;
                respuesta.end("Error al escribir en el archivo");
            });
    } else {
        respuesta.statusCode = 404;
        respuesta.end("Ruta no encontrada");
    }
});



async function escribirArchivo(nombreArchivo, contenido) {
    try {
        await fs.writeFile(nombreArchivo, contenido);
    } catch (error) {
        throw error;
    }
}

server.listen(3000);



