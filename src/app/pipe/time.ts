import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'time',
})
export class timePipe {
    transform(no: number) {
        var hr = Math.floor(no)
        var precision_min = no - hr;
        var min = Math.floor(precision_min * 60);
        var hours = hr + ' hrs/' + min + ' mins';
        return hours;
    }
}
