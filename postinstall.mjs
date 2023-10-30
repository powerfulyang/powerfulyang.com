import { execSync } from 'node:child_process';

if (process.env.CF_PAGES !== '1') {
  execSync('npx husky install', { stdio: 'inherit' });
} else {
  execSync('npx next telemetry disable', { stdio: 'inherit' });
}
