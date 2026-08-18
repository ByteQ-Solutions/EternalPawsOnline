/**
 * Eternal Paws Platform - Unified Test Execution Harness & Runner
 * 
 * Standalone, lightweight test execution framework with full BDD syntax (describe, it, test, expect),
 * deep assertion matchers, async test execution, and comprehensive pass/fail summary reporting.
 */

import { registerR1DesignSystemTests } from '../tier1-feature-coverage/r1-design-system.test';
import { registerR2WebPlatformTests } from '../tier1-feature-coverage/r2-web-platform.test';
import { registerR3TrustEngineTests } from '../tier1-feature-coverage/r3-trust-engine.test';
import { registerR4DiscoveryTests } from '../tier1-feature-coverage/r4-discovery.test';
import { registerR5EngagementCmsTests } from '../tier1-feature-coverage/r5-engagement-cms.test';
import { registerR6MonetizationTests } from '../tier1-feature-coverage/r6-monetization.test';

export interface TestResult {
  suiteName: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  error?: Error | string;
}

export interface SuiteResult {
  suiteName: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  durationMs: number;
}

export interface RunSummary {
  totalSuites: number;
  totalTests: number;
  passed: number;
  failed: number;
  durationMs: number;
  suiteResults: SuiteResult[];
}

type TestFn = () => void | Promise<void>;
type HookFn = () => void | Promise<void>;

interface TestCase {
  name: string;
  fn: TestFn;
}

interface Suite {
  name: string;
  tests: TestCase[];
  beforeEachHooks: HookFn[];
  afterEachHooks: HookFn[];
}

class TestRegistry {
  private suites: Suite[] = [];
  private currentSuite: Suite | null = null;

  describe(name: string, fn: () => void): void {
    const previousSuite = this.currentSuite;
    const suite: Suite = {
      name,
      tests: [],
      beforeEachHooks: [],
      afterEachHooks: []
    };
    this.suites.push(suite);
    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = previousSuite;
    }
  }

  it(name: string, fn: TestFn): void {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => {
        this.currentSuite!.tests.push({ name, fn });
      });
    } else {
      this.currentSuite.tests.push({ name, fn });
    }
  }

  test(name: string, fn: TestFn): void {
    this.it(name, fn);
  }

  beforeEach(fn: HookFn): void {
    if (this.currentSuite) {
      this.currentSuite.beforeEachHooks.push(fn);
    }
  }

  afterEach(fn: HookFn): void {
    if (this.currentSuite) {
      this.currentSuite.afterEachHooks.push(fn);
    }
  }

  clear(): void {
    this.suites = [];
    this.currentSuite = null;
  }

  getSuites(): Suite[] {
    return this.suites;
  }
}

export const registry = new TestRegistry();

export const describe = (name: string, fn: () => void) => registry.describe(name, fn);
export const it = (name: string, fn: TestFn) => registry.it(name, fn);
export const test = (name: string, fn: TestFn) => registry.test(name, fn);
export const beforeEach = (fn: HookFn) => registry.beforeEach(fn);
export const afterEach = (fn: HookFn) => registry.afterEach(fn);

// ============================================================================
// Matchers & Expect Assertion Engine
// ============================================================================

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

export class Expectation {
  constructor(private actual: any, private isNot: boolean = false) {}

  get not(): Expectation {
    return new Expectation(this.actual, !this.isNot);
  }

  private assert(condition: boolean, message: string): void {
    const passed = this.isNot ? !condition : condition;
    if (!passed) {
      throw new Error(this.isNot ? `Expected NOT to: ${message}` : `Expected: ${message}`);
    }
  }

  toBe(expected: any): void {
    this.assert(
      this.actual === expected,
      `receive exact value ${JSON.stringify(expected)}, but received ${JSON.stringify(this.actual)}`
    );
  }

  toEqual(expected: any): void {
    this.assert(
      deepEqual(this.actual, expected),
      `deep equal ${JSON.stringify(expected, null, 2)}, but received ${JSON.stringify(this.actual, null, 2)}`
    );
  }

  toBeTruthy(): void {
    this.assert(
      Boolean(this.actual),
      `value to be truthy, but received ${JSON.stringify(this.actual)}`
    );
  }

  toBeFalsy(): void {
    this.assert(
      !this.actual,
      `value to be falsy, but received ${JSON.stringify(this.actual)}`
    );
  }

  toBeNull(): void {
    this.assert(
      this.actual === null,
      `value to be null, but received ${JSON.stringify(this.actual)}`
    );
  }

  toBeUndefined(): void {
    this.assert(
      this.actual === undefined,
      `value to be undefined, but received ${JSON.stringify(this.actual)}`
    );
  }

  toBeDefined(): void {
    this.assert(
      this.actual !== undefined,
      `value to be defined, but received undefined`
    );
  }

  toBeGreaterThan(expected: number): void {
    this.assert(
      typeof this.actual === 'number' && this.actual > expected,
      `number ${this.actual} to be > ${expected}`
    );
  }

  toBeGreaterThanOrEqual(expected: number): void {
    this.assert(
      typeof this.actual === 'number' && this.actual >= expected,
      `number ${this.actual} to be >= ${expected}`
    );
  }

  toBeLessThan(expected: number): void {
    this.assert(
      typeof this.actual === 'number' && this.actual < expected,
      `number ${this.actual} to be < ${expected}`
    );
  }

  toBeLessThanOrEqual(expected: number): void {
    this.assert(
      typeof this.actual === 'number' && this.actual <= expected,
      `number ${this.actual} to be <= ${expected}`
    );
  }

