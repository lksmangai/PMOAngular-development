import { Component, OnInit, ElementRef } from "@angular/core";
declare var $: any;
declare var kendo: any;

@Component({
  selector: "app-learning",
  templateUrl: "./learning.component.html",
  styleUrls: ["./learning.component.css"]
})
export class LearningComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  ngOnInit() {
    $(document).ready(function() {
      // setTimeout(function(){

      var serviceRoot = "https://demos.telerik.com/kendo-ui/service";
      var tasksDataSource = new kendo.data.GanttDataSource({
        transport: {
          read: {
            url: serviceRoot + "/GanttTasks",
            dataType: "jsonp"
          },
          update: {
            url: serviceRoot + "/GanttTasks/Update",
            dataType: "jsonp"
          },
          destroy: {
            url: serviceRoot + "/GanttTasks/Destroy",
            dataType: "jsonp"
          },
          create: {
            url: serviceRoot + "/GanttTasks/Create",
            dataType: "jsonp"
          },
          parameterMap: function(options, operation) {
            if (operation !== "read") {
              return { models: kendo.stringify(options.models || [options]) };
            }
          }
        },
        schema: {
          model: {
            id: "id",
            fields: {
              id: { from: "ID", type: "number" },
              orderId: {
                from: "OrderID",
                type: "number",
                validation: { required: true }
              },
              parentId: {
                from: "ParentID",
                type: "number",
                defaultValue: null,
                validation: { required: true }
              },
              start: { from: "Start", type: "date" },
              end: { from: "End", type: "date" },
              title: { from: "Title", defaultValue: "", type: "string" },
              percentComplete: { from: "PercentComplete", type: "number" },
              summary: { from: "Summary", type: "boolean" },
              expanded: {
                from: "Expanded",
                type: "boolean",
                defaultValue: true
              }
            }
          }
        }
      });

      var dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
        transport: {
          read: {
            url: serviceRoot + "/GanttDependencies",
            dataType: "jsonp"
          },
          update: {
            url: serviceRoot + "/GanttDependencies/Update",
            dataType: "jsonp"
          },
          destroy: {
            url: serviceRoot + "/GanttDependencies/Destroy",
            dataType: "jsonp"
          },
          create: {
            url: serviceRoot + "/GanttDependencies/Create",
            dataType: "jsonp"
          },
          parameterMap: function(options, operation) {
            if (operation !== "read") {
              return { models: kendo.stringify(options.models || [options]) };
            }
          }
        },
        schema: {
          model: {
            id: "id",
            fields: {
              id: { from: "ID", type: "number" },
              predecessorId: { from: "PredecessorID", type: "number" },
              successorId: { from: "SuccessorID", type: "number" },
              type: { from: "Type", type: "number" }
            }
          }
        }
      });

      var gantt = $("#gantt")
        .kendoGantt({
          dataSource: tasksDataSource,
          dependencies: dependenciesDataSource,
          views: ["day", { type: "week", selected: true }, "month"],
          columns: [
            { field: "id", title: "ID", width: 60 },
            { field: "title", title: "Title", editable: true, sortable: true },
            {
              field: "start",
              title: "Start Time",
              format: "{0:MM/dd/yyyy}",
              width: 100,
              editable: true,
              sortable: true
            },
            {
              field: "end",
              title: "End Time",
              format: "{0:MM/dd/yyyy}",
              width: 100,
              editable: true,
              sortable: true
            }
          ],
          height: 700,

          showWorkHours: false,
          showWorkDays: false,

          snap: false
        })
        .data("kendoGantt");

      $(document).bind("kendo:skinChange", function() {
        gantt.refresh();
      });
      //  },
      //  5000);
    });
  }

  ngAfterViewInit() {
    //   alert('ngAfterViewInit');
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.text = `
  
    `;
    this.elementRef.nativeElement.appendChild(s);
  }
}
