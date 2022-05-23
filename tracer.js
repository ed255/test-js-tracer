{
  depth: 0,
  memory: [],
  callStack: [],
  step: function(log, db) {
    let depth = log.getDepth();
    var prev = { offset: 0, len: 0 };
    if (depth == this.depth + 1) {
    } else {
      prev = this.callStack[depth];
    }

    let op = log.op.toString();

    var offset = 0;
    var len = 0;
    if (op == "CALLDATACOPY") {
      offset = log.stack.peek(0);
      len = log.stack.peek(2);
    } else if (op == "CODECOPY") {
      offset = log.stack.peek(0);
      len = log.stack.peek(2);
    } else if (op == "EXTCODECOPY") {
      offset = log.stack.peek(1);
      len = log.stack.peek(3);
    } else if (op == "RETURNDATACOPY") {
      offset = log.stack.peek(0);
      len = log.stack.peek(2);
    } else if (op == "MSTORE") {
      offset = log.stack.peek(0);
      len = 32;
    } else if (op == "MSTORE8") {
      offset = log.stack.peek(0);
      len = 1;
    } else if (op == "CALL") {
      offset = log.stack.peek(5);
      len = log.stack.peek(6);
    } else if (op == "CALLCODE") {
      offset = log.stack.peek(5);
      len = log.stack.peek(6);
    } else if (op == "DELEGATECALL") {
      offset = log.stack.peek(4);
      len = log.stack.peek(5);
    } else if (op == "STATICCALL") {
      offset = log.stack.peek(4);
      len = log.stack.peek(5);
    }
    offset = parseInt(offset);
    var diff = [];
    if (prev.len != 0) {
      diff = [prev.offset, toHex(log.memory.slice(prev.offset, prev.offset + prev.len))];
    }
    this.memory.push({len: log.memory.length(), diff: diff});
    this.callStack[depth] = { offset: offset, len: len };
    this.depth = depth;
  },
  fault: function() {},
  result: function() {
    return this.memory;
  }
}
