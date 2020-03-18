import Vue from 'vue';

// Get all the javascript files from the directory where this file is.
const filters = require.context('.', true, /\.(js)$/i);

// This will be our regular expression to match against the files.
const nameReg = /([a-z0-9]+)\./i;

filters.keys().forEach((key) => {
 const name = key.match(nameReg)[1];

 // If the file name is globals we ignore it.
 if (name === 'globals') return;

 // In case the file only exports one default function we add it to Vue.filter
 if (filters(key).default) {
   Vue.filter(key, filters(key).default);
 } else {

   // We iterate over each export function and add it to Vue.filter
   Object.keys(filters(key)).forEach((filter) => {
     if (Object.prototype.hasOwnProperty.call(filters(key), filter)) {
       Vue.filter(filter, filters(key)[filter]);
     }
   });
 }
});