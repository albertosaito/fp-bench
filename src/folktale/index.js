const Maybe = require('folktale/maybe')
const { map, curry, compose, toUpper, take, filter, prop } = require('ramda')
const comments = take(5)(require('../mock-data/comments.json'))
// inneficient and unsafe
// const findImportantEmails = compose(
//   map(toUpper),
//   map(prop('email'))
// )

// A little better but still unsafe
// const findImportantEmails = map(compose(toUpper, prop('email')))

// try to make it safe, avoid null checks, be clever
const mProp = curry((prop, obj) => (prop in obj) ? Maybe.Just(obj[prop]) : Maybe.Nothing())
// // meh
// const findImportantEmails = map(
//   compose(
//     map(toUpper),
//     mProp('emaisl')
//   )
// )
const formatMystery = compose(map(toUpper), mProp('mystery'))
// kinda good solution when we can/want to ignore Nothings
const findMysteries = map(formatMystery)
const filterNothing = filter(prop('value'))
const filterMysteries = compose(filterNothing, findMysteries)
const obtainValue = prop('value')
console.log(map(obtainValue)(filterMysteries(comments)))

// let's try to use .chain adn .map
// chain takes another function that returns a maybe
// map can be applied to return the current Maybe a value
const getComment = flag => flag ? Maybe.of(comments[0]) : Maybe.Nothing()
const shoutIt = message => `${message}!`
const result = getComment(true)
  .chain(formatMystery)
  .map(shoutIt)
console.log(result.value) // get the value from Maybe

module.exports = {
  findMysteries
}
