import { calcVotes } from './calcVotes.js';

function getResults({ candidates, resultsUrl, reportUrl }) {
  if (resultsUrl) {
    return fetch(resultsUrl).then(res => res.json()).then((results) => {
      return results;
    });
  } else {
    return fetch(reportUrl).then(function(res) {
      return res.text();
    }).then(function(body) {
      return calcVotes({ publicReport: body, candidates });
    });
  }
}

export function fetchVotes({ candidatesUrl, reportUrl, resultsUrl }) {
  return fetch(candidatesUrl)
  .then((res) => res.json())
  .then((candidatesData) => {
    return getResults({ candidates: candidatesData, resultsUrl, reportUrl })
    .then(results => {
      candidatesData.candidates.forEach((candidate) => {
        results.votes[candidate.id].info = candidate;
      });
      return results;
    });
  })
}
