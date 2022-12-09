const arrayOfObject = [{ id: 1, name: 'john' }, {id: 2, name: 'max'}];

let checkUsername = obj => obj.name === 'max';

console.log(arrayOfObject.some(checkUsername))