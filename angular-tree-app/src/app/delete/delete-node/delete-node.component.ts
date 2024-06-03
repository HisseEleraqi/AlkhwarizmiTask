import { Component, Output, EventEmitter } from '@angular/core';
import { TreeNodeService } from '../../service/tree-node.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-delete-node',
  templateUrl: './delete-node.component.html',
  styleUrls: ['./delete-node.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
})
export class DeleteNodeComponent {
  @Output() nodeDeleted = new EventEmitter<void>();

  nodeForm: FormGroup;

  constructor(
    private treeNodeService: TreeNodeService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.nodeForm = this.fb.group({
      id: '',
    });
  }

  onSubmit() {
    const nodeId = this.nodeForm.value.id;

    this.alertService
      .confirm('Do you really want to delete this node?')
      .then((result) => {
        if (result) {
          this.treeNodeService.deleteNode(nodeId).subscribe({
            next: () => {
              this.alertService.success('Node deleted successfully');
              this.nodeDeleted.emit(); // Emit event to refresh nodes
            },
            error: (err) => {
              if (err.status === 409) {
                this.alertService.error(
                  `Failed to delete node. ${err.error.message}`
                );
              } else {
                this.alertService.error(
                  'Failed to delete node. Please check the console for details.'
                );
              }
              console.error('Error deleting node:', err);
            },
          });
        }
      });
  }
}
