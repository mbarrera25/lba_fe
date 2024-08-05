import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as Papa from 'papaparse';
import _ from 'lodash';
import { iTest, Test, TestDetail } from 'src/app/models/Test.model';
import { AnalysisService } from '../../analysis.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-import-test',
  templateUrl: './import-test.component.html',
  styleUrls: ['./import-test.component.scss'],
})
export class ImportTestComponent implements OnInit {
  files: File[] = [];
  data: any;
  tests: Test[]

  constructor(
    public serviceAnalysis: AnalysisService,
    private activeModal: NgbActiveModal,

  ) {}

  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    addRemoveLinks: true,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };

  ngOnInit(): void {}

  upload() {

  }

  onSelect(event) {
    const file = event.addedFiles[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          this.data = result.data;
          let codes = new Set(this.data.map(d => d.codigo));
          let tests: Test[] = Array.from(codes).map((code: string) => {
            const listTest = this.data.filter(dat => dat.codigo != "" && dat.codigo === code);
            return new Test(code,
              (listTest[0].nombre).replace(/\s|\./g, ''),
              listTest[0].descripcion,
              parseFloat(listTest[0].costo) || 0,
              listTest.map(f => new TestDetail((f.nombre_resultado).replace(/\s|\./g, ''),f.lista_resultado,f.indicador_resultado))
            )
          });

          // Aquí puedes asignar `tests` a una variable de tu componente
          this.tests = tests;
          console.log(tests);
          this.serviceAnalysis.createBulkTests(this.tests).subscribe(
            (resp) => {
              this.serviceAnalysis.getallTest()
              this.activeModal.close()
              console.log(resp);

            }
          )
        }
      });
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
