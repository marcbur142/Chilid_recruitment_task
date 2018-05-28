import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface DataTableItem {
  first_name: string;
  last_name: string;
  birth_date: string;
  company: string;
  note: number;
  id: number;
}

const EXAMPLE_DATA: DataTableItem[] = [
  {
    id: 1,
    first_name: 'Jan',
    last_name: 'Kowalski',
    birth_date: '01.07.1990 11:35',
    company: 'XSolve',
    note: 90
  },
  {
    id: 4,
    first_name: 'Justyna',
    last_name: 'Kowalska',
    birth_date: '04.02.1976 14:37',
    company: 'XSolve',
    note: 91
  },
  {
    id: 2,
    first_name: 'Krzysztof',
    last_name: 'Krawczyk',
    birth_date: '28.10.1950 2:15',
    company: 'Chilid',
    note: 27
  },
  {
    id: 3,
    first_name: 'Bogusław',
    last_name: 'Linda',
    birth_date: '03.01.1963 23:10',
    company: 'XSolve',
    note: 50
  },
  {
    id: 5,
    first_name: 'Krzysztof',
    last_name: 'Kononowicz',
    birth_date: '10.10.1910 18:00',
    company: 'Chilid',
    note: 77
  },
  {
    id: 6,
    first_name: 'Maryla',
    last_name: 'Rodowicz',
    birth_date: '29.02.1936 11:35',
    company: 'XSolve',
    note: 8
  },
  {
    id: 7,
    first_name: 'Edyta',
    last_name: 'Górniak',
    birth_date: '14.11.1972 06:35',
    company: 'XSolve',
    note: 25
  },
  {
    id: 8,
    first_name: 'Dawid',
    last_name: 'Podsiadło',
    birth_date: '23.05.1993 16:15',
    company: 'Chilid',
    note: 19
  },
  {
    id: 9,
    first_name: 'Elvis',
    last_name: 'Presley',
    birth_date: '09.01.1935 01:35',
    company: 'XSolve',
    note: 8
  }
];

// Date formatting
function comp(thisDate) {
  const monthNames = [
  'Styczeń', 'Luty', 'Marzec',
  'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec',
  'Sierpień', 'Wrzesień', 'Październik',
  'Listopad', 'Grudzień'
  ];
  const c = monthNames[Number(thisDate.substr(3, 2))];
  const thisDateT = thisDate.substr(0, 2) + ' ' + c + ' ' + thisDate.substr(6, 4);
  return thisDateT;
}
const newB = EXAMPLE_DATA.map( e => e.birth_date = comp(e.birth_date));

// Data source for the DataTable view.
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

// Connecting data source to the table.
  connect(): Observable<DataTableItem[]> {

    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

// Called when the table is being destroyed.
  disconnect() {}

// Paginate the data.
  private getPagedData(data: DataTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

// Sort the data.
  private getSortedData(data: DataTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'first_name': return compare(a.first_name, b.first_name, isAsc);
        case 'last_name': return compare(a.last_name, b.last_name, isAsc);
        case 'birth_date': return compareB(a.birth_date, b.birth_date, isAsc);
        case 'company': return compare(a.company, b.company, isAsc);
        case 'note': return compare(+a.note, +b.note, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}
// Sorting comparator.
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
// Date sorting comparator.
function compareB(a, b, isAsc) {
  const aa = a.replace(/[^0-9]/g, '').substr(4, 3);
  const bb = b.replace(/[^0-9]/g, '').substr(4, 3);
  return (aa < bb ? -1 : 1) * (isAsc ? 1 : -1);
}
