import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-search-select',
  templateUrl: './custom-search-select.component.html',
  styleUrls: ['./custom-search-select.component.scss']
})
export class CustomSearchSelectComponent implements OnInit {

  @Input() items: any[] = []; // Lista de elementos para buscar
  @Output() itemSelected = new EventEmitter<any>(); // Emite el elemento seleccionado
  searchTerm: string = '';
  filteredItems: any[] = [];
  showDropdown: boolean = false;
  searchControl = new FormControl('');
  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value) => {
      this.onSearch(value);
    });
  }

  onSearch(value: string) {
    this.filteredItems = this.items.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    this.showDropdown = this.filteredItems.length > 0;
  }

  selectItem(item: any) {
    this.itemSelected.emit(item);
    this.searchControl.setValue(''); // Limpia el input al seleccionar un item
    this.showDropdown = false; // Cerrar el dropdown
  }

  closeDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

}
