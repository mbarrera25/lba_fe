import { Injectable } from '@angular/core';
//import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { SolicitudService } from './widgets/solicitud.service';
import * as html2pdf from 'html2pdf.js';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private solicitudService: SolicitudService
  ) { }

  downloadInvoice(invoiceId: number) {
    this.solicitudService.downloadInvoice(invoiceId).subscribe((blob: Blob) => {
      console.log('Blob recibido:', blob.size, blob.type);
  
      // Asegurarse de que el tipo es correcto
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      /*const link = document.createElement('a');
      link.href = url;
      link.download = `factura_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);*/
  
      // Liberar memoria
      setTimeout(() => URL.revokeObjectURL(url), 100);
    });
  }
}
