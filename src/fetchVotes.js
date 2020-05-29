import { calcVotes } from './calcVotes.js';

export function fetchVotes({ candidatesUrl, reportUrl, resultsUrl }) {
  if (resultsUrl) {
    return fetch(resultsUrl).then(res => res.json()).then((results) => {
      return results;
    });
  }
  else
  return fetch(candidatesUrl).then((res) => res.json()).then((candidatesData) => {
    return fetch(reportUrl).then(function(res) {
      return res.text();
    }).then(function(body) {
      return calcVotes({ publicReport: body, candidates: candidatesData });
    });
  });
}
