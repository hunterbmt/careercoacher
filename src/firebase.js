import FireBase from 'firebase';
import _ from 'lodash';


const config = {
    apiKey: 'AIzaSyDhf33j7sSZWg676luJQhIAhu3Nf0bsxAw',
    authDomain: 'careercoacher-e43da.firebaseapp.com',
    databaseURL: 'https://careercoacher-e43da.firebaseio.com',
    storageBucket: 'careercoacher-e43da.appspot.com',
    messagingSenderId: '519924061811'
};

const firebase = FireBase.initializeApp(config);

export const database = firebase.database();
export const getData = (part) => database.ref(part).once('value').then((snapshot) => snapshot.val())
export const update = (part, data) => database.ref().update({[part]: data});
export const writeAnswers = (user, data) => database.ref(`answers/${user}`).set(data);

const getLastIndexDefault = (data) => _.isEmpty(data) ? -1 : _.last(Object.keys(data))

export const getLastIndex = (part) => getData(part).then((data) => getLastIndexDefault(data))
export default firebase;

