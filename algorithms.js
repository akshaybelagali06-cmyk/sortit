/**
 * Compatibility shim — prefer src/data/algorithmRegistry.js.
 */
export {
  ALGORITHMS,
  ALGORITHM_METADATA,
  ALGORITHM_KEYS,
  algorithmRegistry,
  getAlgorithm,
  listAlgorithms,
  runSelfTests,
} from './src/data/algorithmRegistry.js';
