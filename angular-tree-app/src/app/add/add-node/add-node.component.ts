import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { TreeNodeService, TreeNode } from '../../service/tree-node.service';
import { AlertService } from '../../service/alert.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
})
export class AddNodeComponent implements OnChanges {
  @Input() parentId: string | null = null; // Accept parentId as input
  nodeForm: FormGroup;
  @Output() nodeAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private treeNodeService: TreeNodeService,
    private alertService: AlertService
  ) {
    this.nodeForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      parentId: [this.parentId],
      children: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['parentId'] &&
      changes['parentId'].currentValue !== changes['parentId'].previousValue
    ) {
      this.nodeForm.patchValue({ parentId: this.parentId });
    }
  }

  get children() {
    return this.nodeForm.get('children') as FormArray;
  }

  addChild() {
    const childForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      parentId: [this.nodeForm.get('id')?.value], // Set parentId automatically
    });
    this.children.push(childForm);
  }

  removeChild(index: number) {
    this.children.removeAt(index);
  }

  onSubmit(): void {
    if (this.nodeForm.invalid) {
      return;
    }

    const newNode: TreeNode = this.nodeForm.value;
    console.log('Submitting new node:', newNode); // Log the data being sent

    this.treeNodeService.createNode(newNode).subscribe({
      next: () => {
        this.alertService.success('Node added successfully');
        this.nodeForm.reset();
        this.children.clear();
        this.nodeAdded.emit();
      },
      error: (err) => {
        this.alertService.error(`Failed to add node. ${err}`);
        console.error('Error adding node:', err);
      },
    });
  }
}
