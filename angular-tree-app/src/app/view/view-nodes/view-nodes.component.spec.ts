import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TreeNodeService, TreeNode } from '../../service/tree-node.service';
import { AddNodeComponent } from '../../add/add-node/add-node.component';
import { UpdateNodeComponent } from '../../update/update-node/update-node.component';
import { AlertService } from '../../service/alert.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-nodes',
  templateUrl: './view-nodes.component.html',
  styleUrls: ['./view-nodes.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    AddNodeComponent,
    UpdateNodeComponent,
  ],
})
export class ViewNodesComponent implements OnInit, AfterViewInit {
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  displayedColumns: string[] = ['name', 'id', 'parentId', 'actions'];
  expandedNode: TreeNode | null = null;
  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private treeNodeService: TreeNodeService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.loadNodes();
    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  ngAfterViewInit() {
    this.treeControl.dataNodes = this.dataSource.data;
  }

  loadNodes() {
    this.treeNodeService.getNodes().subscribe((nodes) => {
      this.dataSource.data = nodes;
      this.treeControl.dataNodes = nodes;
    });
  }

  refreshNodes() {
    this.loadNodes();
  }

  openAddNodeDialog(node?: TreeNode): void {
    const dialogRef = this.dialog.open(AddNodeComponent, {
      width: '300px',
      data: { parentId: node ? node.id : null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshNodes();
      }
    });
  }

  openUpdateNodeDialog(node: TreeNode): void {
    const dialogRef = this.dialog.open(UpdateNodeComponent, {
      width: '300px',
      data: { node },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshNodes();
      }
    });
  }

  confirmDeleteNode(node: TreeNode): void {
    if (node.children.length > 0) {
      Swal.fire({
        title: 'Warning',
        text: 'This node has children. Do you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteNode(node);
        }
      });
    } else {
      this.deleteNode(node);
    }
  }

  deleteNode(node: TreeNode): void {
    this.treeNodeService.deleteNode(node.id).subscribe({
      next: () => {
        this.alertService.success('Node deleted successfully');
        this.refreshNodes();
      },
      error: (err) => {
        this.alertService.error(`Failed to delete node. ${err}`);
        console.error('Error deleting node:', err);
      },
    });
  }

  applyFilter(filterValue: string) {
    this.treeControl.dataNodes = this.dataSource.data.filter((node) =>
      node.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.treeControl.expandAll();
  }
}
