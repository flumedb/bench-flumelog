# bench-flumelog

a simple benchmark of flumedb log implementations.

## method

append as many items as can be added in 10 seconds,
then stream all items, then read out those items randomly.

for each phase, record the number of items per second, and the mb/second.

## results

### [flumelog-offset](https://github.com/flumedb/flumelog-offset)
```
name, ops/second, mb/second, ops, total mb, mb/second, mb/op
append 93746.3029576339 11.862183646332447 938213 118.71673393249512 0.00012653494881492274 8.906356811523438
stream 89671.13288671133 11.346503670555796 896801 113.47638320922852 0.00012653463054705395 24.15149688720703
random 24010.69893010699 3.0381734127307487 240131 30.384772300720215 0.00012653415136204912 22.291366577148438
```
### [flumelog-level](https://github.com/flumedb/flumelog-level)

```
name, ops/second, mb/second, ops, total mb, mb/second, mb/op
append 54300.04982561036 6.86875596590522 544901 68.92796611785889 0.00012649631055523642
stream 69618.11677526511 8.80643491987465 544901 68.92796611785889 0.00012649631055523642
random 28183.68163183682 3.565163388751457 281865 35.65519905090332 0.00012649743334895543
```

### [flumelog-memory](https://github.com/flumedb/flumelog-memory)

memory is extremely fast, because it's kept completely in memory.

```
name, ops/second, mb/second, ops, total mb
append 105565.36502546689 13.356010408819609 1057026 133.73373222351074
stream 3632391.7525773197 459.56609011515724 1057026 133.73373222351074
random 548126.0873912609 69.34816219153231 5481809 693.5509700775146
```

stream reads more per second but only the same total number of mb, because stream stops
once it has read the entire log, but random continues for 10 seconds.

### [flumelog-idb](https://github.com/flumedb/flumelog-idb)

(firefox)
```
name, ops/second, mb/second, ops, total mb, mb/second
append 7205.683606405628 0.91206355414037 77843 9.853022575378418
stream 2533.9466053394663 0.3205902897564248 25342 3.206223487854004
random 3531.9468053194682 0.4468583521896834 35323 4.469030380249023
```
(electron/chromium)
```
name, ops/second, mb/second, ops, total mb, mb/second
append 5727.681246255243 0.7248968570466191 57357 7.259117126464844
stream 2909.80901909809 0.36796313883626286 29101 3.679999351501465
random 4517.296540691861 0.5712491039084663 45182 5.7136335372924805
```

something about indexed db is making this very slow!