  toBeCloseTo(expected: number, precision: number = 2): void {
    const diff = Math.abs(this.actual - expected);
    const tolerance = Math.pow(10, -precision) / 2;
    this.assert(
      diff <= tolerance,
      `number ${this.actual} to be close to ${expected} within precision ${precision} (diff: ${diff})`
    );
  }

  toContain(item: any): void {
    if (typeof this.actual === 'string') {
      this.assert(
        this.actual.includes(String(item)),
        `string "${this.actual}" to contain "${item}"`
      );
    } else if (Array.isArray(this.actual)) {
      this.assert(
        this.actual.some(x => deepEqual(x, item) || x === item),
        `array ${JSON.stringify(this.actual)} to contain ${JSON.stringify(item)}`
      );
    } else {
      this.assert(false, `toContain called on unsupported type ${typeof this.actual}`);
    }
  }

  toMatch(regex: RegExp | string): void {
    const re = typeof regex === 'string' ? new RegExp(regex) : regex;
    this.assert(
      typeof this.actual === 'string' && re.test(this.actual),
      `string "${this.actual}" to match pattern ${re}`
    );
  }

  toHaveLength(expectedLength: number): void {
    const len = this.actual?.length;
    this.assert(
      len === expectedLength,
      `length of object to be ${expectedLength}, but got ${len}`
    );
  }

  toThrow(expectedError?: string | RegExp): void {
    if (typeof this.actual !== 'function') {
      throw new Error(`toThrow matcher expects a function, but got ${typeof this.actual}`);
    }
    let threw = false;
    let thrownErr: any = null;
    try {
      this.actual();
    } catch (err) {
      threw = true;
      thrownErr = err;
    }
    this.assert(threw, `function to throw an error, but it returned normally`);

    if (threw && expectedError) {
      const errMsg = thrownErr?.message || String(thrownErr);
      if (typeof expectedError === 'string') {
        this.assert(
          errMsg.includes(expectedError),
          `thrown error message "${errMsg}" to contain "${expectedError}"`
        );
      } else {
        this.assert(
          expectedError.test(errMsg),
          `thrown error message "${errMsg}" to match regex ${expectedError}`
        );
      }
    }
  }
}

export function expect(actual: any): Expectation {
  return new Expectation(actual);
}

// ============================================================================
// Suite Execution Runner
// ============================================================================

export async function runAllSuites(): Promise<RunSummary> {
  const suites = registry.getSuites();
  const suiteResults: SuiteResult[] = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  const startGlobal = Date.now();

  console.log(`\n===============================================================`);
  console.log(`🚀 RUNNING ETERNAL PAWS TEST SUITE (${suites.length} Suites Registered)`);
  console.log(`===============================================================\n`);

  for (const suite of suites) {
    const suiteStart = Date.now();
    const testResults: TestResult[] = [];
    let suitePassed = 0;
    let suiteFailed = 0;

    console.log(`📦 Suite: ${suite.name}`);

    for (const testCase of suite.tests) {
      totalTests++;
      const tStart = Date.now();
      let passed = true;
      let error: any = undefined;

      try {
        // Run beforeEach hooks
        for (const hook of suite.beforeEachHooks) {
          await hook();
        }
        // Run test
        await testCase.fn();
        // Run afterEach hooks
        for (const hook of suite.afterEachHooks) {
          await hook();
        }
        suitePassed++;
        totalPassed++;
        console.log(`  ✓ ${testCase.name} (${Date.now() - tStart}ms)`);
      } catch (err: any) {
        passed = false;
        suiteFailed++;
        totalFailed++;
        error = err;
        console.error(`  ✗ ${testCase.name} (${Date.now() - tStart}ms)`);
        console.error(`    Error: ${err?.message || err}`);
      }

      testResults.push({
        suiteName: suite.name,
        testName: testCase.name,
        passed,
        durationMs: Date.now() - tStart,
        error: error?.message || error
      });
    }

    const suiteDuration = Date.now() - suiteStart;
    suiteResults.push({
      suiteName: suite.name,
      tests: testResults,
      passed: suitePassed,
      failed: suiteFailed,
      durationMs: suiteDuration
    });
    console.log(`  Summary: ${suitePassed} passed, ${suiteFailed} failed (${suiteDuration}ms)\n`);
  }

  const durationMs = Date.now() - startGlobal;
  const summary: RunSummary = {
    totalSuites: suites.length,
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    durationMs,
    suiteResults
  };

  console.log(`===============================================================`);
  console.log(`📊 FINAL TEST RUN SUMMARY`);
  console.log(`===============================================================`);
  console.log(`Total Suites: ${suites.length}`);
  console.log(`Total Tests:  ${totalTests}`);
  console.log(`Passed:       ${totalPassed} ✓`);
  console.log(`Failed:       ${totalFailed} ✗`);
  console.log(`Duration:     ${durationMs}ms`);
  console.log(`Status:       ${totalFailed === 0 ? 'ALL PASSED ✨' : 'FAILURES DETECTED ❌'}`);
  console.log(`===============================================================\n`);

  return summary;
}

export function registerTier1Suites(): void {
  registry.clear();
  registerR1DesignSystemTests();
  registerR2WebPlatformTests();
  registerR3TrustEngineTests();
  registerR4DiscoveryTests();
  registerR5EngagementCmsTests();
  registerR6MonetizationTests();
}

export async function runTier1Suite(): Promise<RunSummary> {
  registerTier1Suites();
  return runAllSuites();
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('test-runner')) {
  runTier1Suite().then(summary => {
    if (summary.failed > 0) {
      process.exit(1);
    }
  }).catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
}

