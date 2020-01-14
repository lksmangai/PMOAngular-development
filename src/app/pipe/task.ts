import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IProjectAllocation } from '../models/project-allocation.model';

@Pipe({
    name: 'task',
})
export class taskPipe {
    transform(projects: number) {
        var myallocations: IProjectAllocation[] = [];
        // for (var i = 0; i < this.allocations.length; i++) {
        //     var data = this.allocations[i];
        //     if (data) {
        //         if (data.imProjects) {
        //             if (data.imProjects.id == project.id) {
        //                 myallocations.push(data);
        //             }
        //         }
        //     }
        // }
        return myallocations;
    }
}