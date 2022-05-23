{
  depth: 0,
  memory: [],
  callStack: [],
  step: function(log, db) {
    let depth = log.getDepth();
    var memoryPrev = [];
    var memoryLenPrev = 0;
    var changePrev = false;
    if (depth == this.depth + 1) {
      memoryPrev = [];
      memoryLenPrev = 0;
      changePrev = false;
    } else {
      memoryPrev = this.callStack[depth];
      memoryLenPrev = this.memory[this.memory.length - 1].len;
      changePrev = this.memory[this.memory.length - 1].change;
    }
    let memoryLen = log.memory.length();
    let memory = log.memory.slice(0, memoryLen);

    var diff = [];
    let op = log.op.toString();
    var change = false;
    if (op == "CALLDATACOPY" || op == "CODECOPY" || op == "EXTCODECOPY" || op == "RETURNDATACOPY" || op == "MSTORE" || op == "MSTORE8" || op == "CALL" || op == "CALLCODE" || op == "DELEGATECALL" || op == "STATICCALL") {
      change = true;
    } else {
      change = false;
    }
    if (changePrev) {
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
    }
    this.memory.push({len: memoryLen, diff: diff, change: change});
    this.callStack[depth] = memory;
    this.depth = depth;
  },
  fault: function() {},
  compress: function(diff) {
    if (diff.length == 0) {
      return [];
    }
    var c = [];
    var addr = diff[0][0];
    var slice = [diff[0][1]];
    for (var i = 1; i < diff.length; i++) {
      if (diff[i][0] != diff[i-1][0]+1) {
        c.push([addr, toHex(slice)]);
        addr = diff[i][0];
        slice = [];
      }
      slice.push(diff[i][1]);
    }
    c.push([addr, toHex(slice)]);
    return c;
  },
  result: function() {
    return this.memory.map(x => { return {len: x.len, diff: this.compress(x.diff), memOp: x.memOp}; });
  }
}
