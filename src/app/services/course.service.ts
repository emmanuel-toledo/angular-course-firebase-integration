import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { Course } from "../model/course";
import { map } from 'rxjs/operators';
import { convertSnaps } from "./db-utils";


@Injectable({
    providedIn: "root"
})
export class CourseService {

    constructor(private readonly db: AngularFirestore) {}

    loadCoursesByCategory(category: string): Observable<Course[]> {
        // By default we recieve the id and data separeted from firebase.
        // You will need create a composite index using the url from the error in console.
        return this.db.collection(
                "courses",
                ref => ref.where("categories", "array-contains", category)
                .orderBy("seqNo"))
                .get()
                .pipe(
                    // With this we return a Course array.
                    map(results => convertSnaps<Course>(results))
                );
                

    }
}