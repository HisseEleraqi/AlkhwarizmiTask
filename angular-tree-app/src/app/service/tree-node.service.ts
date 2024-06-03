import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TreeNode {
  id: string;
  parentId: string | null;
  name: string;
  children: TreeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class TreeNodeService {
  private apiUrl = 'http://localhost:5062/api/TreeNode';

  constructor(private http: HttpClient) {}

  getNodes(): Observable<TreeNode[]> {
    return this.http
      .get<TreeNode[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getNode(id: string): Observable<TreeNode> {
    return this.http
      .get<TreeNode>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createNode(node: TreeNode): Observable<TreeNode> {
    return this.http
      .post<TreeNode>(this.apiUrl, node)
      .pipe(catchError(this.handleError));
  }

  updateNode(id: string, node: TreeNode): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}`, node)
      .pipe(catchError(this.handleError));
  }

  deleteNode(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteNodes(ids: string[]): Observable<void> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { ids },
    };
    return this.http
      .delete<void>(this.apiUrl, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
