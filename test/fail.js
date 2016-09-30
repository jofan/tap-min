var test = require('tape')

test('1 === 2', function(assert) {
  assert.plan(1)
  assert.equal(1, 2)
})

test('2 === 1', function(assert) {
  assert.plan(1)
  assert.equal(2, 1)
})

test('3 === 1', function(assert) {
  assert.plan(1)
  assert.equal(3, 1)
})
