// src/tinynn/spelled-keys.js — D1a spelled-keys builders + supervision (DRAFT, Detour D1 v1.1).
// Byte layout FROZEN (R1 patch): alphabet a-h ids 10-17, values 4-7 (answer = id-4),
// SEP=18, query marker ?=8, keys fixed-3, values atomic, no TERM in D1a.
// Pair = [c1,c2,c3,SEP,val]; query = [q1,q2,q3,SEP,8]; x = pairs + query; y = val-4.
// Zero-dep (no DOM); loads after train.js (uses window.__tinyNN.makeRng).
// Partition: all 64 fixed-3 keys, seeded shuffle -> 48 train / 16 held-out.
// Pool uses train keys only; killHu-spelled uses held-out keys only (target+distractors).
(function () {
"use strict";
var G = (typeof window !== "undefined" && window.__tinyNN) ? window.__tinyNN : null;
var ALPHA = [10, 11, 12, 13, 14, 15, 16, 17];
var SEP = 18, QMARK = 8, KEYLEN = 3;
var N_TRAIN_KEYS = 384; // 8^3=512 fixed-3 keys; 384 train / 128 held (75/25)

function allKeys() {
  var out = [];
  for (var a = 0; a < 8; a++) for (var b = 0; b < 8; b++) for (var c = 0; c < 8; c++)
    out.push([ALPHA[a], ALPHA[b], ALPHA[c]]);
  return out;
}
function sameKey(k1, k2) { return k1[0] === k2[0] && k1[1] === k2[1] && k1[2] === k2[2]; }
function partition(poolSeed) {
  if (!G) throw new Error("spelled-keys: __tinyNN not loaded");
  var rng = G.makeRng(poolSeed), keys = allKeys();
  for (var i = keys.length - 1; i > 0; i--) {
    var j = rng.int(i + 1), t = keys[i];
    keys[i] = keys[j]; keys[j] = t;
  }
  return { train: keys.slice(0, N_TRAIN_KEYS), held: keys.slice(N_TRAIN_KEYS) };
}
function rv(rng, n) { return rng.int(n); }
function shortLine(rng, keys) {
  var nPairs = 1 + rv(rng, 3), pairs = [], used = {}, vals = [];
  while (pairs.length < nPairs) {
    var k = keys[rv(rng, keys.length)], id = k.join(",");
    if (used[id]) continue;
    used[id] = 1;
    var v = rv(rng, 4);
    pairs.push({ key: k, val: v }); vals.push(v);
  }
  var qi = rv(rng, nPairs), x = [];
  for (var i = 0; i < nPairs; i++) x.push(pairs[i].key[0], pairs[i].key[1], pairs[i].key[2], SEP, 4 + pairs[i].val);
  var q = pairs[qi].key;
  x.push(q[0], q[1], q[2], SEP, QMARK);
  return { x: x, y: vals[qi], form: "short" };
}
function longLine(rng, keys) {
  var tk = keys[rv(rng, keys.length)], tv = rv(rng, 4), pos = rv(rng, 9), x = [];
  for (var s = 0; s < 9; s++) {
    if (s === pos) { x.push(tk[0], tk[1], tk[2], SEP, 4 + tv); continue; }
    var dk = keys[rv(rng, keys.length)], guard = 0;
    while (sameKey(dk, tk) && guard++ < 50) dk = keys[rv(rng, keys.length)];
    x.push(dk[0], dk[1], dk[2], SEP, 4 + rv(rng, 4));
  }
  x.push(tk[0], tk[1], tk[2], SEP, QMARK);
  return { x: x, y: tv, form: "long" };
}
function buildPool(poolSeed, trainKeys) {
  if (!G) throw new Error("spelled-keys: __tinyNN not loaded");
  var rng = G.makeRng(poolSeed), data = [], i;
  for (i = 0; i < 500; i++) data.push(shortLine(rng, trainKeys));
  for (i = 0; i < 500; i++) data.push(longLine(rng, trainKeys));
  return data;
}
// Tutor-gate exam: long-form, train keys (same distribution as pool long half).
function killASpelled(seed, trainKeys) {
  if (!G) throw new Error("spelled-keys: __tinyNN not loaded");
  var rng = G.makeRng(seed), data = [];
  for (var i = 0; i < 200; i++) data.push(longLine(rng, trainKeys));
  return data;
}
// Student exam: long-form, held-out keys only (target + distractors).
function killHuSpelled(seed, heldKeys) {
  if (!G) throw new Error("spelled-keys: __tinyNN not loaded");
  var rng = G.makeRng(seed), data = [];
  for (var i = 0; i < 200; i++) data.push(longLine(rng, heldKeys));
  return data;
}
// Parse x into pairs; return value-token index of first key-match, else -1.
function attnTarget(ex) {
  var x = ex.x, nPairs = (x.length - 5) / 5;
  if (nPairs !== Math.floor(nPairs) || nPairs < 1) return -1;
  var q0 = x[x.length - 5], q1 = x[x.length - 4], q2 = x[x.length - 3];
  if (x[x.length - 2] !== SEP || x[x.length - 1] !== QMARK) return -1;
  for (var p = 0; p < nPairs; p++) {
    var o = p * 5;
    if (x[o + 3] !== SEP) return -1;
    if (x[o] === q0 && x[o + 1] === q1 && x[o + 2] === q2) return o + 4;
  }
  return -1;
}
// Mirror of train.js attnSupervision for spelled layout (idx = value-token index).
function attnSupervisionSpelled(ex, fw) {
  var steps = fw && fw.cache && fw.cache.steps;
  if (!steps) return null;
  var last = steps[steps.length - 1];
  if (!last || !last.att) return null;
  var idx = attnTarget(ex), n = last.att.n;
  if (idx < 0 || idx >= n) return null;
  var w = last.att.w[idx], dw = new Float64Array(n);
  dw[idx] = -1 / (w + 1e-9);
  return { loss: -Math.log(w + 1e-9), dw: dw };
}
var api = {
  ALPHA: ALPHA, SEP: SEP, QMARK: QMARK, KEYLEN: KEYLEN, VOCAB: 19, CLASSES: 4,
  allKeys: allKeys, partition: partition, buildPool: buildPool,
  killASpelled: killASpelled, killHuSpelled: killHuSpelled,
  attnTarget: attnTarget, attnSupervisionSpelled: attnSupervisionSpelled
};
if (typeof window !== "undefined") window.SpelledKeys = api;
})();
