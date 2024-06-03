import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { TreeNodeService, TreeNode } from '../../service/tree-node.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddNodeComponent } from '../../add/add-node/add-node.component';
import { UpdateNodeComponent } from '../../update/update-node/update-node.component';

@Component({
  selector: 'app-view-nodes',
  templateUrl: './view-nodes.component.html',
  styleUrls: ['./view-nodes.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AddNodeComponent,
    UpdateNodeComponent,
  ],
})
export class ViewNodesComponent implements OnInit {
  searchForm: FormGroup;
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  selectedAction: string | null = null; // Add this property
  selectedParentId: string | null = null; // Add this property
  selectedNode: TreeNode | null = null; // Add this property

  constructor(
    private fb: FormBuilder,
    private treeNodeService: TreeNodeService,
    public dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.loadNodes();
    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  loadNodes() {
    this.treeNodeService.getNodes().subscribe((nodes) => {
      this.dataSource.data = nodes;
    });
  }

  refreshNodes() {
    this.loadNodes();
  }

  openAddNodeDialog(parentNode?: TreeNode): void {
    this.selectedAction = 'add';
    this.selectedParentId = parentNode ? parentNode.id : null;
    this.selectedNode = null; // Clear selectedNode
  }

  openUpdateNodeDialog(node: TreeNode): void {
    this.selectedAction = 'update';
    this.selectedNode = node;
  }

  confirmDeleteNode(node: TreeNode): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this node?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.treeNodeService.deleteNode(node.id).subscribe(() => {
          Swal.fire('Deleted!', 'Node has been deleted.', 'success');
          this.refreshNodes();
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.treeNodeService.getNodes().subscribe((nodes) => {
        this.dataSource.data = this.filterTreeNodes(nodes, filterValue);
      });
    } else {
      this.loadNodes();
    }
  }

  filterTreeNodes(nodes: TreeNode[], filterValue: string): TreeNode[] {
    return nodes.filter((node) => {
      if (node.name.toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      }
      if (node.children) {
        node.children = this.filterTreeNodes(node.children, filterValue);
        return node.children.length > 0;
      }
      return false;
    });
  }

  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;
}
