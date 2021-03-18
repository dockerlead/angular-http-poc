import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createPosts(title: string, content: string){
    const postData: Post = {
      title,
      content,
    };
    this.http.post<{ name: string }>(
      'https://angular-udemy-course-recipe-default-rtdb.firebaseio.com/posts.json',
      postData
    )
    .subscribe(() => {
    }, error => {
      this.error.next(error.message);
    });
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: Post }>(
      'https://angular-udemy-course-recipe-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({
          'Custom-Header': 'Hello'
        })
      }
    )
    .pipe(
      map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({...responseData[key], id: key});
          }
        }
        return postsArray;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  deletePosts() {
    return this.http.delete(
      'https://angular-udemy-course-recipe-default-rtdb.firebaseio.com/posts.json'
    );
  }
}
