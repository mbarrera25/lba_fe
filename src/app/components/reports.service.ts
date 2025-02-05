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
      this.printPdf(blob);
    });
  }

  printPdf(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Liberar memoria
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  donwloadResult(id: number) {
    this.solicitudService.downloadResult(id).subscribe((blob: Blob) => {
      this.printPdf(blob);
    });
  }
}
