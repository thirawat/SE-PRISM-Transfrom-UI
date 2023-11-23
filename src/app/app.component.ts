import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, gutter, lineNumbers, highlightActiveLineGutter, highlightActiveLine, ViewUpdate } from "@codemirror/view"
import {defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language";
import { defaultKeymap } from "@codemirror/commands"
import { xml } from "@codemirror/lang-xml"
import { autocompletion } from '@codemirror/autocomplete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  
  @ViewChild('xmlEditor') xmlEditorElement: any;
  @ViewChild('prismEditor') prismEditorElement: any;
  xml: string = '';
  ngAfterViewInit(): void {
    this.registerXMLEditor();
  }

  registerXMLEditor() {
    let startState = EditorState.create({
      doc: this.xml,
      extensions: [keymap.of(defaultKeymap), xml(), lineNumbers(), highlightActiveLineGutter(), highlightActiveLine(), gutter({ class: "cm-mygutter" }), EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
          this.xml = update.state.doc.toString();
        }
      }), EditorView.lineWrapping,syntaxHighlighting(defaultHighlightStyle)
      ],
    })

    console.log(this.xmlEditorElement.nativeElement);
    new EditorView({
      state: startState,
      parent: this.xmlEditorElement.nativeElement
    })
  }
}
