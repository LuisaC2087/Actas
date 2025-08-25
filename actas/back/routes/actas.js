const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const Colaborador = require("../models/Colaborador");
const Activo = require("../models/Activo");

const router = express.Router();

// Generar acta de un colaborador
router.get("/:idColaborador", async (req, res) => {
  try {
    const { idColaborador } = req.params;

    // 1. Buscar el colaborador
    const colaborador = await Colaborador.findById(idColaborador);
    if (!colaborador) {
      return res.status(404).json({ error: "Colaborador no encontrado" });
    }

    // 2. Buscar activos asignados a ese colaborador
    const activos = await Activo.find({ asignado_a: idColaborador });

    // 3. Preparar datos para la plantilla
    const data = {
      colaborador: colaborador.toObject(),
      activos: activos.map(a => a.toObject()),
      fecha_actual: new Date().toLocaleDateString("es-CO")
    };

    // 4. Renderizar plantilla handlebars
    const templatePath = path.join(__dirname, "..", "templates", "acta.hbs");
    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    // 5. Generar PDF con Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);

  } catch (error) {
    console.error("Error generando acta:", error);
    res.status(500).json({ error: "Error generando acta" });
  }
});

module.exports = router;
