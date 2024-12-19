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
    try {
        const file = event.addedFiles[0];

        if (!file) {
            throw new Error('No se seleccionó un archivo.');
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                try {
                    if (result.errors.length > 0) {
                        console.error('Errores en el archivo CSV:', result.errors);
                        throw new Error('El archivo contiene errores. Verifique el formato.');
                    }

                    let data = result.data;

                    // Validar que el CSV tiene las columnas esperadas
                    const requiredColumns = ['codigo', 'nombre', 'descripcion', 'costo', 'nombre_resultado', 'lista_resultado', 'indicador_resultado'];
                    const missingColumns = requiredColumns.filter(col => !Object.keys(data[0] || {}).includes(col));
                    if (missingColumns.length > 0) {
                        throw new Error(`El archivo no contiene las columnas requeridas: ${missingColumns.join(', ')}`);
                    }

                    let codes = new Set(data.map(d => d.codigo));
                    let tests: Test[] = Array.from(codes).map((code: string) => {
                        const listTest = data.filter(dat => dat.codigo !== "" && dat.codigo === code);
                        return new Test(
                            code,
                            (listTest[0].nombre || '').replace(/\s|\./g, ''),
                            listTest[0].descripcion || '',
                            parseFloat(listTest[0].costo) || 0,
                            listTest.map(f => new TestDetail(
                                (f.nombre_resultado || '').replace(/\s|\./g, ''),
                                f.lista_resultado || '',
                                f.indicador_resultado || ''
                            ))
                        );
                    });

                    // Asignar los tests al componente
                    this.tests = tests;
                    console.log(tests);

                    // Llamar al servicio para guardar los tests
                    this.serviceAnalysis.createBulkTests(this.tests).subscribe(
                        (resp) => {
                            console.log('Tests creados exitosamente:', resp);
                            this.serviceAnalysis.getallTest( { page: 1, size: 10 });
                            this.activeModal.close();
                        },
                        (error) => {
                            console.error('Error al guardar los tests en el backend:', error);
                            alert('Error al guardar los tests. Intente nuevamente.');
                        }
                    );

                } catch (dataError) {
                    console.error('Error procesando el contenido del archivo CSV:', dataError);
                    alert(dataError.message || 'Error procesando los datos del archivo.');
                }
            },
            error: (parseError) => {
                console.error('Error al procesar el archivo CSV:', parseError);
                alert('Error procesando el archivo CSV. Verifique el formato.');
            }
        });
    } catch (fileError) {
        console.error('Error al seleccionar el archivo:', fileError);
        alert(fileError.message || 'Error seleccionando el archivo. Intente nuevamente.');
    }
}


  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
