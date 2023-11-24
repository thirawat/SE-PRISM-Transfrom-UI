import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, gutter, lineNumbers, highlightActiveLineGutter, highlightActiveLine, ViewUpdate } from "@codemirror/view"
import {defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language";
import { defaultKeymap } from "@codemirror/commands"
import { xml } from "@codemirror/lang-xml"
import { liquidsoap } from "codemirror-lang-liquidsoap"
import { AppService } from './app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  
  @ViewChild('xmlEditor') xmlEditorElement: any;
  @ViewChild('prismEditor') prismEditorElement: any;
  uuid: string = '';
  xml: string = '';
  error_message: string = '';
  loading: boolean = true;
  xmlCodeEditor: EditorView | undefined;
  prism: string = '';
  prismCodeEditor: EditorView | undefined;
  constructor(protected appService:AppService,protected router:ActivatedRoute,protected route:Router,protected toastService: ToastrService) { }

  ngAfterViewInit(): void {
    this.uuid = this.router.snapshot.params['uuid'];
    if (!!this.uuid) {
      this.appService.getByUUID(this.uuid).subscribe((response: any) => {
        this.uuid = response.uuid;
        this.xml = response.xml;
        this.prism = response.prism;
        this.loading = false;
        this.registerXMLEditor();
        this.registerPRISMEditor();
      });
    }else{
      this.appService.getNewUUID().subscribe((response: any) => {
        this.uuid = response.uuid;
        this.loading = false;
        this.registerXMLEditor();
        this.registerPRISMEditor();
      });
    }
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

    this.xmlCodeEditor = new EditorView({
      state: startState,
      parent: this.xmlEditorElement.nativeElement
    })
  }

  registerPRISMEditor() {
    let startState = EditorState.create({
      doc: this.prism,
      extensions: [keymap.of(defaultKeymap), liquidsoap(), lineNumbers(), highlightActiveLineGutter(), highlightActiveLine(), gutter({ class: "cm-mygutter" }), EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
          this.prism = update.state.doc.toString();
        }
      }), EditorView.lineWrapping,syntaxHighlighting(defaultHighlightStyle)
      ],
    })

    this.prismCodeEditor = new EditorView({
      state: startState,
      parent: this.prismEditorElement.nativeElement
    })
  }

  loadFileToEditor(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e:any) => {
      const contents = e.target.result as string;
      this.xml = contents;
      if (this.xmlCodeEditor) {
        const state = this.xmlCodeEditor.state.update({
          changes: {
            from: 0,
            to: this.xmlCodeEditor.state.doc.length,
            insert: contents
          }
        });
        this.xmlCodeEditor.update([state]);
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  transform(){
    this.loading = true;
    this.error_message = '';
    this.appService.transform(this.uuid,this.xml).subscribe((response: any) => {
      this.loading = false;
      this.route.navigate([`/${this.uuid}`]);
      if(response.success){
        this.toastService.success('Transform Success');
        this.prism = response.result;
        if (this.prismCodeEditor) {
          const state = this.prismCodeEditor.state.update({
            changes: {
              from: 0,
              to: this.prismCodeEditor.state.doc.length,
              insert: this.prism
            }
          });
          this.prismCodeEditor.update([state]);
        }
      }
      else{
        this.error_message = response.error;
        this.toastService.error('Transform Failed');
      }
    });
  }
  save(){
    this.loading = true;
    this.appService.save(this.uuid,this.xml,this.prism).subscribe((response: any) => {
      this.loading = false;
      if(response.success){
        this.toastService.success('Save Success');
        this.route.navigate([`/${this.uuid}`]);  
      }
      else{
        this.error_message = response.error;
        this.toastService.error('Save Failed');
      }
    });
  }
}

