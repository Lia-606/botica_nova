const PDFDocument = require('pdfkit');
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

const generarReporte = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('producto', 'nombre precio');
    const productos = await Producto.find();

    // Configurar PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Configurar headers de respuesta
    let filename = "reporte-botica.pdf";
    filename = encodeURIComponent(filename);
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

  
    doc.pipe(res);

 
    doc
      .fillColor('#1E90FF')
      .fontSize(24)
      .text('Reporte Botica NovaSalud', { align: 'center', underline: true });
    doc.moveDown(1);

    const fecha = new Date().toLocaleString();
    doc
      .fillColor('black')
      .fontSize(12)
      .text(`Fecha de emisión: ${fecha}`, { align: 'right' });
    doc.moveDown(1);


    doc
      .fillColor('#333')
      .fontSize(18)
      .text('Ventas Registradas', { underline: true });
    doc.moveDown(0.5);

  
    const tableTop = doc.y;
    doc
      .fontSize(12)
      .fillColor('#000')
      .text('Producto', 50, tableTop, { bold: true })
      .text('Cantidad', 300, tableTop)
      .text('Precio Unit.', 380, tableTop)
      .text('Total', 470, tableTop);

    doc.moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();
    doc.moveDown(1);

    let y = doc.y;
    ventas.forEach(v => {
      doc.text(v.producto.nombre, 50, y);
      doc.text(v.cantidad.toString(), 300, y);
      doc.text(`S/. ${v.producto.precio.toFixed(2)}`, 380, y);
      doc.text(`S/. ${v.total.toFixed(2)}`, 470, y);
      y += 20;

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
    doc.moveDown(1);
    doc.fillColor('#FF0000')
      .fontSize(14)
      .text(`Total de ventas: S/. ${totalVentas.toFixed(2)}`, { align: 'right' });
    doc.moveDown(2);

    
    doc.addPage();
    doc.fillColor('#333').fontSize(18).text('Stock Actual', { underline: true });
    doc.moveDown(0.5);

    
    const invTop = doc.y;
    doc.fontSize(12)
      .fillColor('#000')
      .text('Producto', 50, invTop)
      .text('Stock', 470, invTop);

    doc.moveTo(50, invTop + 15).lineTo(550, invTop + 15).stroke();
    doc.moveDown(1);

  
    let yInv = doc.y;
    productos.forEach(p => {
      doc.text(p.nombre, 50, yInv);
      doc.text(p.stock.toString(), 470, yInv);
      yInv += 20;

      if (yInv > 750) {
        doc.addPage();
        yInv = 50;
      }
    });

  
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('#555')
      .text('Botica NovaSalud - Informe generado automáticamente', 50, 780, {
        align: 'center',
        width: 500
      });

    
    doc.end();

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error al generar reporte' });
  }
};

module.exports = { generarReporte };
