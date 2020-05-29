import { calcVotes } from './calcVotes.js';

const reportFilename = 'public/data/nabu/2020/public_report.txt';
const candidatesFilename = 'public/data/nabu/2020/candidates.json';
const outputFilename = 'public/data/nabu/2020/results.json';

const decoder = new TextDecoder('utf-8');
const readFile = async (filename: string) => {
  const file = await Deno.open(filename);
  return decoder.decode(await Deno.readAll(file));
}

const encoder = new TextEncoder();
const writeJSON = async (filename: string, data: object) => {
  const file = await Deno.open(filename, { create: true, truncate: true, write: true });
  return await Deno.writeAll(file, encoder.encode(JSON.stringify(data)));
}

const reportText = await readFile(reportFilename);
const candidates = JSON.parse(await readFile(candidatesFilename));
const votes = calcVotes({ publicReport: reportText, candidates });

await writeJSON(outputFilename, votes);

console.log('written to ' + outputFilename);
