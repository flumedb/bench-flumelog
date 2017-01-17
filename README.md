# bench-flumelog

a simple benchmark of flumedb log implementations.

## method

append as many items as can be added in 10 seconds,
then stream all items, then read out those items randomly.

for each phase, record the number of items per second, and the mb/second.

## results

### [flumelog-offset](https://github.com/flumedb/flumelog-offset)
```
name, ops/second, mb/second, ops, total-mb, seconds
append, 109777.644, 13.881, 1097996, 138.844, 10.002
stream, 105121.787, 13.292, 1051323, 132.942, 10.001
random, 26169.883, 3.309, 261725, 33.095, 10.001
```
### [flumelog-level](https://github.com/flumedb/flumelog-level)

```
name, ops/second, mb/second, ops, total-mb, seconds
append, 64168.894, 8.116, 643229, 81.359, 10.024
stream, 69560.83, 8.798, 643229, 81.359, 9.247
random, 31589.041, 3.995, 315922, 39.959, 10.001
```

### [flumelog-memory](https://github.com/flumedb/flumelog-memory)

memory is extremely fast, because it's kept completely in memory.

```
name, ops/second, mb/second, ops, total-mb, seconds
append, 121065.388, 15.313, 1212712, 153.391, 10.017
stream, 247025.213, 574.498, 1212712, 153.391, 0.267
random, 662146.485, 83.752, -1967807.592, 837.605, 10.001
```

stream reads more per second but only the same total number of mb, because stream stops
once it has read the entire log, but random continues for 10 seconds.

### [flumelog-idb](https://github.com/flumedb/flumelog-idb)

these tests on lenovo x201

(firefox)
```
name, ops/second, mb/second, ops, total-mb, seconds

append, 7738.949, 0.979, 81940, 10.366, 10.588
stream, 2996.709, 0.379, 30054, 3.802, 10.029
random, 4072.355, 0.515, 40805, 5.162, 10.02
```
(electron/chromium)
```
name, ops/second, mb/second, ops, total-mb, seconds
append, 6179.487, 0.782, 65552, 8.295, 10.608
stream, 3189.681, 0.403, 31900, 4.037, 10.001
random, 5695.873, 0.72, 57010, 7.215, 10.009
```

something about indexed db is making this very slow!

---

these runs on Samsung J2, which was the cheapest "smart"
phone I could purchase at my local shop, for $220 NZD. (~158 USD)

(mobile chrome, samsung J2)
```
name, ops/second, mb/second, ops, total-mb, seconds
append, 1884.024, 0.238, 20485, 2.591, 10.873
stream, 839.716, 0.106, 8398, 1.062, 10.001
random, 1060.481, 0.134, 10608, 1.341, 10.003
```

(mobile firefox, samsung J2)
```
name, ops/second, mb/second, ops, total-mb, seconds
append, 2273.374, 0.287, 24582, 3.11, 10.813
stream, 1002.299, 0.126, 10025, 1.268, 10.002
random, 1253.374, 0.158, 12535, 1.586, 10.001
```

mobile is 3-4 times slower.
