import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'initial',
})
export class initialPipe {
    transform(n: string) {
        if (n) {
            var str = n.charAt(0);
            return str;
        }
        else return '';
    }
}
