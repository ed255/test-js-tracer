{
  depth: 0,
  memory: [],
  callStack: [],
  step: function(log, db) {
    let depth = log.getDepth();
    var memoryPrev = [];
    var memoryLenPrev = 0;
    if (depth == this.depth + 1) {
      memoryPrev = [];
      memoryLenPrev = 0;
    } else {
      memoryPrev = this.callStack[depth];
      memoryLenPrev = this.memory[this.memory.length - 1].len;
    }
    let memoryLen = log.memory.length();
    let memory = log.memory.slice(0, memoryLen);

    var diff = [];
    for (var i = 0; i < memoryLen; i++) {
      var prevByte;
      if (i < memoryLenPrev) {
        prevByte = memoryPrev[i];
      } else {
        prevByte = 0;
      }
      if (prevByte != memory[i]) {
        diff.push([i, memory[i]]);
      }
    }
    this.memory.push({len: memoryLen, diff: diff});
    this.callStack[depth] = memory;
    this.depth = depth;
  },
  fault: function() {},
  result: function() {
    return this.memory;
  }
}
