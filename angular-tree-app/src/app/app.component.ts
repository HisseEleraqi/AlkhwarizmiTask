import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewNodesComponent } from './view/view-nodes/view-nodes.component';
import { DeleteNodeComponent } from './delete/delete-node/delete-node.component';
import { UpdateNodeComponent } from './update/update-node/update-node.component';
import { AddNodeComponent } from './add/add-node/add-node.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ViewNodesComponent,
    DeleteNodeComponent,
    UpdateNodeComponent,
    AddNodeComponent,
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-tree-app';
}
