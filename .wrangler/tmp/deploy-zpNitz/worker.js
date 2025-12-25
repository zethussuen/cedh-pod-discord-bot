var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/utils/metaDecks.ts
var metaDecks = [
  {
    commanders: ["Kraum, Ludevic's Opus", "Tymna the Weaver"],
    metaShare: 11.54,
    colors: ["B", "R", "U", "W"],
    archetypes: ["mid-range"]
  },
  {
    commanders: ["Kinnan, Bonder Prodigy"],
    metaShare: 8.57,
    colors: ["G", "U"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Rograkh, Son of Rohgahh", "Thrasios, Triton Hero"],
    metaShare: 4.75,
    colors: ["G", "R", "U"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Rograkh, Son of Rohgahh", "Silas Renn, Seeker Adept"],
    metaShare: 4.16,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Sisay, Weatherlight Captain"],
    metaShare: 4.05,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["mid-range", "turbo"]
  },
  {
    commanders: ["Etali, Primal Conqueror // Etali, Primal Sickness"],
    metaShare: 3.96,
    colors: ["G", "R"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Thrasios, Triton Hero", "Tymna the Weaver"],
    metaShare: 3.66,
    colors: ["B", "G", "U", "W"],
    archetypes: ["mid-range", "control", "stax"]
  },
  {
    commanders: ["Noctis, Prince of Lucis"],
    metaShare: 0.1,
    colors: ["B", "U", "W"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Kediss, Emberclaw Familiar", "Malcolm, Keen-Eyed Navigator"],
    metaShare: 0.1,
    colors: ["R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Chatterfang, Squirrel General"],
    metaShare: 0.1,
    colors: ["B", "G"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Kefka, Court Mage // Kefka, Ruler of Ruin"],
    metaShare: 2.75,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Magda, Brazen Outlaw"],
    metaShare: 2.62,
    colors: ["R"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Krark, the Thumbless", "Thrasios, Triton Hero"],
    metaShare: 0.1,
    colors: ["G", "R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Celes, Rune Knight"],
    metaShare: 0.1,
    colors: ["B", "R", "W"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Ral, Monsoon Mage // Ral, Leyline Prodigy"],
    metaShare: 2.28,
    colors: ["R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Vivi Ornitier"],
    metaShare: 2.18,
    colors: ["R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Dargo, the Shipwrecker", "Tymna the Weaver"],
    metaShare: 2.05,
    colors: ["B", "R", "W"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Ellivere of the Wild Court"],
    metaShare: 0.1,
    colors: ["G", "W"],
    archetypes: ["stax"]
  },
  {
    commanders: ["Thrasios, Triton Hero", "Yoshimaru, Ever Faithful"],
    metaShare: 1.82,
    colors: ["G", "U", "W"],
    archetypes: ["mid-range", "stax"]
  },
  {
    commanders: ["Tivit, Seller of Secrets"],
    metaShare: 1.78,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "control"]
  },
  {
    commanders: ["Terra, Magical Adept // Esper Terra"],
    metaShare: 1.57,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Lumra, Bellow of the Woods"],
    metaShare: 1.29,
    colors: ["G"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Malcolm, Keen-Eyed Navigator", "Vial Smasher the Fierce"],
    metaShare: 1.27,
    colors: ["B", "R", "U"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Norman Osborn // Green Goblin"],
    metaShare: 1.27,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Yuriko, the Tiger's Shadow"],
    metaShare: 1.21,
    colors: ["B", "U"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Tayam, Luminous Enigma"],
    metaShare: 1.2,
    colors: ["B", "G", "W"],
    archetypes: ["stax", "mid-range"]
  },
  {
    commanders: ["Marneus Calgar"],
    metaShare: 1.11,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "stax"]
  },
  {
    commanders: ["Glarb, Calamity's Augur"],
    metaShare: 1.08,
    colors: ["B", "G", "U"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Esika, God of the Tree // The Prismatic Bridge"],
    metaShare: 0.1,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Inalla, Archmage Ritualist"],
    metaShare: 0.92,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["K'rrik, Son of Yawgmoth"],
    metaShare: 0.88,
    colors: ["B"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Ob Nixilis, Captive Kingpin"],
    metaShare: 0.85,
    colors: ["B", "R"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Derevi, Empyrial Tactician"],
    metaShare: 0.84,
    colors: ["G", "U", "W"],
    archetypes: ["stax", "mid-range"]
  },
  {
    commanders: ["Rocco, Cabaretti Caterer"],
    metaShare: 0.84,
    colors: ["G", "R", "W"],
    archetypes: ["mid-range"]
  },
  {
    commanders: ["The Wandering Minstrel"],
    metaShare: 0.77,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["mid-range", "control"]
  },
  {
    commanders: ["Winota, Joiner of Forces"],
    metaShare: 0.75,
    colors: ["R", "W"],
    archetypes: ["turbo", "stax"]
  },
  {
    commanders: ["Kenrith, the Returned King"],
    metaShare: 0.72,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range", "control"]
  },
  {
    commanders: ["Y'shtola, Night's Blessed"],
    metaShare: 0.71,
    colors: ["B", "U", "W"],
    archetypes: ["turbo", "control", "mid-range"]
  },
  {
    commanders: ["Atraxa, Grand Unifier"],
    metaShare: 0.71,
    colors: ["B", "G", "U", "W"],
    archetypes: ["mid-range", "stax"]
  },
  {
    commanders: ["Dihada, Binder of Wills"],
    metaShare: 0.68,
    colors: ["B", "R", "W"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Urza, Lord High Artificer"],
    metaShare: 0.68,
    colors: ["U"],
    archetypes: ["turbo", "mid-range", "stax"]
  },
  {
    commanders: ["Stella Lee, Wild Card"],
    metaShare: 0.63,
    colors: ["R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Malcolm, Keen-Eyed Navigator", "Tymna the Weaver"],
    metaShare: 0.63,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "control"]
  },
  {
    commanders: ["Tevesh Szat, Doom of Fools", "Thrasios, Triton Hero"],
    metaShare: 0.61,
    colors: ["B", "G", "U"],
    archetypes: ["mid-range", "control"]
  },
  {
    commanders: ["Talion, the Kindly Lord"],
    metaShare: 0.59,
    colors: ["B", "U"],
    archetypes: ["mid-range", "stax", "control"]
  },
  {
    commanders: ["Najeela, the Blade-Blossom"],
    metaShare: 0.54,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Zhulodok, Void Gorger"],
    metaShare: 0.54,
    colors: ["C"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Zirda, the Dawnwaker"],
    metaShare: 0.54,
    colors: ["R", "W"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["The Gitrog Monster"],
    metaShare: 0.52,
    colors: ["B", "G"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Korvold, Fae-Cursed King"],
    metaShare: 0.49,
    colors: ["B", "G", "R"],
    archetypes: ["mid-range", "turbo"]
  },
  {
    commanders: ["Heliod, the Radiant Dawn // Heliod, the Warped Eclipse"],
    metaShare: 0.49,
    colors: ["U", "W"],
    archetypes: ["control", "stax"]
  },
  {
    commanders: ["Krark, the Thumbless", "Sakashima of a Thousand Faces"],
    metaShare: 0.49,
    colors: ["R", "U"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Gwenom, Remorseless"],
    metaShare: 0.49,
    colors: ["B"],
    archetypes: ["turbo"]
  },
  {
    commanders: ["Rowan, Scion of War"],
    metaShare: 0.46,
    colors: ["B", "R"],
    archetypes: ["turbo", "mid-range"]
  },
  {
    commanders: ["Elsha of the Infinite"],
    metaShare: 0.42,
    colors: ["R", "U", "W"],
    archetypes: ["turbo", "control"]
  },
  {
    commanders: ["Arcum Dagsson"],
    metaShare: 0.38,
    colors: ["U"],
    archetypes: ["turbo", "stax"]
  }
  // NEW
];

// src/utils/podGenerator.ts
var totalMetaShare = metaDecks.reduce((sum, deck) => sum + deck.metaShare, 0);
function getWeightedRandomMetaDeck() {
  if (metaDecks.length === 0) {
    throw new Error("metaDecks array is empty");
  }
  const random = Math.random() * totalMetaShare;
  let cumulativeWeight = 0;
  for (const deck of metaDecks) {
    cumulativeWeight += deck.metaShare;
    if (random <= cumulativeWeight) {
      return deck;
    }
  }
  return metaDecks[metaDecks.length - 1];
}
__name(getWeightedRandomMetaDeck, "getWeightedRandomMetaDeck");
function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
__name(shuffle, "shuffle");
function generatePod(playerCount = 4, lockedSeats = []) {
  const seats = new Array(playerCount);
  const lockedPositions = /* @__PURE__ */ new Set();
  let hasUser = false;
  lockedSeats.forEach((seat) => {
    if (seat.position < playerCount) {
      seats[seat.position] = seat;
      lockedPositions.add(seat.position);
      if (seat.isUser) hasUser = true;
    }
  });
  const unlockedPositions = [];
  for (let i = 0; i < playerCount; i++) {
    if (!lockedPositions.has(i)) {
      unlockedPositions.push(i);
    }
  }
  const randomSeats = [];
  if (!hasUser) {
    randomSeats.push({ isUser: true, commander: "You", colors: [] });
  }
  while (randomSeats.length < unlockedPositions.length) {
    const deck = getWeightedRandomMetaDeck();
    const commanderName = deck.commanders.join(" / ");
    randomSeats.push({
      isUser: false,
      commander: commanderName,
      colors: deck.colors
    });
  }
  const shuffledSeats = shuffle(randomSeats);
  unlockedPositions.forEach((position, index) => {
    seats[position] = {
      ...shuffledSeats[index],
      position
    };
  });
  return seats.map((seat, index) => {
    if (!seat) {
      throw new Error(`Seat at position ${index} is undefined`);
    }
    return {
      ...seat,
      position: index
    };
  });
}
__name(generatePod, "generatePod");

// src/utils/moxfield.ts
function extractDeckId(url) {
  const match = url.match(/moxfield\.com\/decks\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
__name(extractDeckId, "extractDeckId");
var DECK_CACHE_TTL = 300;
async function fetchMoxfieldDeck(deckId, apiKey, cache) {
  const cacheKey = `deck:${deckId}`;
  if (cache) {
    const cached = await cache.get(cacheKey, "json");
    if (cached) {
      console.log(`Cache hit for deck ${deckId}`);
      return cached;
    }
  }
  console.log(`Cache miss for deck ${deckId}, fetching from Moxfield`);
  const response = await fetch(`https://api2.moxfield.com/v2/decks/all/${deckId}`, {
    headers: {
      "User-Agent": `MoxKey; ${apiKey}`,
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Moxfield API error: ${response.status}`);
  }
  const deck = await response.json();
  if (cache) {
    await cache.put(cacheKey, JSON.stringify(deck), { expirationTtl: DECK_CACHE_TTL });
  }
  return deck;
}
__name(fetchMoxfieldDeck, "fetchMoxfieldDeck");
function getCommanderNames(deck) {
  const commanders = Object.values(deck.commanders || {});
  if (commanders.length === 0) {
    return deck.name;
  }
  return commanders.map((c) => c.card.name).join(" / ");
}
__name(getCommanderNames, "getCommanderNames");
function getRandomMainboardCards(deck, count3 = 7) {
  const mainboardEntries = Object.values(deck.mainboard || {});
  if (mainboardEntries.length === 0) {
    return [];
  }
  const expandedDeck = [];
  for (const entry of mainboardEntries) {
    const quantity = entry.quantity || 1;
    const scryfallId = entry.card.scryfall_id || entry.card.scryfallId || entry.card.id || "";
    for (let i = 0; i < quantity; i++) {
      expandedDeck.push({
        name: entry.card.name,
        scryfallId
      });
    }
  }
  console.log(`Deck has ${mainboardEntries.length} unique cards, ${expandedDeck.length} total cards`);
  for (let i = expandedDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expandedDeck[i], expandedDeck[j]] = [expandedDeck[j], expandedDeck[i]];
  }
  return expandedDeck.slice(0, Math.min(count3, expandedDeck.length));
}
__name(getRandomMainboardCards, "getRandomMainboardCards");

// src/utils/scryfall.ts
async function fetchCardImages(scryfallIds) {
  if (scryfallIds.length === 0) {
    return [];
  }
  const requestBody = {
    identifiers: scryfallIds.map((id) => ({ id }))
  };
  console.log("Scryfall request body:", JSON.stringify(requestBody));
  const response = await fetch("https://api.scryfall.com/cards/collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "cedh-pod-discord-bot/1.0"
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Scryfall error response:", errorText);
    throw new Error(`Scryfall API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  const cardMap = /* @__PURE__ */ new Map();
  for (const card of data.data) {
    let imageUrl;
    if (card.image_uris) {
      imageUrl = card.image_uris.normal || card.image_uris.large || card.image_uris.small;
    } else if (card.card_faces && card.card_faces[0]?.image_uris) {
      imageUrl = card.card_faces[0].image_uris.normal || card.card_faces[0].image_uris.large || card.card_faces[0].image_uris.small;
    }
    if (imageUrl) {
      cardMap.set(card.id, {
        name: card.name,
        imageUrl,
        scryfallId: card.id
      });
    }
  }
  const result = [];
  for (const id of scryfallIds) {
    const card = cardMap.get(id);
    if (card) {
      result.push(card);
    }
  }
  return result;
}
__name(fetchCardImages, "fetchCardImages");

// node_modules/@cf-wasm/internals/dist/polyfills/image-data.js
var globalObject = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : self;
if (!("ImageData" in globalObject)) {
  let getColorSpaceFromImageSettings = /* @__PURE__ */ __name(function(imageSettings) {
    if (typeof imageSettings !== "undefined") {
      if (typeof imageSettings !== "object") {
        throw new TypeError("Failed to construct 'ImageData': The provided value is not of type 'ImageDataSettings'.");
      }
      if (imageSettings && "colorSpace" in imageSettings && typeof imageSettings.colorSpace !== "undefined") {
        if (typeof imageSettings.colorSpace !== "string" || !colorSpaceEnum.includes(imageSettings.colorSpace)) {
          throw new TypeError(
            `Failed to construct 'ImageData': Failed to read the 'colorSpace' property from 'ImageDataSettings': The provided value '${imageSettings.colorSpace}' is not a valid enum value of type PredefinedColorSpace.`
          );
        }
        return imageSettings.colorSpace;
      }
    }
    return "srgb";
  }, "getColorSpaceFromImageSettings");
  getColorSpaceFromImageSettings2 = getColorSpaceFromImageSettings;
  const widthMap = /* @__PURE__ */ new WeakMap();
  const heightMap = /* @__PURE__ */ new WeakMap();
  const colorSpaceMap = /* @__PURE__ */ new WeakMap();
  const colorSpaceEnum = ["display-p3", "srgb"];
  class ImageData22 {
    static {
      __name(this, "ImageData2");
    }
    constructor(...args) {
      let imageWidth;
      let imageHeight;
      let imageData;
      let imageColorSpace;
      const [arg1, arg2, arg3, arg4] = args;
      if (args.length < 2) {
        throw new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only ${args.length} present.`);
      }
      if (typeof arg1 === "object") {
        if (!(arg1 instanceof Uint8ClampedArray)) {
          throw new TypeError("Failed to construct 'ImageData': parameter 1 is not of type 'Uint8ClampedArray'.");
        }
        if (typeof arg2 !== "number" || arg2 === 0) {
          throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.");
        }
        imageData = arg1;
        imageWidth = arg2 >>> 0;
        if (imageWidth * 4 > imageData.length) {
          throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.");
        }
        if (imageData.length % 4 !== 0) {
          throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of 4.");
        }
        if (imageData.length % (4 * imageWidth) !== 0) {
          throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of (4 * width).");
        }
        if (typeof arg3 !== "undefined") {
          if (typeof arg3 !== "number" || arg3 === 0) {
            throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.");
          }
          imageHeight = arg3 >>> 0;
          if (imageData.length % (4 * imageWidth * imageHeight) !== 0) {
            throw new Error("Failed to construct 'ImageData': The input data length is not equal to (4 * width * height).");
          }
        } else {
          imageHeight = imageData.byteLength / imageWidth / 4;
        }
        imageColorSpace = getColorSpaceFromImageSettings(arg4);
      } else {
        if (typeof arg1 !== "number" || arg1 === 0) {
          throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.");
        }
        imageWidth = arg1 >>> 0;
        if (typeof arg2 !== "number" || arg2 === 0) {
          throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.");
        }
        imageHeight = arg2 >>> 0;
        if (imageWidth * imageHeight >= 1 << 30) {
          throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.");
        }
        imageData = new Uint8ClampedArray(imageWidth * imageHeight * 4);
        imageColorSpace = getColorSpaceFromImageSettings(arg3);
      }
      widthMap.set(this, imageWidth);
      heightMap.set(this, imageHeight);
      colorSpaceMap.set(this, imageColorSpace);
      Object.defineProperty(this, "data", {
        configurable: true,
        enumerable: true,
        value: imageData,
        writable: false
      });
    }
  }
  Object.defineProperty(ImageData22.prototype, "width", {
    enumerable: true,
    configurable: true,
    get() {
      return widthMap.get(this);
    }
  });
  Object.defineProperty(ImageData22.prototype, "height", {
    enumerable: true,
    configurable: true,
    get() {
      return heightMap.get(this);
    }
  });
  Object.defineProperty(ImageData22.prototype, "colorSpace", {
    enumerable: true,
    configurable: true,
    get() {
      return colorSpaceMap.get(this);
    }
  });
  globalObject.ImageData = ImageData22;
}
var getColorSpaceFromImageSettings2;
var ImageData2 = globalObject.ImageData;

// node_modules/@cf-wasm/photon/dist/chunk-3HOZTLH2.js
var wasm;
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}
__name(addToExternrefTable0, "addToExternrefTable0");
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
__name(handleError, "handleError");
function isLikeNone(x) {
  return x === void 0 || x === null;
}
__name(isLikeNone, "isLikeNone");
var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: /* @__PURE__ */ __name(() => {
  throw Error("TextDecoder not available");
}, "decode") };
if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
__name(getUint8ArrayMemory0, "getUint8ArrayMemory0");
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
__name(getStringFromWasm0, "getStringFromWasm0");
var WASM_VECTOR_LEN = 0;
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
__name(passArray8ToWasm0, "passArray8ToWasm0");
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
__name(getDataViewMemory0, "getDataViewMemory0");
var cachedUint8ClampedArrayMemory0 = null;
function getUint8ClampedArrayMemory0() {
  if (cachedUint8ClampedArrayMemory0 === null || cachedUint8ClampedArrayMemory0.byteLength === 0) {
    cachedUint8ClampedArrayMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
  }
  return cachedUint8ClampedArrayMemory0;
}
__name(getUint8ClampedArrayMemory0, "getUint8ClampedArrayMemory0");
function getClampedArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ClampedArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
__name(getClampedArrayU8FromWasm0, "getClampedArrayU8FromWasm0");
var cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: /* @__PURE__ */ __name(() => {
  throw Error("TextEncoder not available");
}, "encode") };
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset2 = 0;
  for (; offset2 < len; offset2++) {
    const code = arg.charCodeAt(offset2);
    if (code > 127) break;
    mem[ptr + offset2] = code;
  }
  if (offset2 !== len) {
    if (offset2 !== 0) {
      arg = arg.slice(offset2);
    }
    ptr = realloc(ptr, len, len = offset2 + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset2, ptr + len);
    const ret = encodeString(arg, view);
    offset2 += ret.written;
    ptr = realloc(ptr, len, offset2, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset2;
  return ptr;
}
__name(passStringToWasm0, "passStringToWasm0");
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug3 = "[";
    if (length > 0) {
      debug3 += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug3 += ", " + debugString(val[i]);
    }
    debug3 += "]";
    return debug3;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
__name(debugString, "debugString");
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}
__name(_assertClass, "_assertClass");
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
__name(getArrayU8FromWasm0, "getArrayU8FromWasm0");
function watermark(img, watermark2, x, y) {
  _assertClass(img, PhotonImage);
  _assertClass(watermark2, PhotonImage);
  wasm.watermark(img.__wbg_ptr, watermark2.__wbg_ptr, x, y);
}
__name(watermark, "watermark");
function resize(photon_img, width, height, sampling_filter) {
  _assertClass(photon_img, PhotonImage);
  const ret = wasm.resize(photon_img.__wbg_ptr, width, height, sampling_filter);
  return PhotonImage.__wrap(ret);
}
__name(resize, "resize");
var SamplingFilter = Object.freeze({
  Nearest: 1,
  "1": "Nearest",
  Triangle: 2,
  "2": "Triangle",
  CatmullRom: 3,
  "3": "CatmullRom",
  Gaussian: 4,
  "4": "Gaussian",
  Lanczos3: 5,
  "5": "Lanczos3"
});
var PhotonImageFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_photonimage_free(ptr >>> 0, 1));
var PhotonImage = class _PhotonImage {
  static {
    __name(this, "_PhotonImage");
  }
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_PhotonImage.prototype);
    obj.__wbg_ptr = ptr;
    PhotonImageFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    PhotonImageFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_photonimage_free(ptr, 0);
  }
  /**
   * Create a new PhotonImage from a Vec of u8s, which represent raw pixels.
   * @param {Uint8Array} raw_pixels
   * @param {number} width
   * @param {number} height
   */
  constructor(raw_pixels, width, height) {
    const ptr0 = passArray8ToWasm0(raw_pixels, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.photonimage_new(ptr0, len0, width, height);
    this.__wbg_ptr = ret >>> 0;
    PhotonImageFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Create a new PhotonImage from a base64 string.
   * @param {string} base64
   * @returns {PhotonImage}
   */
  static new_from_base64(base64) {
    const ptr0 = passStringToWasm0(base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.base64_to_image(ptr0, len0);
    return _PhotonImage.__wrap(ret);
  }
  /**
   * Create a new PhotonImage from a byteslice.
   * @param {Uint8Array} vec
   * @returns {PhotonImage}
   */
  static new_from_byteslice(vec) {
    const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.photonimage_new_from_byteslice(ptr0, len0);
    return _PhotonImage.__wrap(ret);
  }
  /**
   * Create a new PhotonImage from a Blob/File.
   * @param {Blob} blob
   * @returns {PhotonImage}
   */
  static new_from_blob(blob) {
    const ret = wasm.photonimage_new_from_blob(blob);
    return _PhotonImage.__wrap(ret);
  }
  /**
   * Create a new PhotonImage from a HTMLImageElement
   * @param {HTMLImageElement} image
   * @returns {PhotonImage}
   */
  static new_from_image(image) {
    const ret = wasm.photonimage_new_from_image(image);
    return _PhotonImage.__wrap(ret);
  }
  /**
   * Get the width of the PhotonImage.
   * @returns {number}
   */
  get_width() {
    const ret = wasm.photonimage_get_width(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Get the PhotonImage's pixels as a Vec of u8s.
   * @returns {Uint8Array}
   */
  get_raw_pixels() {
    const ret = wasm.photonimage_get_raw_pixels(this.__wbg_ptr);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Get the height of the PhotonImage.
   * @returns {number}
   */
  get_height() {
    const ret = wasm.photonimage_get_height(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Convert the PhotonImage to base64.
   * @returns {string}
   */
  get_base64() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.photonimage_get_base64(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Convert the PhotonImage to raw bytes. Returns PNG.
   * @returns {Uint8Array}
   */
  get_bytes() {
    const ret = wasm.photonimage_get_bytes(this.__wbg_ptr);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Convert the PhotonImage to raw bytes. Returns a JPEG.
   * @param {number} quality
   * @returns {Uint8Array}
   */
  get_bytes_jpeg(quality) {
    const ret = wasm.photonimage_get_bytes_jpeg(this.__wbg_ptr, quality);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Convert the PhotonImage to raw bytes. Returns a WEBP.
   * @returns {Uint8Array}
   */
  get_bytes_webp() {
    const ret = wasm.photonimage_get_bytes_webp(this.__wbg_ptr);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Convert the PhotonImage's raw pixels to JS-compatible ImageData.
   * @returns {ImageData}
   */
  get_image_data() {
    const ret = wasm.photonimage_get_image_data(this.__wbg_ptr);
    return ret;
  }
  /**
   * Convert ImageData to raw pixels, and update the PhotonImage's raw pixels to this.
   * @param {ImageData} img_data
   */
  set_imgdata(img_data) {
    wasm.photonimage_set_imgdata(this.__wbg_ptr, img_data);
  }
  /**
   * Calculates estimated filesize and returns number of bytes
   * @returns {bigint}
   */
  get_estimated_filesize() {
    const ret = wasm.photonimage_get_estimated_filesize(this.__wbg_ptr);
    return BigInt.asUintN(64, ret);
  }
};
var RgbFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_rgb_free(ptr >>> 0, 1));
var RgbaFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_rgba_free(ptr >>> 0, 1));
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
__name(__wbg_load, "__wbg_load");
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_appendChild_8204974b7328bf98 = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.appendChild(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_body_942ea927546a04ba = function(arg0) {
    const ret = arg0.body;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_call_672a4d21634d4a24 = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_createElement_8c9931a732ee2fea = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_data_d1ed736c1e42b10e = function(arg0, arg1) {
    const ret = arg1.data;
    const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_drawImage_03f7ae2a95a9605f = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      arg0.drawImage(arg1, arg2, arg3);
    }, arguments);
  };
  imports.wbg.__wbg_drawImage_2603e2b61e66d571 = function() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
      arg0.drawImage(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    }, arguments);
  };
  imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
      deferred0_0 = arg0;
      deferred0_1 = arg1;
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
  };
  imports.wbg.__wbg_getContext_e9cf379449413580 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments);
  };
  imports.wbg.__wbg_getImageData_c02374a30b126dab = function() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4) {
      const ret = arg0.getImageData(arg1, arg2, arg3, arg4);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_height_1d93eb7f5e355d97 = function(arg0) {
    const ret = arg0.height;
    return ret;
  };
  imports.wbg.__wbg_height_838cee19ba8597db = function(arg0) {
    const ret = arg0.height;
    return ret;
  };
  imports.wbg.__wbg_height_d3f39e12f0f62121 = function(arg0) {
    const ret = arg0.height;
    return ret;
  };
  imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_df82a4d3437bf1cc = function(arg0) {
    let result;
    try {
      result = arg0 instanceof CanvasRenderingContext2D;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof HTMLCanvasElement;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof Window;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
    const ret = arg0.length;
    return ret;
  };
  imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
    const ret = new Error();
    return ret;
  };
  imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  };
  imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_newwithu8clampedarrayandsh_7ea6ee082a25bc85 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_putImageData_4c5aa10f3b3e4924 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      arg0.putImageData(arg1, arg2, arg3);
    }, arguments);
  };
  imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  };
  imports.wbg.__wbg_setheight_da683a33fa99843c = function(arg0, arg1) {
    arg0.height = arg1 >>> 0;
  };
  imports.wbg.__wbg_settextContent_d29397f7b994d314 = function(arg0, arg1, arg2) {
    arg0.textContent = arg1 === 0 ? void 0 : getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setwidth_c5fed9f5e7f0b406 = function(arg0, arg1) {
    arg0.width = arg1 >>> 0;
  };
  imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === "undefined" ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === "undefined" ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === "undefined" ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === "undefined" ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_width_4f334fc47ef03de1 = function(arg0) {
    const ret = arg0.width;
    return ret;
  };
  imports.wbg.__wbg_width_5dde457d606ba683 = function(arg0) {
    const ret = arg0.width;
    return ret;
  };
  imports.wbg.__wbg_width_b0c1d9f437a95799 = function(arg0) {
    const ret = arg0.width;
    return ret;
  };
  imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_init_externref_table = function() {
    const table3 = wasm.__wbindgen_export_2;
    const offset2 = table3.grow(4);
    table3.set(0, void 0);
    table3.set(offset2 + 0, void 0);
    table3.set(offset2 + 1, null);
    table3.set(offset2 + 2, true);
    table3.set(offset2 + 3, false);
    ;
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === void 0;
    return ret;
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
__name(__wbg_get_imports, "__wbg_get_imports");
function __wbg_init_memory(imports, memory) {
}
__name(__wbg_init_memory, "__wbg_init_memory");
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  cachedUint8ClampedArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
__name(__wbg_finalize_init, "__wbg_finalize_init");
function initSync(module) {
  if (wasm !== void 0) return wasm;
  if (typeof module !== "undefined") {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  __wbg_init_memory(imports);
  const instance = new WebAssembly.Instance(module, imports);
  return __wbg_finalize_init(instance, module);
}
__name(initSync, "initSync");
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  __wbg_init_memory(imports);
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}
__name(__wbg_init, "__wbg_init");
var photon_rs_default = __wbg_init;
async function initPhoton(input) {
  if (initPhoton.initialized) {
    throw new Error("(@cf-wasm/photon): Function already called. The `initPhoton()` function can be used only once.");
  }
  if (!input) {
    throw new Error("(@cf-wasm/photon): Argument `input` is not valid.");
  }
  initPhoton.initialized = true;
  initPhoton.promise = (async () => {
    const output = await photon_rs_default(await input);
    initPhoton.ready = true;
    return output;
  })();
  return initPhoton.promise;
}
__name(initPhoton, "initPhoton");
initPhoton.sync = (input) => {
  if (initPhoton.initialized) {
    throw new Error("(@cf-wasm/photon): Function already called. The `initPhoton()` function can be used only once.");
  }
  if (!input) {
    throw new Error("(@cf-wasm/photon): Argument `input` is not valid.");
  }
  initPhoton.initialized = true;
  const output = initSync(input);
  initPhoton.promise = Promise.resolve(output);
  initPhoton.ready = true;
  return output;
};
initPhoton.promise = null;
initPhoton.initialized = false;
initPhoton.ready = false;
initPhoton.ensure = async () => {
  if (!initPhoton.promise) {
    throw new Error("(@cf-wasm/photon): Function not called. Call `initPhoton()` function first.");
  }
  return initPhoton.promise;
};

// node_modules/@cf-wasm/photon/dist/workerd.js
import photonWasmModule from "./66794212c353f6819275a12dfe4a559e9f206c23-photon_rs_bg.wasm";
initPhoton.sync({ module: photonWasmModule });

// src/utils/imageCompositor.ts
var initPromise = null;
async function ensureInitialized() {
  if (!initPromise) {
    initPromise = initPhoton(photonWasmModule).catch((error3) => {
      if (error3?.message?.includes("already called")) {
        return;
      }
      initPromise = null;
      throw error3;
    });
  }
  await initPromise;
}
__name(ensureInitialized, "ensureInitialized");
async function fetchImageBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
__name(fetchImageBuffer, "fetchImageBuffer");
async function compositeCardImages(imageUrls) {
  if (imageUrls.length === 0) {
    throw new Error("No images to composite");
  }
  await ensureInitialized();
  const imageBuffers = await Promise.all(
    imageUrls.map((url) => fetchImageBuffer(url))
  );
  const cardWidth = 488;
  const cardHeight = 680;
  const overlapPercent = 0.6;
  const visibleWidth = Math.floor(cardWidth * (1 - overlapPercent));
  const totalWidth = cardWidth + (imageUrls.length - 1) * visibleWidth;
  const canvasPixels = new Uint8Array(totalWidth * cardHeight * 4);
  for (let i = 0; i < canvasPixels.length; i += 4) {
    canvasPixels[i] = 47;
    canvasPixels[i + 1] = 49;
    canvasPixels[i + 2] = 54;
    canvasPixels[i + 3] = 255;
  }
  const canvas = new PhotonImage(canvasPixels, totalWidth, cardHeight);
  for (let i = 0; i < imageBuffers.length; i++) {
    try {
      const img = PhotonImage.new_from_byteslice(imageBuffers[i]);
      const resized = resize(img, cardWidth, cardHeight, SamplingFilter.Lanczos3);
      const xPos = BigInt(i * visibleWidth);
      watermark(canvas, resized, xPos, BigInt(0));
      img.free();
      resized.free();
    } catch (error3) {
      console.error(`Failed to process image ${i}:`, error3);
    }
  }
  const result = canvas.get_bytes_jpeg(85);
  canvas.free();
  return result;
}
__name(compositeCardImages, "compositeCardImages");

// src/services/deckService.ts
var DeckService = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "DeckService");
  }
  async create(userId, name, moxfieldUrl) {
    const moxfieldDeckId = extractDeckId(moxfieldUrl);
    if (!moxfieldDeckId) {
      throw new Error(
        "Invalid Moxfield URL. Expected format: https://moxfield.com/decks/abc123"
      );
    }
    const result = await this.db.prepare(
      `INSERT INTO decks (user_id, name, moxfield_deck_id, moxfield_url)
         VALUES (?, ?, ?, ?)
         RETURNING *`
    ).bind(userId, name, moxfieldDeckId, moxfieldUrl).first();
    if (!result) {
      throw new Error("Failed to create deck");
    }
    return result;
  }
  async list(userId) {
    const result = await this.db.prepare(
      `SELECT * FROM decks WHERE user_id = ? ORDER BY is_current DESC, name ASC`
    ).bind(userId).all();
    return result.results;
  }
  async getByName(userId, name) {
    const result = await this.db.prepare(`SELECT * FROM decks WHERE user_id = ? AND name = ?`).bind(userId, name).first();
    return result;
  }
  async getCurrent(userId) {
    const result = await this.db.prepare(`SELECT * FROM decks WHERE user_id = ? AND is_current = 1`).bind(userId).first();
    return result;
  }
  async setCurrent(userId, name) {
    const deck = await this.getByName(userId, name);
    if (!deck) {
      throw new Error(`Deck "${name}" not found`);
    }
    await this.db.prepare(`UPDATE decks SET is_current = 0 WHERE user_id = ?`).bind(userId).run();
    await this.db.prepare(
      `UPDATE decks SET is_current = 1, updated_at = unixepoch() WHERE user_id = ? AND name = ?`
    ).bind(userId, name).run();
  }
  async delete(userId, name) {
    const result = await this.db.prepare(`DELETE FROM decks WHERE user_id = ? AND name = ?`).bind(userId, name).run();
    return result.meta.changes > 0;
  }
  async rename(userId, oldName, newName) {
    const result = await this.db.prepare(
      `UPDATE decks SET name = ?, updated_at = unixepoch() WHERE user_id = ? AND name = ?`
    ).bind(newName, userId, oldName).run();
    return result.meta.changes > 0;
  }
  async updateUrl(userId, name, newUrl) {
    const moxfieldDeckId = extractDeckId(newUrl);
    if (!moxfieldDeckId) {
      throw new Error(
        "Invalid Moxfield URL. Expected format: https://moxfield.com/decks/abc123"
      );
    }
    const result = await this.db.prepare(
      `UPDATE decks SET moxfield_url = ?, moxfield_deck_id = ?, updated_at = unixepoch()
         WHERE user_id = ? AND name = ?`
    ).bind(newUrl, moxfieldDeckId, userId, name).run();
    return result.meta.changes > 0;
  }
  async searchByPrefix(userId, prefix) {
    const result = await this.db.prepare(
      `SELECT * FROM decks WHERE user_id = ? AND name LIKE ? ORDER BY name ASC LIMIT 25`
    ).bind(userId, `${prefix}%`).all();
    return result.results;
  }
};

// src/utils/stats.ts
function calculateMean(values) {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}
__name(calculateMean, "calculateMean");
function calculateMedian(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
__name(calculateMedian, "calculateMedian");
function calculateMode(values) {
  if (values.length === 0) return 0;
  const frequency = /* @__PURE__ */ new Map();
  let maxFreq = 0;
  let mode = values[0];
  for (const val of values) {
    const freq = (frequency.get(val) || 0) + 1;
    frequency.set(val, freq);
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = val;
    }
  }
  return mode;
}
__name(calculateMode, "calculateMode");

// src/services/sessionService.ts
var SessionService = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "SessionService");
  }
  async create(userId, deckId, moxfieldDeckId, channelId, userSeat) {
    const sessionId = crypto.randomUUID();
    const effectiveDeckId = deckId ?? 0;
    await this.db.prepare(
      `INSERT INTO mulligan_sessions (session_id, user_id, deck_id, moxfield_deck_id, channel_id, user_seat, mulligan_count, resolved)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0)`
    ).bind(sessionId, userId, effectiveDeckId, moxfieldDeckId, channelId, userSeat).run();
    return sessionId;
  }
  async updateMessageId(sessionId, messageId) {
    await this.db.prepare(`UPDATE mulligan_sessions SET message_id = ? WHERE session_id = ?`).bind(messageId, sessionId).run();
  }
  async getContext(sessionId) {
    const result = await this.db.prepare(
      `SELECT moxfield_deck_id, channel_id, message_id, user_seat, deck_id
         FROM mulligan_sessions WHERE session_id = ?`
    ).bind(sessionId).first();
    if (!result) return null;
    return {
      moxfieldDeckId: result.moxfield_deck_id,
      channelId: result.channel_id,
      messageId: result.message_id,
      userSeat: result.user_seat,
      // deck_id of 0 means ad-hoc URL (no saved deck)
      deckId: result.deck_id === 0 ? null : result.deck_id
    };
  }
  async incrementMulligan(sessionId) {
    const result = await this.db.prepare(
      `UPDATE mulligan_sessions
         SET mulligan_count = mulligan_count + 1
         WHERE session_id = ?
         RETURNING mulligan_count`
    ).bind(sessionId).first();
    if (!result) {
      throw new Error("Session not found");
    }
    return result.mulligan_count;
  }
  async getMulliganCount(sessionId) {
    const result = await this.db.prepare(
      `SELECT mulligan_count FROM mulligan_sessions WHERE session_id = ?`
    ).bind(sessionId).first();
    if (!result) {
      throw new Error("Session not found");
    }
    return result.mulligan_count;
  }
  async resolve(sessionId) {
    await this.db.prepare(
      `UPDATE mulligan_sessions
         SET resolved = 1, resolved_at = unixepoch()
         WHERE session_id = ?`
    ).bind(sessionId).run();
  }
  async getStats(deckId) {
    const result = await this.db.prepare(
      `SELECT mulligan_count FROM mulligan_sessions
         WHERE deck_id = ? AND resolved = 1`
    ).bind(deckId).all();
    const mulliganCounts = result.results.map((r) => r.mulligan_count);
    if (mulliganCounts.length === 0) {
      return {
        totalHands: 0,
        mean: 0,
        median: 0,
        mode: 0,
        distribution: /* @__PURE__ */ new Map()
      };
    }
    const distribution = /* @__PURE__ */ new Map();
    for (const count3 of mulliganCounts) {
      distribution.set(count3, (distribution.get(count3) || 0) + 1);
    }
    return {
      totalHands: mulliganCounts.length,
      mean: calculateMean(mulliganCounts),
      median: calculateMedian(mulliganCounts),
      mode: calculateMode(mulliganCounts),
      distribution
    };
  }
  async resetStats(deckId) {
    const result = await this.db.prepare(
      `DELETE FROM mulligan_sessions WHERE deck_id = ? AND resolved = 1`
    ).bind(deckId).run();
    return result.meta.changes;
  }
  async cleanupOldSessions(maxAgeHours = 24) {
    const cutoff = Math.floor(Date.now() / 1e3) - maxAgeHours * 60 * 60;
    const result = await this.db.prepare(
      `DELETE FROM mulligan_sessions
         WHERE resolved = 0 AND created_at < ?`
    ).bind(cutoff).run();
    return result.meta.changes;
  }
};

// src/services/guildSettingsService.ts
var GuildSettingsService = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "GuildSettingsService");
  }
  /**
   * Check if a channel is allowed for bot usage in a guild.
   * Returns true if:
   * - Guild has no restrictions (no entries in table), OR
   * - Channel is in the allowed list
   */
  async isChannelAllowed(guildId, channelId) {
    const restrictionCount = await this.db.prepare(
      `SELECT COUNT(*) as count FROM guild_allowed_channels WHERE guild_id = ?`
    ).bind(guildId).first();
    if (!restrictionCount || restrictionCount.count === 0) {
      return true;
    }
    const allowed = await this.db.prepare(
      `SELECT 1 FROM guild_allowed_channels WHERE guild_id = ? AND channel_id = ?`
    ).bind(guildId, channelId).first();
    return !!allowed;
  }
  /**
   * Get all allowed channels for a guild
   */
  async getAllowedChannels(guildId) {
    const result = await this.db.prepare(
      `SELECT * FROM guild_allowed_channels WHERE guild_id = ? ORDER BY created_at ASC`
    ).bind(guildId).all();
    return result.results;
  }
  /**
   * Add a channel to the allowed list
   */
  async addAllowedChannel(guildId, channelId, addedBy) {
    const result = await this.db.prepare(
      `INSERT INTO guild_allowed_channels (guild_id, channel_id, added_by)
         VALUES (?, ?, ?)
         RETURNING *`
    ).bind(guildId, channelId, addedBy).first();
    if (!result) {
      throw new Error("Failed to add allowed channel");
    }
    return result;
  }
  /**
   * Remove a channel from the allowed list
   */
  async removeAllowedChannel(guildId, channelId) {
    const result = await this.db.prepare(
      `DELETE FROM guild_allowed_channels WHERE guild_id = ? AND channel_id = ?`
    ).bind(guildId, channelId).run();
    return result.meta.changes > 0;
  }
  /**
   * Clear all channel restrictions for a guild
   */
  async clearAllRestrictions(guildId) {
    const result = await this.db.prepare(`DELETE FROM guild_allowed_channels WHERE guild_id = ?`).bind(guildId).run();
    return result.meta.changes;
  }
  /**
   * Check if guild has any channel restrictions configured
   */
  async hasRestrictions(guildId) {
    const result = await this.db.prepare(
      `SELECT COUNT(*) as count FROM guild_allowed_channels WHERE guild_id = ?`
    ).bind(guildId).first();
    return !!result && result.count > 0;
  }
};

// src/handlers/deck/create.ts
async function handleDeckCreate(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  const url = options.find((o) => o.name === "url")?.value;
  if (!name || !url) {
    return jsonResponse({
      type: 4,
      data: { content: "Please provide both a name and a Moxfield URL.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  try {
    const deck = await deckService.create(userId, name, url);
    return jsonResponse({
      type: 4,
      data: {
        embeds: [
          {
            title: "\u2705 Deck Created",
            description: `Your deck **${deck.name}** has been registered.`,
            fields: [
              { name: "Moxfield", value: deck.moxfield_url, inline: false }
            ],
            color: 65280
          }
        ],
        flags: 64
      }
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Failed to create deck";
    if (message.includes("UNIQUE constraint")) {
      return jsonResponse({
        type: 4,
        data: {
          content: `You already have a deck named **${name}**. Choose a different name.`,
          flags: 64
        }
      });
    }
    return jsonResponse({
      type: 4,
      data: { content: `\u274C ${message}`, flags: 64 }
    });
  }
}
__name(handleDeckCreate, "handleDeckCreate");
function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");

// src/handlers/deck/list.ts
async function handleDeckList(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse2({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  const decks = await deckService.list(userId);
  if (decks.length === 0) {
    return jsonResponse2({
      type: 4,
      data: {
        content: "You have no registered decks. Use `/pod deck create` to add one.",
        flags: 64
      }
    });
  }
  const deckLines = decks.map((deck) => {
    const currentMarker = deck.is_current ? " \u2B50 (current)" : "";
    return `\u2022 **${deck.name}**${currentMarker}
  \u2514 [Moxfield](${deck.moxfield_url})`;
  });
  return jsonResponse2({
    type: 4,
    data: {
      embeds: [
        {
          title: "\u{1F4DA} Your Registered Decks",
          description: deckLines.join("\n\n"),
          color: 5793266,
          footer: { text: `${decks.length} deck${decks.length === 1 ? "" : "s"} registered` }
        }
      ],
      flags: 64
    }
  });
}
__name(handleDeckList, "handleDeckList");
function jsonResponse2(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse2, "jsonResponse");

// src/handlers/deck/use.ts
async function handleDeckUse(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse3({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  if (!name) {
    return jsonResponse3({
      type: 4,
      data: { content: "Please provide a deck name.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  try {
    await deckService.setCurrent(userId, name);
    return jsonResponse3({
      type: 4,
      data: {
        content: `\u2B50 **${name}** is now your current deck. You can now use \`/pod generate\` without specifying a deck.`,
        flags: 64
      }
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Failed to set current deck";
    return jsonResponse3({
      type: 4,
      data: { content: `\u274C ${message}`, flags: 64 }
    });
  }
}
__name(handleDeckUse, "handleDeckUse");
function jsonResponse3(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse3, "jsonResponse");

// src/handlers/deck/delete.ts
async function handleDeckDelete(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse4({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  if (!name) {
    return jsonResponse4({
      type: 4,
      data: { content: "Please provide a deck name.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  const deleted = await deckService.delete(userId, name);
  if (!deleted) {
    return jsonResponse4({
      type: 4,
      data: {
        content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
        flags: 64
      }
    });
  }
  return jsonResponse4({
    type: 4,
    data: {
      content: `\u{1F5D1}\uFE0F Deck **${name}** has been deleted.`,
      flags: 64
    }
  });
}
__name(handleDeckDelete, "handleDeckDelete");
function jsonResponse4(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse4, "jsonResponse");

// src/handlers/deck/rename.ts
async function handleDeckRename(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse5({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const oldName = options.find((o) => o.name === "name")?.value;
  const newName = options.find((o) => o.name === "new_name")?.value;
  if (!oldName || !newName) {
    return jsonResponse5({
      type: 4,
      data: { content: "Please provide both the current name and new name.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  try {
    const renamed = await deckService.rename(userId, oldName, newName);
    if (!renamed) {
      return jsonResponse5({
        type: 4,
        data: {
          content: `Deck **${oldName}** not found. Use \`/pod deck list\` to see your decks.`,
          flags: 64
        }
      });
    }
    return jsonResponse5({
      type: 4,
      data: {
        content: `\u270F\uFE0F Deck renamed from **${oldName}** to **${newName}**.`,
        flags: 64
      }
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Failed to rename deck";
    if (message.includes("UNIQUE constraint")) {
      return jsonResponse5({
        type: 4,
        data: {
          content: `You already have a deck named **${newName}**. Choose a different name.`,
          flags: 64
        }
      });
    }
    return jsonResponse5({
      type: 4,
      data: { content: `\u274C ${message}`, flags: 64 }
    });
  }
}
__name(handleDeckRename, "handleDeckRename");
function jsonResponse5(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse5, "jsonResponse");

// src/handlers/deck/stats.ts
async function handleDeckStats(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse6({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  const deckService = new DeckService(env2.DB);
  const sessionService = new SessionService(env2.DB);
  let deck;
  if (name) {
    deck = await deckService.getByName(userId, name);
    if (!deck) {
      return jsonResponse6({
        type: 4,
        data: {
          content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
          flags: 64
        }
      });
    }
  } else {
    deck = await deckService.getCurrent(userId);
    if (!deck) {
      return jsonResponse6({
        type: 4,
        data: {
          content: "No current deck set. Use `/pod deck use <name>` to set one, or specify a deck name.",
          flags: 64
        }
      });
    }
  }
  const stats = await sessionService.getStats(deck.id);
  if (stats.totalHands === 0) {
    return jsonResponse6({
      type: 4,
      data: {
        embeds: [
          {
            title: `\u{1F4CA} Mulligan Stats for "${deck.name}"`,
            description: "No hands kept yet. Generate pods with `/pod generate` and click **Keep** to track stats.",
            color: 5793266
          }
        ],
        flags: 64
      }
    });
  }
  const distributionLines = [];
  const sortedCounts = Array.from(stats.distribution.entries()).sort((a, b) => a[0] - b[0]);
  for (const [mulligans, count3] of sortedCounts) {
    const cardsKept = 7 - mulligans;
    const percentage = (count3 / stats.totalHands * 100).toFixed(1);
    distributionLines.push(`Kept ${cardsKept} cards: ${count3} (${percentage}%)`);
  }
  return jsonResponse6({
    type: 4,
    data: {
      embeds: [
        {
          title: `\u{1F4CA} Mulligan Stats for "${deck.name}"`,
          fields: [
            {
              name: "Total Hands Kept",
              value: stats.totalHands.toString(),
              inline: true
            },
            {
              name: "Mulligans Before Keeping",
              value: [
                `\u2022 Mean: ${stats.mean.toFixed(2)}`,
                `\u2022 Median: ${stats.median}`,
                `\u2022 Mode: ${stats.mode}`
              ].join("\n"),
              inline: true
            },
            {
              name: "Distribution",
              value: distributionLines.join("\n") || "No data",
              inline: false
            }
          ],
          color: 5793266
        }
      ],
      flags: 64
    }
  });
}
__name(handleDeckStats, "handleDeckStats");
async function handleDeckStatsReset(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse6({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  if (!name) {
    return jsonResponse6({
      type: 4,
      data: { content: "Please provide a deck name.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  const sessionService = new SessionService(env2.DB);
  const deck = await deckService.getByName(userId, name);
  if (!deck) {
    return jsonResponse6({
      type: 4,
      data: {
        content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
        flags: 64
      }
    });
  }
  const deletedCount = await sessionService.resetStats(deck.id);
  return jsonResponse6({
    type: 4,
    data: {
      content: `\u{1F504} Stats reset for **${name}**. ${deletedCount} recorded hand${deletedCount === 1 ? "" : "s"} cleared.`,
      flags: 64
    }
  });
}
__name(handleDeckStatsReset, "handleDeckStatsReset");
function jsonResponse6(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse6, "jsonResponse");

// src/handlers/deck/setList.ts
async function handleDeckSetList(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse7({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 }
    });
  }
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o) => o.name === "name")?.value;
  const url = options.find((o) => o.name === "url")?.value;
  if (!name || !url) {
    return jsonResponse7({
      type: 4,
      data: { content: "Please provide both a deck name and URL.", flags: 64 }
    });
  }
  const deckService = new DeckService(env2.DB);
  try {
    const updated = await deckService.updateUrl(userId, name, url);
    if (!updated) {
      return jsonResponse7({
        type: 4,
        data: {
          content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
          flags: 64
        }
      });
    }
    return jsonResponse7({
      type: 4,
      data: {
        content: `\u{1F517} Deck **${name}** now points to:
${url}`,
        flags: 64
      }
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Failed to update deck URL";
    return jsonResponse7({
      type: 4,
      data: { content: `\u274C ${message}`, flags: 64 }
    });
  }
}
__name(handleDeckSetList, "handleDeckSetList");
function jsonResponse7(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse7, "jsonResponse");

// src/handlers/deck/autocomplete.ts
async function handleDeckAutocomplete(interaction, env2) {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse8({
      type: 8,
      data: { choices: [] }
    });
  }
  let focusedValue = "";
  const topOptions = interaction.data.options ?? [];
  for (const topOpt of topOptions) {
    if (topOpt.options) {
      for (const subOpt of topOpt.options) {
        if (subOpt.options) {
          for (const opt of subOpt.options) {
            if (opt.focused) {
              focusedValue = opt.value || "";
              break;
            }
          }
        }
      }
    }
    if (topOpt.name === "generate" && topOpt.options) {
      for (const opt of topOpt.options) {
        if (opt.focused) {
          focusedValue = opt.value || "";
          break;
        }
      }
    }
  }
  const deckService = new DeckService(env2.DB);
  const decks = await deckService.searchByPrefix(userId, focusedValue);
  const choices = decks.map((deck) => ({
    name: deck.is_current ? `${deck.name} \u2B50` : deck.name,
    value: deck.name
  }));
  return jsonResponse8({
    type: 8,
    // APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
    data: { choices }
  });
}
__name(handleDeckAutocomplete, "handleDeckAutocomplete");
function jsonResponse8(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse8, "jsonResponse");

// src/handlers/help.ts
async function handleHelp() {
  const helpText = [
    "**Pod Generation**",
    "`/pod generate [decklist]` \u2014 Generate a 4-player cEDH pod",
    "  \u2022 With no argument: uses your current deck",
    "  \u2022 With deck name: uses a saved deck",
    "  \u2022 With Moxfield URL: uses that deck (no stats)",
    "",
    "**Deck Management**",
    "`/pod deck create <name> <url>` \u2014 Register a new deck",
    "`/pod deck list` \u2014 List your registered decks",
    "`/pod deck use <name>` \u2014 Set a deck as your current deck",
    "`/pod deck delete <name>` \u2014 Delete a registered deck",
    "`/pod deck rename <name> <new_name>` \u2014 Rename a deck",
    "`/pod deck set-list <name> <url>` \u2014 Update a deck's Moxfield URL",
    "",
    "**Stats Tracking**",
    "`/pod deck stats [name]` \u2014 View mulligan stats for a deck",
    "`/pod deck stats-reset <name>` \u2014 Reset stats for a deck",
    "",
    "**How Stats Work**",
    "When you use a saved deck with `/pod generate`, each hand you **Keep** is recorded. Stats show how many mulligans you take on average before keeping.",
    "",
    "**Server Admin** *(Manage Server permission required)*",
    "`/pod admin channel-add <channel>` \u2014 Restrict bot to specific channels",
    "`/pod admin channel-remove <channel>` \u2014 Remove a channel from allowed list",
    "`/pod admin channel-list` \u2014 View all allowed channels",
    "`/pod admin channel-clear` \u2014 Remove all restrictions"
  ].join("\n");
  return jsonResponse9({
    type: 4,
    data: {
      embeds: [
        {
          title: "\u{1F3B4} cEDH Pod Bot Commands",
          description: helpText,
          color: 5793266,
          footer: { text: "Tip: Use a saved deck to track your mulligan stats!" }
        }
      ],
      flags: 64
    }
  });
}
__name(handleHelp, "handleHelp");
function jsonResponse9(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse9, "jsonResponse");

// src/handlers/admin/channelAdd.ts
var MANAGE_GUILD = BigInt(32);
async function handleAdminChannelAdd(interaction, env2) {
  const guildId = interaction.guild_id;
  const userId = interaction.member?.user?.id;
  if (!guildId) {
    return jsonResponse10({
      type: 4,
      data: { content: "This command can only be used in a server.", flags: 64 }
    });
  }
  const permissions = BigInt(interaction.member?.permissions || "0");
  if ((permissions & MANAGE_GUILD) === BigInt(0)) {
    return jsonResponse10({
      type: 4,
      data: {
        content: "You need the **Manage Server** permission to use this command.",
        flags: 64
      }
    });
  }
  const adminGroup = interaction.data.options?.[0];
  const subcommand = adminGroup?.options?.[0];
  const channelId = subcommand?.options?.find(
    (o) => o.name === "channel"
  )?.value;
  if (!channelId) {
    return jsonResponse10({
      type: 4,
      data: { content: "Please specify a channel.", flags: 64 }
    });
  }
  const service = new GuildSettingsService(env2.DB);
  try {
    await service.addAllowedChannel(guildId, channelId, userId);
    return jsonResponse10({
      type: 4,
      data: {
        embeds: [
          {
            title: "Channel Added",
            description: `<#${channelId}> has been added to the allowed channels list.

The bot will now only respond in allowed channels.`,
            color: 65280
          }
        ],
        flags: 64
      }
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Failed to add channel";
    if (message.includes("UNIQUE constraint")) {
      return jsonResponse10({
        type: 4,
        data: {
          content: `<#${channelId}> is already in the allowed list.`,
          flags: 64
        }
      });
    }
    return jsonResponse10({
      type: 4,
      data: { content: `Error: ${message}`, flags: 64 }
    });
  }
}
__name(handleAdminChannelAdd, "handleAdminChannelAdd");
function jsonResponse10(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse10, "jsonResponse");

// src/handlers/admin/channelRemove.ts
var MANAGE_GUILD2 = BigInt(32);
async function handleAdminChannelRemove(interaction, env2) {
  const guildId = interaction.guild_id;
  if (!guildId) {
    return jsonResponse11({
      type: 4,
      data: { content: "This command can only be used in a server.", flags: 64 }
    });
  }
  const permissions = BigInt(interaction.member?.permissions || "0");
  if ((permissions & MANAGE_GUILD2) === BigInt(0)) {
    return jsonResponse11({
      type: 4,
      data: {
        content: "You need the **Manage Server** permission to use this command.",
        flags: 64
      }
    });
  }
  const adminGroup = interaction.data.options?.[0];
  const subcommand = adminGroup?.options?.[0];
  const channelId = subcommand?.options?.find(
    (o) => o.name === "channel"
  )?.value;
  if (!channelId) {
    return jsonResponse11({
      type: 4,
      data: { content: "Please specify a channel.", flags: 64 }
    });
  }
  const service = new GuildSettingsService(env2.DB);
  const removed = await service.removeAllowedChannel(guildId, channelId);
  if (!removed) {
    return jsonResponse11({
      type: 4,
      data: {
        content: `<#${channelId}> was not in the allowed list.`,
        flags: 64
      }
    });
  }
  const hasRestrictions = await service.hasRestrictions(guildId);
  const note = hasRestrictions ? "" : "\n\n**Note:** No channels are restricted now. The bot will work in all channels.";
  return jsonResponse11({
    type: 4,
    data: {
      content: `<#${channelId}> has been removed from the allowed list.${note}`,
      flags: 64
    }
  });
}
__name(handleAdminChannelRemove, "handleAdminChannelRemove");
function jsonResponse11(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse11, "jsonResponse");

// src/handlers/admin/channelList.ts
var MANAGE_GUILD3 = BigInt(32);
async function handleAdminChannelList(interaction, env2) {
  const guildId = interaction.guild_id;
  if (!guildId) {
    return jsonResponse12({
      type: 4,
      data: { content: "This command can only be used in a server.", flags: 64 }
    });
  }
  const permissions = BigInt(interaction.member?.permissions || "0");
  if ((permissions & MANAGE_GUILD3) === BigInt(0)) {
    return jsonResponse12({
      type: 4,
      data: {
        content: "You need the **Manage Server** permission to use this command.",
        flags: 64
      }
    });
  }
  const service = new GuildSettingsService(env2.DB);
  const channels = await service.getAllowedChannels(guildId);
  if (channels.length === 0) {
    return jsonResponse12({
      type: 4,
      data: {
        embeds: [
          {
            title: "Allowed Channels",
            description: "No channel restrictions configured.\n\nThe bot currently works in **all channels**.\n\nUse `/pod admin channel-add` to restrict to specific channels.",
            color: 5793266
          }
        ],
        flags: 64
      }
    });
  }
  const channelList = channels.map((c) => `- <#${c.channel_id}>`).join("\n");
  return jsonResponse12({
    type: 4,
    data: {
      embeds: [
        {
          title: "Allowed Channels",
          description: `The bot only responds in these channels:

${channelList}`,
          color: 5793266,
          footer: {
            text: `${channels.length} channel${channels.length === 1 ? "" : "s"} configured`
          }
        }
      ],
      flags: 64
    }
  });
}
__name(handleAdminChannelList, "handleAdminChannelList");
function jsonResponse12(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse12, "jsonResponse");

// src/handlers/admin/channelClear.ts
var MANAGE_GUILD4 = BigInt(32);
async function handleAdminChannelClear(interaction, env2) {
  const guildId = interaction.guild_id;
  if (!guildId) {
    return jsonResponse13({
      type: 4,
      data: { content: "This command can only be used in a server.", flags: 64 }
    });
  }
  const permissions = BigInt(interaction.member?.permissions || "0");
  if ((permissions & MANAGE_GUILD4) === BigInt(0)) {
    return jsonResponse13({
      type: 4,
      data: {
        content: "You need the **Manage Server** permission to use this command.",
        flags: 64
      }
    });
  }
  const service = new GuildSettingsService(env2.DB);
  const count3 = await service.clearAllRestrictions(guildId);
  if (count3 === 0) {
    return jsonResponse13({
      type: 4,
      data: {
        content: "No channel restrictions were configured.",
        flags: 64
      }
    });
  }
  return jsonResponse13({
    type: 4,
    data: {
      content: `Cleared ${count3} channel restriction${count3 === 1 ? "" : "s"}. The bot now works in all channels.`,
      flags: 64
    }
  });
}
__name(handleAdminChannelClear, "handleAdminChannelClear");
function jsonResponse13(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse13, "jsonResponse");

// src/worker.ts
var InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4
};
var InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8
};
var ComponentType = {
  ACTION_ROW: 1,
  BUTTON: 2
};
var ButtonStyle = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4
};
var MAX_MULLIGANS = 7;
function generatePlaytestUrl(moxfieldDeckId, pod, handScryfallIds) {
  const userSeatIndex = pod.findIndex((seat) => seat.isUser);
  const playerSeat = userSeatIndex + 1;
  const opponents = pod.filter((seat) => !seat.isUser).map((seat) => seat.commander).join("|");
  const podParam = `${playerSeat},${opponents}`;
  const handParam = handScryfallIds.join(",");
  const url = new URL("https://mulligan.eldrazi.dev/playtest");
  url.searchParams.set("moxfieldDeckId", moxfieldDeckId);
  url.searchParams.set("pod", podParam);
  url.searchParams.set("hand", handParam);
  return url.toString();
}
__name(generatePlaytestUrl, "generatePlaytestUrl");
function buildCardEmbedDescription(moxfieldDeckId, pod, handScryfallIds) {
  const moxfieldUrl = `https://moxfield.com/decks/${moxfieldDeckId}`;
  const playtestUrl = generatePlaytestUrl(moxfieldDeckId, pod, handScryfallIds);
  return `[Moxfield](${moxfieldUrl}) \u2022 [Playtest](${playtestUrl})`;
}
__name(buildCardEmbedDescription, "buildCardEmbedDescription");
function getUserSeat(pod) {
  return pod.findIndex((seat) => seat.isUser) + 1;
}
__name(getUserSeat, "getUserSeat");
function parsePodFromEmbed(description, userSeat) {
  const lines = description.split("\n");
  const pod = [];
  for (let i = 0; i < lines.length && i < 4; i++) {
    const line = lines[i];
    const match = line.match(/\*\*\d+:\s*\*?\*?\s*(.+)/);
    if (match) {
      let commander = match[1].trim();
      const isUser = i + 1 === userSeat || commander.includes("(You)");
      commander = commander.replace(/\s*\(You\)\s*\*?\*?$/, "").trim();
      commander = commander.replace(/\*\*$/, "").trim();
      pod.push({ commander, isUser });
    }
  }
  return pod;
}
__name(parsePodFromEmbed, "parsePodFromEmbed");
function getHandSizeText(mulliganCount) {
  if (mulliganCount === 0) return "First 7";
  if (mulliganCount === 1) return "Second 7";
  return `Going to ${7 - mulliganCount + 1}`;
}
__name(getHandSizeText, "getHandSizeText");
function getKeptText(mulliganCount) {
  if (mulliganCount === 0) return "Kept first 7";
  if (mulliganCount === 1) return "Kept second 7";
  return `Kept ${7 - mulliganCount + 1}`;
}
__name(getKeptText, "getKeptText");
function createCardButtons(sessionId, mulliganCount, disabled = false) {
  const mulliganDisabled = disabled || mulliganCount >= MAX_MULLIGANS;
  return [{
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SUCCESS,
        label: "Keep",
        custom_id: `keep:${sessionId}`,
        disabled
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.DANGER,
        label: mulliganCount >= MAX_MULLIGANS ? "Mulligan (max)" : "Mulligan",
        custom_id: `mulligan:${sessionId}`,
        disabled: mulliganDisabled
      }
    ]
  }];
}
__name(createCardButtons, "createCardButtons");
async function verifyDiscordSignature(body, signature, timestamp, publicKey) {
  try {
    const encoder = new TextEncoder();
    const message = encoder.encode(timestamp + body);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);
    const key = await crypto.subtle.importKey(
      "raw",
      publicKeyBytes,
      { name: "Ed25519", namedCurve: "Ed25519" },
      false,
      ["verify"]
    );
    return await crypto.subtle.verify("Ed25519", key, signatureBytes, message);
  } catch (error3) {
    console.error("Signature verification error:", error3);
    return false;
  }
}
__name(verifyDiscordSignature, "verifyDiscordSignature");
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
__name(hexToBytes, "hexToBytes");
function jsonResponse14(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse14, "jsonResponse");
async function resolveDeck(userId, input, db) {
  const deckService = new DeckService(db);
  if (!input) {
    const current = await deckService.getCurrent(userId);
    if (!current) {
      throw new Error("No current deck set. Use `/pod deck use <name>` first, or provide a deck name/URL.");
    }
    return {
      moxfieldDeckId: current.moxfield_deck_id,
      moxfieldUrl: current.moxfield_url,
      dbDeckId: current.id
    };
  }
  if (input.includes("moxfield.com")) {
    const deckId = extractDeckId(input);
    if (!deckId) {
      throw new Error("Invalid Moxfield URL. Expected format: `https://moxfield.com/decks/abc123`");
    }
    return { moxfieldDeckId: deckId, moxfieldUrl: input, dbDeckId: null };
  }
  const deck = await deckService.getByName(userId, input);
  if (!deck) {
    throw new Error(`Deck "${input}" not found. Use \`/pod deck list\` to see your decks.`);
  }
  return {
    moxfieldDeckId: deck.moxfield_deck_id,
    moxfieldUrl: deck.moxfield_url,
    dbDeckId: deck.id
  };
}
__name(resolveDeck, "resolveDeck");
var worker_default = {
  async fetch(request, env2, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Signature-Ed25519, X-Signature-Timestamp"
        }
      });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    const body = await request.text();
    if (!signature || !timestamp) {
      return new Response("Missing signature headers", { status: 401 });
    }
    const isValid = await verifyDiscordSignature(body, signature, timestamp, env2.DISCORD_PUBLIC_KEY);
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }
    const interaction = JSON.parse(body);
    const guildId = interaction.guild_id || "DM";
    const odUserId = interaction.member?.user?.id || interaction.user?.id || "unknown";
    console.log(`[Analytics] Guild: ${guildId}, User: ${odUserId}, Type: ${interaction.type}`);
    if (interaction.type === InteractionType.PING) {
      return jsonResponse14({ type: InteractionResponseType.PONG });
    }
    if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
      if (interaction.data.name === "pod") {
        return handleDeckAutocomplete(interaction, env2);
      }
    }
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      if (interaction.data.name === "pod") {
        const options = interaction.data.options || [];
        const adminGroup = options.find((o) => o.name === "admin");
        if (adminGroup) {
          const subcommand = adminGroup.options?.[0];
          switch (subcommand?.name) {
            case "channel-add":
              return handleAdminChannelAdd(interaction, env2);
            case "channel-remove":
              return handleAdminChannelRemove(interaction, env2);
            case "channel-list":
              return handleAdminChannelList(interaction, env2);
            case "channel-clear":
              return handleAdminChannelClear(interaction, env2);
          }
        }
        const guildId2 = interaction.guild_id;
        const channelId = interaction.channel_id;
        if (guildId2 && channelId) {
          const guildSettings = new GuildSettingsService(env2.DB);
          const isAllowed = await guildSettings.isChannelAllowed(guildId2, channelId);
          if (!isAllowed) {
            const channels = await guildSettings.getAllowedChannels(guildId2);
            const mentions = channels.map((c) => `<#${c.channel_id}>`).join(", ");
            return jsonResponse14({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                embeds: [
                  {
                    title: "Channel Restricted",
                    description: `This bot can only be used in: ${mentions}`,
                    color: 15548997
                  }
                ],
                flags: 64
              }
            });
          }
        }
        const deckGroup = options.find((o) => o.name === "deck");
        if (deckGroup) {
          const subcommand = deckGroup.options?.[0];
          switch (subcommand?.name) {
            case "create":
              return handleDeckCreate(interaction, env2);
            case "list":
              return handleDeckList(interaction, env2);
            case "use":
              return handleDeckUse(interaction, env2);
            case "delete":
              return handleDeckDelete(interaction, env2);
            case "rename":
              return handleDeckRename(interaction, env2);
            case "stats":
              return handleDeckStats(interaction, env2);
            case "stats-reset":
              return handleDeckStatsReset(interaction, env2);
            case "set-list":
              return handleDeckSetList(interaction, env2);
          }
        }
        const helpSubcommand = options.find((o) => o.name === "help");
        if (helpSubcommand) {
          return handleHelp();
        }
        const generateSubcommand = options.find((o) => o.name === "generate");
        if (generateSubcommand) {
          const userId = interaction.member?.user?.id || interaction.user?.id;
          console.log("[Generate] userId:", userId);
          console.log("[Generate] subcommand options:", JSON.stringify(generateSubcommand.options));
          if (!userId) {
            return jsonResponse14({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: "Could not identify user.", flags: 64 }
            });
          }
          const decklistInput = generateSubcommand.options?.find(
            (o) => o.name === "decklist"
          )?.value;
          console.log("[Generate] decklistInput:", decklistInput);
          const pod = generatePod(4);
          let moxfieldDeckId = null;
          let dbDeckId = null;
          let userCommanderName = "You";
          let deck = null;
          if (decklistInput !== void 0 || await new DeckService(env2.DB).getCurrent(userId)) {
            try {
              const resolved = await resolveDeck(userId, decklistInput, env2.DB);
              moxfieldDeckId = resolved.moxfieldDeckId;
              dbDeckId = resolved.dbDeckId;
              deck = await fetchMoxfieldDeck(moxfieldDeckId, env2.MOXFIELD_API_KEY, env2.DECK_CACHE);
              userCommanderName = getCommanderNames(deck);
            } catch (error3) {
              const message = error3 instanceof Error ? error3.message : "Failed to resolve deck";
              if (!decklistInput && message.includes("No current deck")) {
              } else {
                return jsonResponse14({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    embeds: [{
                      title: "\u274C Deck Error",
                      description: message,
                      color: 15548997
                    }],
                    flags: 64
                  }
                });
              }
            }
          }
          const podList = pod.map((seat, index) => {
            const seatNum = index + 1;
            if (seat.isUser) {
              if (userCommanderName === "You") {
                return `**${seatNum}:** You`;
              }
              return `**${seatNum}: ${userCommanderName} (You)**`;
            }
            return `**${seatNum}:** ${seat.commander}`;
          }).join("\n");
          const podEmbed = {
            title: "\u{1F3B2} cEDH Pod Generated",
            description: podList,
            color: 5793266
          };
          if (!deck || !moxfieldDeckId) {
            console.log("[Generate] No deck/moxfieldDeckId, returning pod only");
            return jsonResponse14({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { embeds: [podEmbed] }
            });
          }
          console.log("[Generate] Have deck, will show buttons. moxfieldDeckId:", moxfieldDeckId);
          const interactionToken = interaction.token;
          const applicationId = env2.DISCORD_APPLICATION_ID;
          const channelId2 = interaction.channel_id;
          const userSeat = getUserSeat(pod);
          const sessionService = new SessionService(env2.DB);
          const sessionId = await sessionService.create(
            userId,
            dbDeckId,
            moxfieldDeckId,
            channelId2,
            userSeat
          );
          const processCommand = /* @__PURE__ */ __name(async () => {
            try {
              const cards = getRandomMainboardCards(deck, 7);
              let imageBytes = null;
              let actualHandScryfallIds = [];
              if (cards.length > 0) {
                const requestedIds = cards.map((c) => c.scryfallId).filter(Boolean);
                if (requestedIds.length > 0) {
                  const cardData = await fetchCardImages(requestedIds);
                  actualHandScryfallIds = cardData.map((c) => c.scryfallId);
                  const imageUrls = cardData.map((c) => c.imageUrl);
                  if (imageUrls.length > 0) {
                    imageBytes = await compositeCardImages(imageUrls);
                  }
                }
              }
              const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
              if (imageBytes) {
                const embedDescription = buildCardEmbedDescription(moxfieldDeckId, pod, actualHandScryfallIds);
                const formData = new FormData();
                formData.append("files[0]", new Blob([imageBytes], { type: "image/jpeg" }), "cards.jpg");
                formData.append("payload_json", JSON.stringify({
                  embeds: [
                    podEmbed,
                    {
                      description: embedDescription,
                      image: { url: "attachment://cards.jpg" },
                      color: 5793266,
                      footer: { text: "First 7" }
                    }
                  ]
                }));
                await fetch(webhookUrl, { method: "PATCH", body: formData });
              } else {
                await fetch(webhookUrl, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ embeds: [podEmbed] })
                });
              }
              const getOriginalUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
              const originalMsgResponse = await fetch(getOriginalUrl, {
                headers: { "Content-Type": "application/json" }
              });
              if (!originalMsgResponse.ok) {
                console.error("Failed to get original message:", await originalMsgResponse.text());
                return;
              }
              const originalMsg = await originalMsgResponse.json();
              const messageId = originalMsg.id;
              await sessionService.updateMessageId(sessionId, messageId);
              const addReaction = /* @__PURE__ */ __name(async (emoji) => {
                const encodedEmoji = encodeURIComponent(emoji);
                const url = `https://discord.com/api/v10/channels/${channelId2}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
                await fetch(url, {
                  method: "PUT",
                  headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
                });
                await new Promise((resolve) => setTimeout(resolve, 250));
              }, "addReaction");
              await addReaction("\u{1F44D}");
              await addReaction("\u274C");
              if (imageBytes) {
                const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;
                const followUpResponse = await fetch(followUpUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    content: "**Keep or Mulligan?** *(Others can vote with reactions on the post above)*",
                    components: createCardButtons(sessionId, 0),
                    flags: 64
                  })
                });
                if (!followUpResponse.ok) {
                  console.error("Failed to send ephemeral buttons:", await followUpResponse.text());
                }
              }
            } catch (error3) {
              console.error("Command processing error:", error3 instanceof Error ? error3.message : error3);
              const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
              await fetch(webhookUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  embeds: [podEmbed, {
                    title: "\u26A0\uFE0F Card Image Error",
                    description: "Could not generate card image. The pod has been generated above.",
                    color: 16705372
                  }]
                })
              });
            }
          }, "processCommand");
          ctx.waitUntil(processCommand());
          return jsonResponse14({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
          });
        }
      }
    }
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      const customId = interaction.data.custom_id;
      const [action, sessionId] = customId.split(":");
      const sessionService = new SessionService(env2.DB);
      const context2 = await sessionService.getContext(sessionId);
      if (!context2) {
        return jsonResponse14({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: "\u274C Session expired. Please generate a new pod.",
            components: []
          }
        });
      }
      const { moxfieldDeckId, channelId, messageId, userSeat } = context2;
      if (action === "keep") {
        try {
          await sessionService.resolve(sessionId);
        } catch (error3) {
          console.error("Failed to resolve session:", error3);
        }
        if (!messageId) {
          return jsonResponse14({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: "\u2705 Hand kept! Good luck!",
              components: []
            }
          });
        }
        const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
        let mulliganCount = 0;
        try {
          mulliganCount = await sessionService.getMulliganCount(sessionId);
        } catch {
        }
        const getMsgResponse = await fetch(editUrl, {
          headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
        });
        if (getMsgResponse.ok) {
          const existingMsg = await getMsgResponse.json();
          const podEmbed = existingMsg.embeds[0];
          const cardEmbed = existingMsg.embeds[1];
          const imageUrl = cardEmbed?.image?.url || existingMsg.attachments?.[0]?.url;
          if (imageUrl) {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
              const imageBytes = await imageResponse.arrayBuffer();
              const formData = new FormData();
              formData.append("files[0]", new Blob([imageBytes], { type: "image/jpeg" }), "cards.jpg");
              formData.append("payload_json", JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: cardEmbed?.description,
                    image: { url: "attachment://cards.jpg" },
                    color: 5793266,
                    footer: { text: getKeptText(mulliganCount) }
                  }
                ]
              }));
              await fetch(editUrl, {
                method: "PATCH",
                headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` },
                body: formData
              });
            }
          }
          const deleteReactionsUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
          await fetch(deleteReactionsUrl, {
            method: "DELETE",
            headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
          });
        }
        return jsonResponse14({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: "\u2705 Hand kept! Good luck!",
            components: []
          }
        });
      }
      if (action === "mulligan") {
        if (!messageId) {
          return jsonResponse14({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: "\u274C Session not ready. Please try again.",
              components: []
            }
          });
        }
        let newMulliganCount = 1;
        try {
          newMulliganCount = await sessionService.incrementMulligan(sessionId);
        } catch (error3) {
          console.error("Failed to increment mulligan:", error3);
        }
        const interactionToken = interaction.token;
        const applicationId = env2.DISCORD_APPLICATION_ID;
        const doMulligan = /* @__PURE__ */ __name(async () => {
          try {
            const deck = await fetchMoxfieldDeck(moxfieldDeckId, env2.MOXFIELD_API_KEY, env2.DECK_CACHE);
            const cards = getRandomMainboardCards(deck, 7);
            const requestedIds = cards.map((c) => c.scryfallId).filter(Boolean);
            const cardData = await fetchCardImages(requestedIds);
            const actualHandScryfallIds = cardData.map((c) => c.scryfallId);
            const imageUrls = cardData.map((c) => c.imageUrl);
            if (imageUrls.length === 0) {
              throw new Error("No card images found");
            }
            const imageBytes = await compositeCardImages(imageUrls);
            const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
            const getMsgResponse = await fetch(editUrl, {
              headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
            });
            if (getMsgResponse.ok) {
              const existingMsg = await getMsgResponse.json();
              const podEmbed = existingMsg.embeds[0];
              const pod = parsePodFromEmbed(podEmbed.description || "", userSeat);
              const embedDescription = buildCardEmbedDescription(moxfieldDeckId, pod, actualHandScryfallIds);
              const formData = new FormData();
              formData.append("files[0]", new Blob([imageBytes], { type: "image/jpeg" }), "cards.jpg");
              formData.append("payload_json", JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: embedDescription,
                    image: { url: "attachment://cards.jpg" },
                    color: 5793266,
                    footer: { text: getHandSizeText(newMulliganCount) }
                  }
                ]
              }));
              await fetch(editUrl, {
                method: "PATCH",
                headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` },
                body: formData
              });
              const deleteUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
              await fetch(deleteUrl, {
                method: "DELETE",
                headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
              });
              await new Promise((resolve) => setTimeout(resolve, 300));
              const addReaction = /* @__PURE__ */ __name(async (emoji) => {
                const encodedEmoji = encodeURIComponent(emoji);
                const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
                await fetch(url, {
                  method: "PUT",
                  headers: { "Authorization": `Bot ${env2.DISCORD_BOT_TOKEN}` }
                });
                await new Promise((resolve) => setTimeout(resolve, 250));
              }, "addReaction");
              await addReaction("\u{1F44D}");
              await addReaction("\u274C");
            }
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            await fetch(webhookUrl, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `**Keep or Mulligan?** (Mulligan ${newMulliganCount})`,
                components: createCardButtons(sessionId, newMulliganCount)
              })
            });
          } catch (error3) {
            console.error("Mulligan error:", error3 instanceof Error ? error3.message : error3);
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            let currentCount = newMulliganCount - 1;
            try {
              currentCount = await sessionService.getMulliganCount(sessionId);
            } catch {
            }
            await fetch(webhookUrl, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: "\u26A0\uFE0F Error generating new hand. Try again.",
                components: createCardButtons(sessionId, currentCount)
              })
            });
          }
        }, "doMulligan");
        ctx.waitUntil(doMulligan());
        let displayCount = 0;
        try {
          displayCount = await sessionService.getMulliganCount(sessionId);
        } catch {
          displayCount = newMulliganCount - 1;
        }
        return jsonResponse14({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: "\u23F3 **Shuffling new hand...**",
            components: createCardButtons(sessionId, displayCount, true)
          }
        });
      }
    }
    return new Response("Unknown interaction type", { status: 400 });
  },
  // Scheduled handler for cleaning up old sessions
  async scheduled(_event, env2, _ctx) {
    const sessionService = new SessionService(env2.DB);
    const deletedCount = await sessionService.cleanupOldSessions(24);
    console.log(`[Scheduled] Cleaned up ${deletedCount} stale mulligan sessions`);
  }
};
export {
  worker_default as default
};
/*! Bundled license information:

@cf-wasm/photon/dist/chunk-3HOZTLH2.js:
  (*! Needed to remove these lines in order to make it work on next.js *)
  (*! Needed to remove these lines in order to make it work on node.js *)
*/
//# sourceMappingURL=worker.js.map
