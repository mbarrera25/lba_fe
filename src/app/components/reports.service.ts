import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Invoice } from '../models/Invoice.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  vfs = pdfFonts.pdfMake.vfs;
  constructor() { }

  ImprimirFact(factura: Invoice, action: string) {
    const moneda = 'Bs. ';
    const fecha: Date =new Date(factura.date_at);


    const detalles = factura.invoice_line.map((det) => {
      console.log(det);

      return [
        { text: det.quantity.toString(), style: 'tableBody' },
        { text: det.description, style: 'tableBody' },
        { text: moneda + det.price.toString(), style: 'tableBody' },
        { text: moneda + det.total.toString(), style: 'tableBody' },
      ];
    }) || [];

    // Construcción del body manualmente
    const tablaBody = [
      // Cabecera de la tabla
      [
        { text: 'Cant', style: 'tableHeader' },
        { text: 'Descripción', style: 'tableHeader' },
        { text: 'Precio', style: 'tableHeader' },
        { text: 'Total', style: 'tableHeader' },
      ],
    ];

    // Agrega los detalles al body
    detalles.forEach((fila) => tablaBody.push(fila));

    // Definición del documento PDF
    const pdfDefinition: TDocumentDefinitions = {
      content: [
        {
          alignment: 'justify',
          marginBottom: 20,
          columns: [
            {
              table: {
                headerRows: 1,
                widths: ['auto', 100],
                body: [
                  [
                    { border: [true, true, false, false], bold: true, text: 'Cliente:' },
                    { border: [false, true, true, false], text: factura.name, style: { alignment: 'right' } },
                  ],
                  [
                    { border: [true, false, false, false], bold: true, text: 'Rif/Cedula:' },
                    { border: [false, false, true, false], text: factura.identification, style: { alignment: 'right' } },
                  ],
                  [
                    { border: [true, false, false, true], bold: true, text: 'Dirección:' },
                    { border: [false, false, true, true], text: factura.direction, style: { alignment: 'right' } },
                  ],
                ],
              },
            },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 100],
                body: [
                  [
                    { border: [true, true, false, false], bold: true, text: 'Factura N°:' },
                    { border: [false, true, true, false], text: factura.invoice_number, style: { alignment: 'right' } },
                  ],
                  [
                    { border: [true, false, false, false], bold: true, text: 'Fecha:' },
                    {
                      border: [false, false, true, false],
                      text: `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    { border: [true, false, false, false], bold: true, text: 'Condición:' },
                    { border: [false, false, true, false], text: '-', style: { alignment: 'right' } },
                  ],
                  [
                    { border: [true, false, false, true], bold: true, text: 'Método de Pago:' },
                    { border: [false, false, true, true], text: factura.pay_method, style: { alignment: 'right' } },
                  ],
                ],
              },
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 300, 65, 65],
            body: tablaBody,
          },
        },
        {
          style: 'totalesTable',
          table: {
            widths: ['auto', 'auto'],
            body: [
              [
                { text: 'Sub-Total:' },
                { text: moneda + factura.subtotal_amount, style: { alignment: 'right' } },
              ],
              [
                { text: 'IGTF:' },
                { text: factura.igtf ? moneda + factura.igtf : moneda + '0.00', style: { alignment: 'right' } },
              ],
              [
                { text: 'Total Exento:' },
                { text: moneda + factura.total_amount, style: { alignment: 'right' } },
              ],
              [
                { text: 'Total a Pagar:' },
                { text: moneda + factura.total_amount, style: { alignment: 'right' } },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        totalesTable: {
          marginTop: 10,
          marginLeft: 345,
          marginBottom: 10,
        },
      },
    };

    // Crear y descargar el PDF
    return this.printInvoice(pdfDefinition, action, factura.invoice_number);
  }
  printInvoice(pdfDefinition: TDocumentDefinitions, action: string, invoice_number: string) {
    return action === 'print' ?
    pdfMake.createPdf(pdfDefinition, {}, undefined, pdfFonts.pdfMake.vfs).open() :
    pdfMake .createPdf(pdfDefinition, {}, undefined, pdfFonts.pdfMake.vfs).download(`${invoice_number}.pdf`);
  }
}
