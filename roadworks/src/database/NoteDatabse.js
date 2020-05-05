import Realm from 'realm';

const NoteSchema = {
    name: 'Note',
    primaryKey: 'id',
    properties: {
        id: 'int',
        title: 'string',
        description: 'string',
        urgency: {type: 'int', default: 0},
        date: 'date'
    }
};

const options = {
    schema: [NoteSchema]
}

export function writeNote(note){
    return Realm.open(options)
        .then(realm => {
            const id = realm.objects('Note').sorted('id', true)[0].id + 1 ?? 1;
            note.id = id;
            note.date = note.date ?? new Date();
            realm.write(() => {
                realm.create('Note', note);
            });
        });
}

export function readNotes(){
    return Realm.open(options)
        .then(realm => {
            const notes = realm.objects('Note').map(element => {
                return {
                    id: element.id,
                    title: element.title,
                    description: element.description,
                    urgency: element.urgency,
                    date: element.date
                }
            });
            return notes;
        })
        .catch(err => {
            return [];
        });
}

// Might not work
export function updateNote(id, title, description, urgency){
    return Realm.open(options)
        .then(realm => {
            const note = realm.objectForPrimaryKey('Note', id);
            realm.write(() => {
                note.title = title;
                note.description = description;
                note.urgency = urgency;
                note.date = new Date();
            });
        });
}

export const RealmDB = new Realm(options);