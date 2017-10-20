
var pull = require('pull-stream')
var paramap = require('pull-paramap')

var a = []
while(a.length < 1000) {
    var v = {seq: a.length, random: Math.random(), time: new Date().toString(), foo: {bar: Math.random() < 0.5, length: 0}}
    v.length = JSON.stringify(v).length
    v.length = JSON.stringify(v).length
    a.push(v)
  }

function generate () {
  return pull.infinite(function (e) {
    return a[~~(Math.random()*a.length)]
    //return {seq: e, random: Math.random(), time: new Date().toString(), foo: {bar: Math.random() < 0.5}}
  })
}

var MB = 1024*1024

function length(data) {
  return data.length || data.value.length
}

function print (str) {
  str = [].slice.call(arguments).map(function (s) {
    return 'string' === typeof s || Number.isInteger(s) ? s : Math.floor(s*1000)/1000
  }).join(', ')

  if('undefined' !== typeof window) {
    var pre = document.createElement('pre')
    pre.textContent = str
    document.body.appendChild(pre)
  }
  console.log(str)
}

module.exports = function (createLog, N, T) {

  var start = Date.now()
  var log = createLog()
  var seqs = []

  print('name, ops/second, mb/second, ops, total-mb, seconds')

  log.since.once(function () {
  //how many items can you append in 10 seconds.
    next()
  })

  function next () {
    var start = Date.now(), c = 0, total = 0
    pull(
      generate(),
      paramap(function (data, cb) {
        c ++
        total += length(data)
//        return cb()
        log.append(data, cb)
      }, 4*1024),
      pull.drain(function () {
        if(Date.now() - start > 10e3) return false
      }, function () {
        var time = (Date.now() - start)/1000
        print('append', c/time, (total/MB)/time, c, total/MB, time)
        next2()
      })
    )
  }

  function next2 () {
    var total = 0, c = 0, start = Date.now()
    pull(
      log.stream(),
      pull.drain(function (d) {
        c++
        total += length(d)
        seqs.push(d.seq)
        if(Date.now() - start > 10e3) return false
      }, function () {
        var time = (Date.now() - start)/1000
        print('stream', c/time, (total/MB)/time, c, total/MB, time)
        next_para()
      })
    )
  }

  function next_para () {
    var total = 0, c = 0, start = Date.now()
    var N = 10, i = 0
    var n = N
    for(var i = 0; i < N; i++)
      pull(
        log.stream(),
        pull.drain(function item (d) {
          c++;
          total += length(d)
          seqs.push(d.seq)
          if(Date.now() - start > 10e3) return false
        }, function () {
          if(--n) return
          var time = (Date.now() - start)/1000
          print('stream10', (c/time), ((total/MB)/time), c, (total/MB), time)
          next3()
        })
      )


  }

  function next3 () {
    var total = 0, c = 0, start = Date.now()
    pull(
      pull.infinite(function (e) {
        return seqs[~~(Math.random()*seqs.length)]
      }),
      paramap(function (seq, cb) {
        log.get(seq, cb)
      }, 1024),
      pull.drain(function (d) {
        c++
        total += length(d)
        if(Date.now() - start > 10e3) return false
      }, function () {
        var time = (Date.now() - start)/1000
        print('random', c/time, (total/MB)/time, c, total/MB, time)
      })
    )
  }
}




