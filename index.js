var parser = require('tap-parser')
var through = require('through2')
var duplexer = require('duplexer')
var hirestime = require('hirestime')
var prettyms = require('pretty-ms')
var chalk = require('chalk')

module.exports = function() {
  var tap = parser()
  var out = through()
  var stream = duplexer(tap, out)

  function output(str) {
    out.push('  ' + str)
    out.push('\n')
  }

  function format(total, time) {
    var word = (total > 1) ? 'tests' : 'test'
    return total + ' ' + word + ' complete (' + time + ')'
  }

  function summary(errors) {
    var word = (errors > 1) ? 'tests' : 'test'
    return errors + ' ' + word + ' failed'
  }

  var timer = hirestime()
  var errors = []
  var current = null

  tap.on('comment', function(res) {
    current = '\n' + '  ' + res
  })

  tap.on('assert', function(res) {
    var assert = current + ' ' + res.name
    if (!res.ok) errors.push(chalk.white(assert))
  })

  tap.on('extra', function(res) {
    if (res !== '') errors.push(chalk.gray(res))
  })

  tap.on('results', function(res) {
    var count = res.asserts.length
    var time = prettyms(timer())
    out.push('\n')

    if (errors.length) {
      output(chalk.yellow(format(count, time)))
      output(chalk.red(summary(Math.floor(errors.length/7))))
      errors.forEach(function(error) {
        output(error)
      })
    } else {
      output(chalk.green(format(count, time)))
    }

    out.push('\n')
  })

  stream.errors = errors
  return stream
}
