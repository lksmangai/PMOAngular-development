import { Component, OnInit } from "@angular/core";
declare var $;
@Component({
  selector: "app-metting-notes",
  templateUrl: "./metting-notes.component.html",
  styleUrls: ["./metting-notes.component.css"]
})
export class MettingNotesComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(document).ready(function() {
      // create Editor from textarea HTML element with default set of tools
      $("#editor").kendoEditor({
        tools: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "justifyLeft",
          "justifyCenter",
          "justifyRight",
          "justifyFull",
          "insertUnorderedList",
          "insertOrderedList",
          "indent",
          "outdent",
          "createLink",
          "unlink",
          "insertImage",
          "insertFile",
          "subscript",
          "superscript",
          "tableWizard",
          "createTable",
          "addRowAbove",
          "addRowBelow",
          "addColumnLeft",
          "addColumnRight",
          "deleteRow",
          "deleteColumn",
          "viewHtml",
          "formatting",
          "cleanFormatting",
          "fontName",
          "fontSize",
          "foreColor",
          "backColor",
          "print"
        ]
      });
    });
  }
}
