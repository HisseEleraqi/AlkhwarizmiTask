import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeNodeService, TreeNode } from '../../service/tree-node.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
  styleUrls: ['./update-node.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateNodeComponent implements OnInit {
  @Input() node!: TreeNode;
  nodeForm: FormGroup;
  @Output() nodeUpdated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private treeNodeService: TreeNodeService
  ) {
    this.nodeForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      parentId: [''],
      children: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.nodeForm.patchValue(this.node);
    if (this.node.children) {
      this.node.children.forEach((child) => this.addExistingChild(child));
    }
  }

  get children(): FormArray {
    return this.nodeForm.get('children') as FormArray;
  }

  addExistingChild(child: TreeNode): void {
    const childForm = this.fb.group({
      id: [child.id, Validators.required],
      name: [child.name, Validators.required],
      parentId: [this.node.id],
    });
    this.children.push(childForm);
  }

  addChild(): void {
    const childForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      parentId: [this.nodeForm.get('id')?.value],
    });
    this.children.push(childForm);
  }

  removeChild(index: number): void {
    this.children.removeAt(index);
  }

  onSubmit(): void {
    if (this.nodeForm.invalid) {
      return;
    }

    const updatedNode: TreeNode = this.nodeForm.value;
    this.treeNodeService.updateNode(this.node.id, updatedNode).subscribe({
      next: () => {
        Swal.fire('Success', 'Node updated successfully', 'success');
        this.nodeUpdated.emit();
      },
      error: (err) => {
        Swal.fire(
          'Error',
          'Failed to update node. Please check the console for details.',
          'error'
        );
        console.error('Error updating node:', err);
      },
    });
  }
}
