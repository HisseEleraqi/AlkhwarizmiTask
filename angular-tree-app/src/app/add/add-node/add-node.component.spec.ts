import { Component } from '@angular/core';
import { TreeNodeService, TreeNode } from '../../service/tree-node.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
})
export class AddNodeComponent {
  nodeForm: FormGroup;

  constructor(
    private treeNodeService: TreeNodeService,
    private fb: FormBuilder
  ) {
    this.nodeForm = this.fb.group({
      id: '',
      parentId: '',
      name: '',
      children: this.fb.array([]), // Initialize children as a FormArray
    });
  }

  get children() {
    return this.nodeForm.get('children') as FormArray;
  }

  addChild() {
    this.children.push(this.fb.control(''));
  }

  removeChild(index: number) {
    this.children.removeAt(index);
  }

  onSubmit() {
    const newNode: TreeNode = {
      id: this.nodeForm.value.id,
      parentId: this.nodeForm.value.parentId || null,
      name: this.nodeForm.value.name,
      children: this.nodeForm.value.children,
    };

    console.log('Submitting new node:', newNode); // Log the newNode object for debugging

    this.treeNodeService.createNode(newNode).subscribe({
      next: (result) => {
        console.log('Node created:', result);
      },
      error: (err) => {
        console.error('Error creating node:', err);
        // Optionally display a user-friendly message
        alert('Failed to create node. Please check the console for details.');
      },
    });
  }
}
