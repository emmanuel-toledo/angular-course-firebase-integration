import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';
import { take } from 'rxjs/operators';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    constructor(private db: AngularFirestore) {}

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }

    onReadDoc() {
        // Get only the data.
        this.db.doc("/courses/5H99KjpEINYRNfhNuJOT")
            .get()
            .subscribe(snap => {
                // console.log(snap.id);
                // console.log(snap.data());
            });
        
        // Get the data and firebase notify any change in the data to a realtime update.
        // works both documents and collections.
        // Mostly used for collections and with sample data.
        this.db.doc("/courses/5H99KjpEINYRNfhNuJOT")
            .snapshotChanges() // This method open a web soket connection to firebase automatically.
            .subscribe(snap => {
                // console.log(snap.payload.id);
                // console.log(snap.payload.data());
            });

        // We also have the following alternative.
        // With this method (valueChanges) we don't receive the snapshot of the course, instead 
        // we receive the course model but with out it's id.
        // Mostly used for documents and with sample data.
        this.db.doc("/courses/5H99KjpEINYRNfhNuJOT")
            .valueChanges()
            .pipe(
                take(1) // You can apply this to get only one record.
            )
            .subscribe(course => {
                console.log(course);
            });

        // Another alternative it is to execute http request using "get" method 
    }

    onReadCollection() {
        this.db.collection("/courses").get()
            .subscribe(snap => {
                if(!snap.empty) {
                    snap.forEach(x => {
                        // console.log(x.id);
                        // console.log(x.data());
                    });
                }
            });

        // Another example. Get nested collections.
        this.db.collection("/courses/5H99KjpEINYRNfhNuJOT/lessons").get()
        .subscribe(snap => {
            // console.log(snap.docs);
            snap.docs.forEach(d => {
                // console.log(d.data());
            })
        });

        // Another example to pass query parameters filter.
        this.db.collection(
            "/courses/5H99KjpEINYRNfhNuJOT/lessons",
            ref => ref.where("seqNo", "==", 1)// collection reference (ref).
            ).get()
            .subscribe(snap => {
                snap.docs.forEach(doc => {
                    // console.log(doc.data());
                })
            });
        
        // You can apply an order by. Also can apply a limit of records (top in SQL).
        this.db.collection(
            "/courses/5H99KjpEINYRNfhNuJOT/lessons",
            ref => ref.where("seqNo", "<=", 5).limit(2).orderBy("seqNo")
            ).get()
            .subscribe(snap => {
                snap.docs.forEach(doc => {
                    // console.log(doc.data());
                })
            });

        // Al consultar firebase, por cada query generara un index por cada campo del resultado
        // de la consulta. En ocasiones es necesario generar nuestros propios index dentro de 
        // firebase console.
        // Si ve un mensaje de error relacionado con que el query requiere de un index, puede
        // acceder a la URL que se ve en el mensaje.
        // Una vez que crea el index, debe de esperar un momento en lo que este se publica.
        // La razón por la que firebase tiene un alto performance es debido a los index con los
        // que cuenta.
        this.db.collection(
            "/courses",
            ref => ref.where("seqNo", "<=", 5)
                      .where("url", "==", "serverless-angular")
                      .orderBy("seqNo")
            ).get()
            .subscribe(snap => {
                // console.log(snap.size); // Get collection size.
                snap.docs.forEach(doc => {
                    console.log(doc.data());
                    // Get nested collection after to get a doc.
                    doc.ref.collection("lessons").orderBy("seqNo", "desc").get().then(x => x.docs.forEach(item => console.log(item.data())));
                })
            });
    }

    onReadCollectionGroup() {
        // Get all the collection with lessons collection independent of where is located.
        this.db.collectionGroup(
            "lessons")
            // ref => ref.where("seqNo", "==", 1)) // We will receive only one lesson.
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            });
    }
}
















